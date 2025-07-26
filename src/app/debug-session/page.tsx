"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const [apiResponse, setApiResponse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSessionFromApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/debug-session");
      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionFromApi();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Session Debug</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Client-side Session Status</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>Status: <span className="font-mono">{status}</span></p>
        </div>
      </div>
      
      {session && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Client-side Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Server-side Session Data</h2>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : apiResponse ? (
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        ) : (
          <p>No data available</p>
        )}
        <button
          onClick={fetchSessionFromApi}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Refresh Server Data
        </button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
          <a
            href="/login"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 inline-flex items-center"
          >
            Sign In
          </a>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <div className="bg-yellow-50 p-4 rounded-md">
          <h3 className="font-bold mb-2">Common Issues:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Role not showing up:</strong> Make sure your user has the &quot;admin&quot; role in the database (lowercase).
            </li>
            <li>
              <strong>Session not updating:</strong> Try signing out and signing back in.
            </li>
            <li>
              <strong>403 errors:</strong> Check if your role is correctly set in both the session and the database.
            </li>
          </ul>
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="font-mono text-sm">
              Use the script to update your role:<br />
              <span className="text-green-600">node scripts/update-role.js your-email@example.com admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 