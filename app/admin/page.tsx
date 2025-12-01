"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createSession, isAuthenticated, getSession, getSavedEmail, wasRememberMeEnabled } from "@/lib/auth/session";
import { generateSecureDashboardUrl } from "@/lib/auth/url-encryption";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved email if remember me was previously checked
  useEffect(() => {
    const savedEmail = getSavedEmail();
    const wasRemembered = wasRememberMeEnabled();
    
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(wasRemembered);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const session = getSession();
      if (session) {
        const secureUrl = generateSecureDashboardUrl(session.token);
        router.push(secureUrl);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        setIsSubmitting(false);
        return;
      }

      if (data.success && data.session) {
        // Store session with remember me preference
        const session = createSession(data.session.email, rememberMe);
        // Redirect to dashboard with encrypted URL
        const secureUrl = generateSecureDashboardUrl(session.token);
        router.push(secureUrl);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm text-blue-300 uppercase tracking-[0.3em] mb-2">
            Admin Access
          </p>
          <h1 className="text-3xl font-semibold text-white">Sign in to Dashboard</h1>
          <p className="text-gray-400 text-sm mt-2">
            Secure login for United4ContactSolutions administrators
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@united4contactsolutions.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-600 bg-black text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-blue-400 hover:text-blue-300">
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-500/20 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Access restricted to authorized United4ContactSolutions personnel.
          </p>
        </div>
      </div>
    </div>
  );
}

