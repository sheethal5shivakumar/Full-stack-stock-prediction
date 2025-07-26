"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserFromDb = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/debug?email=${encodeURIComponent(session.user.email)}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setDbUser(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Session Debug</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Session Status</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p>Status: <span className="font-mono">{status}</span></p>
        </div>
      </div>
      
      {session && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Database User</h2>
        <button 
          onClick={fetchUserFromDb}
          disabled={loading || !session}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Fetch User from Database"}
        </button>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {dbUser && (
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(dbUser, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Help</h2>
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="mb-2">&quot;Debug&quot; information</p>
          <ol className="list-decimal list-inside">
            <li>Check that the role in the database is lowercase &quot;admin&quot;</li>
            <li>Try logging out and logging back in</li>
            <li>Clear your browser cookies and try again</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 