// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/app/components/ui/RadialSpinner";
import Image from "next/image";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Registration successful - redirect to login
      router.push('/login?message=Registration successful. Please login.');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen fixed inset-0 bg-white z-50">
      {/* Main container with margins */}
      <div className="flex flex-1 bg-white mx-8 my-8 shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 overflow-hidden">
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

        {/* Right Side - Register Form */}
        <div className="flex-1 p-8 justify-center items-center flex flex-col">
          <img src="/plane.png" alt="Logo" className="absolute top-8 right-8 h-12" />
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold mb-6 text-blue-400 text-center">
              Create Account
            </h2>
            
            {error && (
              <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Create Account
                </button>
              )}
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <img src="/tajmahal.png" alt="Taj Mahal" className="absolute bottom-8 right-158 h-20" />
            <img src="/building.png" alt="Building" className="absolute bottom-8 right-8 h-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;