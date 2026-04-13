export type Category =
  | "food"
  | "housing"
  | "workspace"
  | "coffee"
  | "gym"
  | "bars"
  | "grocery"
  | "startup"
  | "entertainment"
  | "services"
  | "other";

export interface Place {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  address: string;
  neighborhood: string;
  description: string;
  price_tier: 1 | 2 | 3 | 4;
  avg_price?: number | string;
  tags: string[];
  lat: number;
  lng: number;
  image_url?: string;
  website?: string;
  status: "pending" | "approved" | "rejected";
  vote_count: number;
  votes_needed: number;
  submitted_by: string;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  place_id: string;
  user_fingerprint: string;
  created_at: string;
}

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "food", label: "Food", icon: "🍽️" },
  { value: "housing", label: "Housing", icon: "🏠" },
  { value: "workspace", label: "Work Spots", icon: "💻" },
  { value: "coffee", label: "Coffee", icon: "☕" },
  { value: "startup", label: "Accelerators", icon: "🚀" },
  { value: "gym", label: "Gym & Fitness", icon: "💪" },
  { value: "bars", label: "Bars & Drinks", icon: "🍺" },
  { value: "grocery", label: "Grocery", icon: "🛒" },
  { value: "entertainment", label: "Entertainment", icon: "🎭" },
  { value: "services", label: "Services", icon: "✂️" },
  { value: "other", label: "Other", icon: "📍" },
];

export const PRICE_TIERS: Record<number, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export const NEIGHBORHOODS = [
  "Mission District",
  "SoMa",
  "Castro",
  "Haight-Ashbury",
  "Marina",
  "North Beach",
  "Chinatown",
  "Financial District",
  "Tenderloin",
  "Hayes Valley",
  "Nob Hill",
  "Pacific Heights",
  "Richmond",
  "Sunset",
  "Potrero Hill",
  "Dogpatch",
  "Noe Valley",
  "Inner Sunset",
  "Outer Sunset",
  "Bernal Heights",
  "Glen Park",
  "Excelsior",
  "Bayview",
  "Visitacion Valley",
  "Other",
];
