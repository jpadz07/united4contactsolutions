// Admin credentials management
// In production, these should be stored securely (e.g., in Supabase, environment variables, or a secure vault)

export interface AdminCredentials {
  email: string;
  passwordHash: string; // In production, use bcrypt or similar
}

// For now, using simple comparison. In production, use proper password hashing
const ADMIN_CREDENTIALS: AdminCredentials[] = [
  {
    email: "admin@united4contactsolutions.com",
    passwordHash: "SecurePass123!", // In production, hash this with bcrypt
  },
];

export function verifyCredentials(email: string, password: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = ADMIN_CREDENTIALS.find((c) => c.email.toLowerCase() === normalizedEmail);
  
  if (!credential) return false;
  
  // Simple comparison for now. In production, use bcrypt.compare()
  return credential.passwordHash === password;
}

export function getAdminByEmail(email: string): AdminCredentials | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return ADMIN_CREDENTIALS.find((c) => c.email.toLowerCase() === normalizedEmail);
}

