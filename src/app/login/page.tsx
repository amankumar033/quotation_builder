"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Googlelogin from "@/app/components/GoogleLoginButton";
import { useSearchParams } from "next/navigation";
import Spinner from "@/app/components/ui/RadialSpinner";
import { Suspense } from "react";
import Image from "next/image";

const LoginInner = () => {
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
    setLoading(true);

    try {
      // Use NextAuth's signIn function directly
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/"
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else if (result?.url) {
        // Successful login with redirect URL
        window.location.href = result.url;
      } else {
        // Fallback redirect to home
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen fixed inset-0 bg-white z-50">
      {/* Main container with margins */}
      <div className="flex flex-1  bg-white mx-38 my-13 shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-100  overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/login.png"
              alt="Travel Background"
              fill
              className="object-fit"
              priority
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1  p-8 justify-center items-center  flex flex-col">
          <img src="/plane.png" alt="Logo" className="absolute top-15 right-38" />
          <div className="w-full  max-w-md">
            <h2 className="text-4xl font-extrabold mb-6 text-blue-400 text-center">
              Welcome Back
            </h2>
            
            {error && (
              <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                />
              </div>

              {loading ? (
                <div className="w-full bg-blue-400 text-white py-3 rounded-lg justify-center flex">
                  <Spinner bgColor="bg-white" />
                </div>
              ) : ( 
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Login
                </button>
              )}
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow h-[1px] bg-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm font-medium">
                OR
              </span>
              <div className="flex-grow h-[1px] bg-gray-300"></div>
            </div>

            <Googlelogin />

            {googleloginerror === "UserNotRegistered" && (
              <div className="text-center text-red-700 px-4 py-2 rounded mt-4">
                User not registered. Contact admin.
              </div>
            )}
          </div>
          <div>
          <img src="/tajmahal.png" alt="Logo" className="absolute bottom-13 right-150 h-[100px]" />
          <img src="/building.png" alt="Logo" className="absolute bottom-13 right-38 h-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
};

export default LoginPage;