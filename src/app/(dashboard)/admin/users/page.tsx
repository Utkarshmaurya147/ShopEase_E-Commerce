'use client'
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon 
} from "@heroicons/react/24/outline";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users/all"); // You'll need this endpoint
        if (data.success) setUsers(data.users);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 font-medium">Manage your community and access levels</p>
        </div>
        <div className="bg-blue-600 px-6 py-3 rounded-2xl text-white shadow-xl shadow-blue-900/20">
            <span className="text-[10px] bg-blue-600 text-white uppercase tracking-widest block">Total Users</span>
            <span className="bg-blue-600 text-white font-bold">{users.length}</span>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-900 transition-all shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. Users Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <EnvelopeIcon className="h-3 w-3" /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 font-bold text-gray-600 text-xs">
                    {user.address}
                </td>
                <td className="px-8 py-5 ">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    user.role === 'admin' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100' 
                    : 'bg-gray-50 text-gray-600 border-gray-100'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-300" />
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" disabled={user.role === "admin"}>
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button 
                      disabled={user.role === 'admin'}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">No customers found matching that search.</div>
        )}
      </div>
    </div>
  );
}