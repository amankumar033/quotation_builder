"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Spinner from "./ui/RadialSpinner";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-400 rounded-lg w-full text-black hover:bg-gray-100 transition disabled:opacity-70"
    >
      {loading ? (
        // Spinner
   <Spinner bgColor="bg-gray-600" />
      ) : (
        // Normal icon
        <img src="/search.png" alt="Google" className="h-5 w-5" />
      )}
      <div className="text-gray-600">
      {loading ? "Signing in..." : "Sign in with Google"}
      </div>
    </button>
  );
}
