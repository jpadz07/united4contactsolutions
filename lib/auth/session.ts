// Session management for admin authentication

const SESSION_KEY = "u4cs_admin_session";
const REMEMBER_ME_KEY = "u4cs_remember_me";
const SAVED_EMAIL_KEY = "u4cs_saved_email";
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export interface AdminSession {
  email: string;
  token: string;
  expiresAt: number;
  rememberMe?: boolean;
}

export function createSession(email: string, rememberMe: boolean = false): AdminSession {
  const token = generateToken();
  const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
  const expiresAt = Date.now() + duration;
  
  const session: AdminSession = {
    email,
    token,
    expiresAt,
    rememberMe,
  };
  
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    // Store remember me preference and email
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, "true");
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }
  }
  
  return session;
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    
    const session: AdminSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  const session = getSession();
  return session !== null;
}

export function extendSession(): void {
  const session = getSession();
  if (session) {
    const duration = session.rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
    session.expiresAt = Date.now() + duration;
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }
}

// Get saved email if remember me was previously checked
export function getSavedEmail(): string | null {
  if (typeof window === "undefined") return null;
  
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY);
  if (rememberMe === "true") {
    return localStorage.getItem(SAVED_EMAIL_KEY);
  }
  return null;
}

// Check if remember me was previously enabled
export function wasRememberMeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

function generateToken(): string {
  // Generate a simple token (in production, use a more secure method)
  return btoa(`${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);
}

// Verify token matches session
export function verifyToken(token: string): boolean {
  const session = getSession();
  return session?.token === token;
}

