"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Googlelogin from "@/app/components/GoogleLoginButton";
import { useSearchParams } from "next/navigation";
import Spinner from "@/app/components/ui/RadialSpinner";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const googleloginerror = params.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    // ✅ Use NextAuth signIn with credentials
    const result = await signIn("credentials", {
      redirect: false,      // Don't auto redirect
      email,
      password,
    });
setLoading(false);
    if (result?.error) {
      setError("Invalid Credentials");
      return;
    }

    if (result?.ok) {
      // Redirect manually after successful login
      window.location.href = "/";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-700 text-center">
          Login
        </h2>
        
        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          {loading ? (
                 <div className="w-full bg-blue-400 text-white py-2.5 rounded-lg justify-center flex ">
            <Spinner bgColor="bg-white" />
            </div>
               ) : ( <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        onClick={(e) => { setLoading(true); handleSubmit(e); }}>
            Login
          </button>)}
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-[1px] bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow h-[1px] bg-gray-300"></div>
        </div>

        <Googlelogin />

        {googleloginerror === "UserNotRegistered" && (
          <div className="text-center text-red-700 px-4 py-2 rounded">
            User not registered. Contact admin.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
