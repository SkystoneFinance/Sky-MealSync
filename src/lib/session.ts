// Session storage + sliding-expiry helpers.
// Tokens last 90 days on the server; we swap them for a fresh one at most
// once per REFRESH_INTERVAL while the app is in use, so active users
// never have to log in again.

export const TOKEN_KEY = "token";
export const USER_KEY = "user";
const REFRESHED_AT_KEY = "tokenRefreshedAt";

// Fired by the axios client when the API rejects our token.
export const SESSION_EXPIRED_EVENT = "auth:expired";

export const REFRESH_INTERVAL = 1000 * 60 * 60 * 24; // 1 day

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESHED_AT_KEY, String(Date.now()));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESHED_AT_KEY);
}

export function isRefreshDue() {
  const refreshedAt = Number(
    localStorage.getItem(REFRESHED_AT_KEY) ?? 0
  );

  return Date.now() - refreshedAt >= REFRESH_INTERVAL;
}
