"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllParticipants,
  deleteParticipant,
  getStats,
  BackendParticipant,
  StatsResponse,
} from "@/lib/api";
import { Trash2, AlertTriangle, Download, RefreshCw } from "lucide-react";

export default function PesertaPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<BackendParticipant[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [participants, statsData] = await Promise.all([
        getAllParticipants(),
        getStats(),
      ]);
      setData(participants);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onParticipantAdded = () => loadData();
    const onDataUpdated = () => loadData();

    window.addEventListener("participantAdded", onParticipantAdded);
    window.addEventListener("dataUpdated", onDataUpdated);

    return () => {
      window.removeEventListener("participantAdded", onParticipantAdded);
      window.removeEventListener("dataUpdated", onDataUpdated);
    };
  }, [mounted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.jenisLomba.toLowerCase().includes(q)
    );
  }, [data, query]);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus peserta ini?")) return;
    setDeletingId(id);

    try {
      const success = await deleteParticipant(id);
      if (success) {
        await loadData(); // Reload data
      }
    } catch (error) {
      console.error("Error deleting participant:", error);
    } finally {
      setDeletingId(null);
    }
  }

  const exportToCSV = (participants: BackendParticipant[]) => {
    const headers = [
      "No",
      "Nama",
      "Email",
      "No Telepon",
      "Alamat",
      "Jenis Lomba",
      "Status",
      "Tanggal Daftar",
    ];
    const csvContent = [
      headers.join(","),
      ...participants.map((p, index) =>
        [
          index + 1,
          `"${p.nama}"`,
          `"${p.email}"`,
          `"${p.noTelepon}"`,
          `"${p.alamat}"`,
          `"${p.jenisLomba}"`,
          `"${p.status}"`,
          new Date(p.tanggalDaftar).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `peserta-lomba-17-agustus-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Daftar Peserta
        </h1>
        <p className="mt-2 text-foreground/70">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Daftar Peserta
          </h1>
          <p className="mt-2 text-foreground/70">
            Berikut adalah daftar peserta yang telah mendaftar untuk lomba 17
            Agustus.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, email, atau jenis lomba..."
            className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
          />
          {data.length > 0 && (
            <button
              onClick={() => exportToCSV(data)}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
              title="Export ke CSV"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Statistik Peserta */}
      {stats && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.totalPeserta}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Total Peserta
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.statusCounts.find((s) => s._id === "Terdaftar")?.count ||
                0}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Terdaftar
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.statusCounts.find((s) => s._id === "Diterima")?.count || 0}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Diterima
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.pesertaPerLomba.length}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Jenis Lomba
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-center py-12">
          <div className="inline-flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Memuat data peserta...</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-foreground/70">
                <th className="py-2 pr-3">No</th>
                <th className="py-2 pr-3">Nama</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">No Telepon</th>
                <th className="py-2 pr-3">Jenis Lomba</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Waktu Daftar</th>
                <th className="py-2 pr-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, index) => (
                <tr
                  key={p._id}
                  className="border-t border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <td className="py-2 pr-3 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="py-2 pr-3 font-medium">{p.nama}</td>
                  <td className="py-2 pr-3">{p.email}</td>
                  <td className="py-2 pr-3">{p.noTelepon}</td>
                  <td className="py-2 pr-3">
                    <span className="inline-block rounded bg-black/5 dark:bg-white/10 px-2 py-0.5">
                      {p.jenisLomba}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        p.status === "Terdaftar"
                          ? "bg-yellow-100 text-yellow-800"
                          : p.status === "Diterima"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    {new Date(p.tanggalDaftar).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                      title="Hapus peserta"
                    >
                      {deletingId === p._id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-foreground/60"
                  >
                    {query
                      ? "Tidak ada peserta yang ditemukan."
                      : "Belum ada data peserta."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
