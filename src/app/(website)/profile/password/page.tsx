"use client";
import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // States to toggle visibility for each field
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await api.put("/users/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#d1daeb] rounded-2xl shadow-sm border border-gray-100 p-8 min-h-screen">
    <div className="max-w-md mx-auto ">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Security Settings
        </h2>
        <p className="text-gray-500 text-sm">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              required
              className="w-full text-gray-500 mt-1 p-4 bg-[#e6e8f0] border border-gray-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-blue-600"
            >
              {showOld ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <hr className="border-gray-50 my-2" />

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              className="w-full text-gray-500 mt-1 p-4 bg-[#e6e8f0] border border-gray-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-blue-600"
            >
              {showNew ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Confirm New Password
            </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              className="w-full text-gray-500 mt-1 p-4 bg-[#e6e8f0] border border-gray-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-blue-600"
            >
              {showConfirm ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#1b42e0] text-white font-bold p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
        >
          {loading ? "Updating...": (
            <>
              <ShieldCheckIcon className="h-5 w-5" /> Update Password
            </>
          )}
        </button>
      </form>
    </div>
    </div>
  );
}
