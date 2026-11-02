export type AccountRole = "ADMIN" | "MANAGER" | "MEMBER";

export function canCreateProjects(role: AccountRole) {
  return role === "MANAGER" || role === "ADMIN";
}

export function isAdmin(role: AccountRole) {
  return role === "ADMIN";
}
