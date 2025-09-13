import { removeCookie } from "./cookie";

// Utility function, not a hook
export function logout() {
  removeCookie("access_token");
  sessionStorage.clear();
  window.location.href = "/login";
}