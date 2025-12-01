import { NextRequest } from "next/server";

export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

// Simple token verification (in production, use JWT or database lookup)
function verifyToken(token: string): boolean {
  if (!token) return false;
  
  try {
    const decoded = atob(token);
    const [timestamp] = decoded.split("-");
    const tokenAge = Date.now() - parseInt(timestamp);
    
    // Token expires after 2 hours
    return tokenAge < 2 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function verifyRequestAuth(request: NextRequest): AuthResult {
  try {
    // Get token from header
    const token = request.headers.get("x-auth-token") || 
                  request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return { authenticated: false, error: "No authentication token provided" };
    }

    if (!verifyToken(token)) {
      return { authenticated: false, error: "Invalid or expired token" };
    }

    return { authenticated: true };
  } catch (error: any) {
    return { authenticated: false, error: error.message || "Authentication failed" };
  }
}

