"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";
import Image from "next/image";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  image?: string;
}

function RoleControl({ user, currentUserId }: { user: User; currentUserId: string }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [currentRole, setCurrentRole] = useState(user.role || "user");
  const [showModal, setShowModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  
  // Check if this is the current user (self)
  const isSelf = user._id === currentUserId;
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    // If changing from admin to another role, or changing to admin, show confirmation
    if ((currentRole === "admin" && newRole !== "admin") || 
        (currentRole !== "admin" && newRole === "admin")) {
      setPendingRole(newRole);
      setShowModal(true);
    } else {
      // For less critical changes, proceed without confirmation
      updateRole(newRole);
    }
  };
  
  const updateRole = async (newRole: string) => {
    setError("");
    setUpdating(true);
    
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }
      
      setCurrentRole(newRole);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setUpdating(false);
      setPendingRole(null);
    }
  };
  
  const handleConfirm = () => {
    if (pendingRole) {
      updateRole(pendingRole);
    }
    setShowModal(false);
  };
  
  const handleCancel = () => {
    setPendingRole(null);
    setShowModal(false);
  };
  
  const getConfirmationMessage = () => {
    if (pendingRole === "admin") {
      return `Are you sure you want to promote ${user.name || user.email} to admin? This gives them full access to all admin features.`;
    } else if (currentRole === "admin" && pendingRole !== "admin") {
      return `Are you sure you want to demote ${user.name || user.email} from admin to ${pendingRole}? This will revoke their admin access.`;
    }
    return `Change role from ${currentRole} to ${pendingRole}?`;
  };
  
  return (
    <div>
      <div className="flex items-center space-x-2">
        <select
          value={currentRole}
          onChange={handleRoleChange}
          disabled={updating || (isSelf && currentRole === "admin")}
          className={`block w-full rounded-lg bg-[#252525] border-[#333] text-gray-300 py-1.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${
            isSelf && currentRole === "admin" ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
        {updating && !showModal && (
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        )}
      </div>
      
      {isSelf && currentRole === "admin" && (
        <div className="text-xs text-gray-400 mt-1">You cannot demote yourself</div>
      )}
      
      {error && (
        <div className="text-xs text-red-500 mt-1 bg-[rgba(244,67,54,0.1)] px-2 py-1 rounded">{error}</div>
      )}
      
      {showModal && (
        <ConfirmModal
          title={pendingRole === "admin" ? "Confirm Promotion" : "Confirm Role Change"}
          message={getConfirmationMessage()}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={updating}
        />
      )}
    </div>
  );
}

export default function AdminUserPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async (): Promise<User[]> => {
      try {
        const res = await fetch("/api/admin/users");
        
        if (!res.ok) {
          throw new Error(res.status === 403 ? "Unauthorized" : "Failed to load users");
        }
        
        const data = await res.json();
        return data.users;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load users");
        }
        return [];
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUsers().then(setUsers);
    }
  }, [status]);
  
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete._id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      
      // Remove the user from the list
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || (session && session.user.role !== "admin")) {
    return (
      <div className="bg-[#1e1e1e] border border-[#333] rounded-md p-6 max-w-3xl mx-auto mt-10">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-white">Access denied</h3>
            <div className="mt-2 text-gray-400">
              <p>You must be an admin to view this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">User Management</h1>
        <p className="mt-2 text-sm text-gray-300 sm:mt-0 bg-[#252525] py-1 px-3 rounded-full">
          Total users: <span className="font-medium text-white">{users.length}</span>
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-[rgba(244,67,54,0.1)] border border-[rgba(244,67,54,0.3)] text-red-500 px-4 py-3 rounded-lg" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-[#333]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#333]">
            <thead className="bg-[#252525]">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-300 sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-300">
                  Email
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-300">
                  Role
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-300">
                  Created At
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333] bg-[#1e1e1e]">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-[#252525]">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                    <div className="flex items-center">
                      {user.image ? (
                        <Image 
                          src={user.image} 
                          alt={`${user.name}'s avatar`} 
                          className="h-9 w-9 rounded-full mr-3 border border-[#333]"
                          width={36}
                          height={36}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{user.name || "N/A"}</div>
                        {user._id === session?.user.id && (
                          <div className="text-xs text-gray-400 mt-0.5">You</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                    <span className={`capitalize px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                      user.role === "admin" 
                        ? "bg-purple-900 text-purple-200" 
                        : user.role === "moderator"
                          ? "bg-blue-900 text-blue-200"
                          : "bg-green-900 text-green-200"
                    }`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                    <div className="flex items-center space-x-3">
                      <RoleControl user={user} currentUserId={session?.user.id || ""} />
                      {user._id !== session?.user.id && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-[#333]"
                          title="Delete user"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showDeleteModal && userToDelete && (
        <ConfirmModal
          title="Confirm User Deletion"
          message={`Are you sure you want to delete ${userToDelete.name || userToDelete.email}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          isLoading={deleting}
        />
      )}
    </div>
  );
} 