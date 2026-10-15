import { User } from "../types";

const COMPUTER_EMAIL = "computer@chesstopia";

export function isComputerUser(user?: User | null): boolean {
  return user?.email === COMPUTER_EMAIL;
}

/** Friendly label for a user: "Computer", "First Last", "First", or the email. */
export default function displayName(user?: User | null): string {
  if (!user) return "Unknown";
  if (isComputerUser(user)) return "Computer";
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.name || user.email;
}
