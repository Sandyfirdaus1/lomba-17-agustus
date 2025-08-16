"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldOff, X, Lock } from "lucide-react";
import { isAdmin, setAdminStatus } from "@/lib/competitions";

const ADMIN_PASSWORD = "merdeka17";

export default function AdminToggle() {
  const [adminMode, setAdminMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAdminMode(isAdmin());
  }, []);

  if (!mounted) {
    return (
      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <ShieldOff className="h-4 w-4" />
        Admin
      </button>
    );
  }

  function handleToggleAdmin() {
    if (adminMode) {
      // Jika sudah admin, langsung nonaktifkan
      setAdminStatus(false);
      setAdminMode(false);
      // Trigger custom event untuk update komponen lain
      window.dispatchEvent(
        new CustomEvent("adminStatusChanged", { detail: false })
      );
    } else {
      // Jika belum admin, tampilkan dialog password
      setShowPasswordDialog(true);
      setPassword("");
      setError("");
    }
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminStatus(true);
      setAdminMode(true);
      setShowPasswordDialog(false);
      setPassword("");
      setError("");
      // Trigger custom event untuk update komponen lain
      window.dispatchEvent(
        new CustomEvent("adminStatusChanged", { detail: true })
      );
    } else {
      setError("Password salah!");
    }
  }

  function closeDialog() {
    setShowPasswordDialog(false);
    setPassword("");
    setError("");
  }

  return (
    <>
      <button
        onClick={handleToggleAdmin}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          adminMode
            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}
        title={
          adminMode
            ? "Mode Admin Aktif - Klik untuk Nonaktifkan"
            : "Klik untuk Aktifkan Admin"
        }
      >
        {adminMode ? (
          <Shield className="h-4 w-4" />
        ) : (
          <ShieldOff className="h-4 w-4" />
        )}
        {adminMode ? "Admin" : "Admin"}
      </button>

      {/* Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Masuk sebagai Admin
              </h3>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password Admin
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Masukkan password..."
                  autoFocus
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
