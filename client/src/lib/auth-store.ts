'use client';

// server/src/lib/auth-store.ts
// ── In-memory token storage ───────────────────────────────────────────────
// accessToken is kept ONLY in memory (module-level closure).
// It is NEVER written to localStorage or sessionStorage.
//
// refreshToken lives in an httpOnly cookie set by the server.
// JavaScript cannot read it — the browser sends it automatically
// with every fetch(..., { credentials: 'include' }) call.
//
// On page refresh, _accessToken resets to null.
// The api.ts request() function detects the 401 and calls
// /auth/refresh, which reads the cookie and issues a new accessToken.

let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string): void {
  _accessToken = token;
}

export function clearAccessToken(): void {
  _accessToken = null;
}