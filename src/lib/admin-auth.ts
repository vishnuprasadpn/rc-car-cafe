import { Session } from "next-auth"

/**
 * Authorized admin email - only this admin can delete data
 */
export const AUTHORIZED_DELETE_ADMIN_EMAIL = "vishnuprasad1990@gmail.com"

/**
 * Check if the current session user is the authorized admin for delete operations
 * @param session - NextAuth session object
 * @returns true if user is the authorized admin, false otherwise
 */
export function isAuthorizedDeleteAdmin(session: Session | null): boolean {
  if (!session || !session.user) {
    return false
  }

  const userEmail = (session.user as { email?: string }).email
  return userEmail?.toLowerCase() === AUTHORIZED_DELETE_ADMIN_EMAIL.toLowerCase()
}

/**
 * Check if the current session user is an admin
 * @param session - NextAuth session object
 * @returns true if user is an admin, false otherwise
 */
export function isAdmin(session: Session | null): boolean {
  if (!session || !session.user) {
    return false
  }

  const userRole = (session.user as { role?: string }).role
  return userRole === "ADMIN"
}

