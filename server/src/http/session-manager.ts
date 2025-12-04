/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-03 19:31:54
 */
import type { SessionRecord } from "../types";

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
