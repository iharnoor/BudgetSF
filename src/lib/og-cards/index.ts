import type { ReactElement } from "react";
import { MovingCard } from "./moving";
import { DietCard } from "./diet";
import { PicksCard } from "./picks";
import { TripCard } from "./trip";
import { DefaultCard } from "./default";

export const ALLOWED_OG_ROUTES = ["/moving", "/diet", "/picks", "/trip"] as const;
export type AllowedOgRoute = (typeof ALLOWED_OG_ROUTES)[number];

export function isAllowedOgRoute(value: string | null): value is AllowedOgRoute {
  return value !== null && (ALLOWED_OG_ROUTES as readonly string[]).includes(value);
}

export function renderCard(route: string | null): ReactElement {
  if (!isAllowedOgRoute(route)) return DefaultCard();
  switch (route) {
    case "/moving":
      return MovingCard();
    case "/diet":
      return DietCard();
    case "/picks":
      return PicksCard();
    case "/trip":
      return TripCard();
  }
}
