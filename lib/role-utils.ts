import type { UserRole } from "./auth-context"

export const roleRoutes: Record<UserRole, string> = {
  educator: "/dashboard",
  student: "/dashboard/student",
}

export const getRoleSpecificRoute = (role: UserRole, route: string): string | null => {
  // Routes that are role-specific
  const roleRestrictedRoutes: Record<string, Record<UserRole, boolean>> = {
    "/dashboard": { educator: true, student: false },
    "/dashboard/student": { educator: false, student: true },
    "/courses": { educator: true, student: false },
    "/students": { educator: true, student: false },
    "/grades": { educator: true, student: false },
    "/messages": { educator: true, student: false },
    "/browse-courses": { educator: false, student: true },
    "/my-courses": { educator: false, student: true },
    "/my-work": { educator: false, student: true },
  }

  // Check if route has role restrictions
  for (const [restrictedRoute, roles] of Object.entries(roleRestrictedRoutes)) {
    if (route === restrictedRoute || route.startsWith(restrictedRoute + "/")) {
      if (!roles[role]) {
        return roleRoutes[role] // Redirect to role's home
      }
    }
  }

  return null // Route is allowed for this role
}
