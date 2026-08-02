/** Shared domain types — expanded in Milestone 3 (Database Schema) */

export type PropFirmSlug = string;
export type PlanId = string;

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
