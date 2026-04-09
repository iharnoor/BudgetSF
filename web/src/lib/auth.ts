// Simple localStorage-based auth for MVP
// Users just need a display name to submit spots

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

const STORAGE_KEY = "budgetsf_user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function loginUser(name: string): User {
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}
