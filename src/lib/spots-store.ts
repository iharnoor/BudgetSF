import { put, list, del } from "@vercel/blob";

export interface PendingSpot {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  address: string;
  neighborhood: string;
  description: string;
  price_tier: number;
  avg_price?: string;
  tags: string[];
  website?: string;
  submitted_by: string;
  submitted_at: string;
  vote_count: number;
  voters: string[]; // fingerprints to prevent double-voting
  status: "pending" | "approved";
}

const BLOB_PREFIX = "spots/";

async function getBlob(name: string): Promise<PendingSpot | null> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${name}` });
    if (blobs.length === 0) return null;
    const res = await fetch(blobs[0].url);
    return (await res.json()) as PendingSpot;
  } catch {
    return null;
  }
}

async function putBlob(spot: PendingSpot): Promise<void> {
  await put(`${BLOB_PREFIX}${spot.id}.json`, JSON.stringify(spot), {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function addSpot(
  data: Omit<PendingSpot, "id" | "vote_count" | "voters" | "status" | "submitted_at">
): Promise<PendingSpot> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const spot: PendingSpot = {
    ...data,
    id,
    submitted_at: new Date().toISOString(),
    vote_count: 0,
    voters: [],
    status: "pending",
  };
  await putBlob(spot);
  return spot;
}

export async function getPendingSpots(): Promise<PendingSpot[]> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  const spots: PendingSpot[] = [];

  for (const blob of blobs) {
    try {
      const res = await fetch(blob.url);
      const spot = (await res.json()) as PendingSpot;
      if (spot.status === "pending") {
        spots.push(spot);
      }
    } catch {
      // skip malformed entries
    }
  }

  // newest first
  spots.sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
  return spots;
}

export async function voteOnSpot(
  spotId: string,
  voterFingerprint: string
): Promise<{ vote_count: number; already_voted: boolean }> {
  const spot = await getBlob(`${spotId}.json`);
  if (!spot) throw new Error("Spot not found");

  if (spot.voters.includes(voterFingerprint)) {
    return { vote_count: spot.vote_count, already_voted: true };
  }

  spot.voters.push(voterFingerprint);
  spot.vote_count += 1;
  await putBlob(spot);

  return { vote_count: spot.vote_count, already_voted: false };
}

export async function approveSpot(spotId: string): Promise<PendingSpot> {
  const spot = await getBlob(`${spotId}.json`);
  if (!spot) throw new Error("Spot not found");

  spot.status = "approved";
  await putBlob(spot);
  return spot;
}

export async function deleteSpot(spotId: string): Promise<void> {
  const { blobs } = await list({ prefix: `${BLOB_PREFIX}${spotId}.json` });
  for (const blob of blobs) {
    await del(blob.url);
  }
}
