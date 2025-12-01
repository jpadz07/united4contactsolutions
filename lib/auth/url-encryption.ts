// URL encryption utilities for secure dashboard access

/**
 * Encrypts a token to be used in the URL
 * Uses a simple XOR cipher with a secret key (in production, use stronger encryption)
 */
export function encryptToken(token: string): string {
  const secretKey = process.env.NEXT_PUBLIC_URL_SECRET_KEY || "u4cs-secret-key-2024";
  let encrypted = "";
  
  for (let i = 0; i < token.length; i++) {
    const keyChar = secretKey[i % secretKey.length];
    const encryptedChar = String.fromCharCode(
      token.charCodeAt(i) ^ keyChar.charCodeAt(0)
    );
    encrypted += encryptedChar;
  }
  
  // Base64 encode for URL safety
  return btoa(encrypted)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Decrypts a token from the URL
 */
export function decryptToken(encrypted: string): string | null {
  try {
    // Base64 decode
    let decoded = atob(
      encrypted.replace(/-/g, "+").replace(/_/g, "/")
    );
    
    const secretKey = process.env.NEXT_PUBLIC_URL_SECRET_KEY || "u4cs-secret-key-2024";
    let decrypted = "";
    
    for (let i = 0; i < decoded.length; i++) {
      const keyChar = secretKey[i % secretKey.length];
      const decryptedChar = String.fromCharCode(
        decoded.charCodeAt(i) ^ keyChar.charCodeAt(0)
      );
      decrypted += decryptedChar;
    }
    
    return decrypted;
  } catch {
    return null;
  }
}

/**
 * Generates a secure dashboard URL with encrypted token
 */
export function generateSecureDashboardUrl(token: string): string {
  const encrypted = encryptToken(token);
  return `/admin/dashboard?t=${encrypted}`;
}

/**
 * Extracts and validates token from URL
 */
export function getTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  
  const params = new URLSearchParams(window.location.search);
  const encryptedToken = params.get("t");
  
  if (!encryptedToken) return null;
  
  const decrypted = decryptToken(encryptedToken);
  return decrypted;
}

/**
 * Validates if the URL token matches the session token
 */
export function validateUrlToken(sessionToken: string, urlToken: string | null): boolean {
  if (!urlToken) return false;
  return sessionToken === urlToken;
}

