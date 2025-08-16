"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

export default function BackendStatus() {
  const [status, setStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }
    } catch (error) {
      setStatus("disconnected");
    }

    setLastCheck(new Date());
  };

  useEffect(() => {
    checkBackendStatus();

    // Check setiap 30 detik
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "disconnected":
        return "text-red-600";
      case "checking":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4" />;
      case "checking":
        return <AlertCircle className="h-4 w-4 animate-pulse" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Backend Terhubung";
      case "disconnected":
        return "Backend Tidak Terhubung";
      case "checking":
        return "Memeriksa Koneksi...";
      default:
        return "Status Tidak Diketahui";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={checkBackendStatus}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 transition-all hover:shadow-xl ${
          status === "connected"
            ? "bg-green-100 border-green-500 text-green-600"
            : status === "disconnected"
            ? "bg-red-100 border-red-500 text-red-600"
            : "bg-yellow-100 border-yellow-500 text-yellow-600"
        }`}
        title={`Status: ${getStatusText()}\nKlik untuk memeriksa ulang\nTerakhir diperiksa: ${
          lastCheck?.toLocaleTimeString() || "Belum diperiksa"
        }`}
      >
        {getStatusIcon()}
      </button>
    </div>
  );
}
