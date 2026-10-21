import { ROLE_LABEL } from "../config/sidebar";

import type { User } from "../types/auth";

// Name to show for the signed-in user (staff name, else from email)
export function displayName(user: User | null) {
  if (!user) return "";

  if ("firstName" in user && user.firstName) {
    return `${user.firstName} ${user.lastName ?? ""}`.trim();
  }

  const email = "email" in user ? user.email : null;

  if (email) {
    const local = email.split("@")[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  return ROLE_LABEL[user.role];
}
