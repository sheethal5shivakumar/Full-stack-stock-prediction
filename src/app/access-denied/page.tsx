"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function AccessDeniedPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse-slow">
            <svg
              className="h-10 w-10 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this page. This area requires admin privileges.
        </p>
        {session ? (
          <div className="text-sm bg-gray-50 p-3 rounded-lg mb-6">
            <p>You are signed in as:</p>
            <div className="flex items-center justify-center mt-2 space-x-2">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full border border-gray-200"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-medium text-sm">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="font-medium">{session.user?.email}</span>
            </div>
            <div className="mt-2">
              Role: <span className="font-medium capitalize inline-flex items-center">
                <span className={`mr-1 h-2 w-2 rounded-full ${
                  session.user?.role === "admin" ? "bg-purple-500" : "bg-green-500"
                }`}></span>
                {session.user?.role || "user"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm bg-yellow-50 p-3 rounded-lg mb-6">
            You are not currently signed in. Please log in to access your dashboard.
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all font-medium text-sm shadow-sm"
          >
            Go to Home
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm shadow-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 