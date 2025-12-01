// Session management for admin authentication

const SESSION_KEY = "u4cs_admin_session";
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export interface AdminSession {
  email: string;
  token: string;
  expiresAt: number;
}

export function createSession(email: string): AdminSession {
  const token = generateToken();
  const expiresAt = Date.now() + SESSION_DURATION;
  
  const session: AdminSession = {
    email,
    token,
    expiresAt,
  };
  
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
    session.expiresAt = Date.now() + SESSION_DURATION;
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }
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

