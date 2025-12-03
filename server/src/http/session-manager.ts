import type { SessionRecord } from "../types.js";

/**
 * SSE session storage
 */
const sessions = new Map<string, SessionRecord>();

/**
 * Add a new session
 */
export function addSession(sessionId: string, record: SessionRecord): void {
  sessions.set(sessionId, record);
}

/**
 * Get a session by ID
 */
export function getSession(sessionId: string): SessionRecord | undefined {
  return sessions.get(sessionId);
}

/**
 * Remove a session by ID
 */
export function removeSession(sessionId: string): void {
  sessions.delete(sessionId);
}
