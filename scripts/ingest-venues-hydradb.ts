#!/usr/bin/env tsx
/**
 * Ingest every approved place from SAMPLE_PLACES into HydraDB.
 *
 * Usage:
 *   npm run ingest:hydradb
 *   # or:
 *   HYDRADB_API_KEY=xxx npx tsx scripts/ingest-venues-hydradb.ts
 *
 * SAMPLE_PLACES is the single source of truth — anything visible on the map
 * is pushed here so semantic search stays in sync.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { SAMPLE_PLACES } from "../src/lib/sample-data";
import type { Place } from "../src/lib/types";
import type { VenueData } from "../src/lib/hydradb";

// Load .env.local manually (script runs outside Next.js)
function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const rawLine of raw.split("\n")) {
      const line = rawLine.replace(/\r$/, "").trim();
      if (!line || line.startsWith("#")) continue;
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const [, k, v] = m;
      let val = v.trim();
      const quoted = /^"(.*)"$/.exec(val) || /^'(.*)'$/.exec(val);
      if (quoted) {
        val = quoted[1].replace(/\\n/g, "\n").replace(/\\r/g, "\r");
      }
      val = val.replace(/[\r\n]+$/, "");
      if (!process.env[k]) process.env[k] = val;
    }
  } catch {
    // .env.local optional
  }
}
loadEnvLocal();

// Trim: a stray trailing newline in the env var (common when the value is
// pasted into a CI secret or pulled from Vercel) corrupts the Authorization
// header, and HydraDB rejects it as "Malformed API Key".
const API_KEY = process.env.HYDRADB_API_KEY?.trim();
if (!API_KEY) {
  console.error("Missing HYDRADB_API_KEY. Set it in .env.local or the shell.");
  process.exit(1);
}
const TENANT_ID = (process.env.HYDRADB_TENANT_ID || "WealthWise").trim();
const SUB_TENANT_ID = "sf_venues";
const BASE_URL = "https://api.hydradb.com";

function placeToVenue(p: Place): VenueData {
  return {
    name: p.name,
    slug: p.id,
    category: p.category,
    subcategory: p.subcategory?.toLowerCase(),
    neighborhood: p.neighborhood,
    address: p.address,
    price_tier: p.price_tier,
    avg_price: p.avg_price !== undefined ? String(p.avg_price) : undefined,
    tags: p.tags ?? [],
    is_chain: false,
    description: p.description,
    lat: p.lat,
    lng: p.lng,
  };
}

function venueToAppSource(v: VenueData) {
  const readable = [
    `${v.name} — ${v.subcategory || v.category} in ${v.neighborhood || "San Francisco"}`,
    v.description,
    v.avg_price ? `Price: ${v.avg_price}` : `Price tier: ${"$".repeat(v.price_tier)}`,
    `Address: ${v.address}`,
    v.tags?.length ? `Tags: ${v.tags.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(". ");

  return {
    id: v.slug,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT_ID,
    title: v.name,
    source: "budgetsf",
    description: `${v.category}${v.subcategory ? "/" + v.subcategory : ""} in ${v.neighborhood || "SF"}`,
    content: {
      text: `${readable}\n\n---JSON---\n${JSON.stringify(v)}`,
    },
    metadata: {
      category: v.category,
      subcategory: v.subcategory || "",
      neighborhood: v.neighborhood || "",
      price_tier: String(v.price_tier),
    },
  };
}

async function ingest(batch: ReturnType<typeof venueToAppSource>[]) {
  const formData = new FormData();
  formData.append("tenant_id", TENANT_ID);
  formData.append("sub_tenant_id", SUB_TENANT_ID);
  formData.append("app_sources", JSON.stringify(batch));

  const res = await fetch(`${BASE_URL}/ingestion/upload_knowledge`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: formData,
  });
  const body = await res.text();
  return { status: res.status, body };
}

async function searchTest(query: string) {
  const res = await fetch(`${BASE_URL}/recall/full_recall`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenant_id: TENANT_ID,
      sub_tenant_id: SUB_TENANT_ID,
      query,
      max_results: 5,
      mode: "fast",
      alpha: "auto",
      recency_bias: 0,
    }),
  });
  const data = await res.json();
  console.log(`  [${query}] status=${res.status} chunks=${data.chunks?.length ?? 0}`);
  for (const c of (data.chunks ?? []).slice(0, 5)) {
    console.log(`    [${c.relevancy_score?.toFixed(3)}] ${c.source_title}`);
  }
}

async function main() {
  const approved = SAMPLE_PLACES.filter((p) => p.status === "approved");
  console.log(
    `Ingesting ${approved.length}/${SAMPLE_PLACES.length} approved places into HydraDB (tenant=${TENANT_ID}, sub=${SUB_TENANT_ID})\n`,
  );

  const appSources = approved.map(placeToVenue).map(venueToAppSource);

  const BATCH_SIZE = 10;
  let total = 0;
  let failed = 0;
  for (let i = 0; i < appSources.length; i += BATCH_SIZE) {
    const batch = appSources.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(appSources.length / BATCH_SIZE);
    process.stdout.write(`Batch ${batchNum}/${totalBatches} (${batch.length})... `);

    const { status, body } = await ingest(batch);
    if (status >= 200 && status < 300) {
      try {
        const parsed = JSON.parse(body);
        console.log(`ok success=${parsed.success_count ?? "?"} failed=${parsed.failed_count ?? 0}`);
        total += parsed.success_count ?? batch.length;
        failed += parsed.failed_count ?? 0;
      } catch {
        console.log(`ok (${status})`);
        total += batch.length;
      }
    } else {
      console.log(`FAIL ${status}: ${body.slice(0, 200)}`);
      failed += batch.length;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone. success=${total} failed=${failed}\n`);

  // Fail the process (and the CI job) if nothing landed or any batch errored,
  // so a dead/rotated API key shows up as a red run instead of a silent pass.
  if (total === 0 || failed > 0) {
    console.error(
      `Ingest incomplete: ${failed} failed, ${total} succeeded. ` +
        `If batches returned 401/403, the HYDRADB_API_KEY is invalid, expired, or malformed.`,
    );
    process.exit(1);
  }

  console.log("Waiting 5s for indexing...");
  await new Promise((r) => setTimeout(r, 5000));

  console.log("Smoke tests:");
  await searchTest("barber");
  await searchTest("cheap haircut");
  await searchTest("cheap burritos near Mission");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
