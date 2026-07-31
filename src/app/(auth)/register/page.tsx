"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const validateForm = (): string | null => {
    if (!name.trim()) {
      return "Name cannot be empty.";
    }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    return null; // No errors
  };


  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; 
    }

   
    setIsLoading(true);

    try {
      const response = await authService.register({ name, email, password });

      if (response.code === 200 || response.code === 201) {
       
        router.push("/login"); 
      } else {
        setError(response.message || "Failed to register");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        
       
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gray-900 tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Start building your personal library today.
          </p>
        </div>

       
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            
           
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 sm:text-sm"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

           
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 sm:text-sm"
                placeholder="reader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

         
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

         
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors hover:cursor-pointer"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

       
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gray-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}