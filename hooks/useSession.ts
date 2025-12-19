"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
}

export function useSession() {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setSession({ user: data.user });
        } else {
          setSession(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setSession(null);
        setLoading(false);
      });
  }, []);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    window.location.href = "/";
  };

  return {
    data: session,
    status: loading ? "loading" : session ? "authenticated" : "unauthenticated",
    signOut,
  };
}

