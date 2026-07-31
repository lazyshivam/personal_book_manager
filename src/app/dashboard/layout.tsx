
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api"; // Or userService if you have one

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
    console.log("DashboardLayout rendered. Current userName:", "outside"); // Debugging line

  useEffect(() => {
    console.log("DashboardLayout rendered. Current userName:", "inside"); // Debugging line
    // Fetch the current user profile from the backend on load/reload
    const fetchProfile = async () => {
      try {
        // Assuming you have a method like authService.getMe() or userService.getProfile()
        const response = await authService.getUserProfile(); 
         console.log("User profile response:", response); // Debugging line
        if (response.code === 200) {
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <Link href="/dashboard" className="flex items-center gap-2 hover:cursor-pointer">
              <span className="text-2xl">📖</span>
              <span className="text-xl font-serif text-gray-900 font-medium tracking-tight">
                Library
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {userName && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userName}
                  </span>
                </div>
              )}

              <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors hover:cursor-pointer"
              >
                Sign out
              </button>
            </div>

          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}