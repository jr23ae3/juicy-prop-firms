const SELECTED_PLAN_KEY = "juicy-trades-selected-plan-id";

export function getSelectedPlanId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SELECTED_PLAN_KEY);
}

export function saveSelectedPlanId(planId: string | null) {
  if (typeof window === "undefined") return;
  if (!planId) {
    window.localStorage.removeItem(SELECTED_PLAN_KEY);
    return;
  }
  window.localStorage.setItem(SELECTED_PLAN_KEY, planId);
}
