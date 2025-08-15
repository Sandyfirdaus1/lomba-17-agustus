"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadParticipants,
  competitions,
  deleteParticipant,
  isAdmin,
  exportToCSV,
} from "@/lib/competitions";
import { Trash2, AlertTriangle, Download } from "lucide-react";

export default function PesertaPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(loadParticipants());
  const [adminMode, setAdminMode] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onStorage = () => setData(loadParticipants());
    const onParticipantAdded = () => setData(loadParticipants());
    const onDataUpdated = () => setData(loadParticipants());

    window.addEventListener("storage", onStorage);
    window.addEventListener("participantAdded", onParticipantAdded);
    window.addEventListener("dataUpdated", onDataUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("participantAdded", onParticipantAdded);
      window.removeEventListener("dataUpdated", onDataUpdated);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    setAdminMode(isAdmin());

    const checkAdmin = () => setAdminMode(isAdmin());
    const handleAdminStatusChange = (event: CustomEvent) => {
      setAdminMode(event.detail);
    };

    // Listen untuk storage changes (cross-tab)
    window.addEventListener("storage", checkAdmin);
    // Listen untuk custom event (same tab)
    window.addEventListener(
      "adminStatusChanged",
      handleAdminStatusChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener(
        "adminStatusChanged",
        handleAdminStatusChange as EventListener
      );
    };
  }, [mounted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, query]);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus peserta ini?")) return;
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 300));
    deleteParticipant(id);
    setData(loadParticipants());
    setDeletingId(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Daftar Peserta
      </h1>
      <p className="mt-2 text-foreground/70">
        Berikut adalah daftar peserta yang telah mendaftar untuk lomba 17
        Agustus.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama peserta..."
            className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
          />
          {mounted && adminMode && data.length > 0 && (
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
        {mounted && adminMode && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Mode Admin Aktif</span>
          </div>
        )}
      </div>

      {/* Statistik Peserta */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {data.length}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">
            Total Peserta
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.filter((p) => p.age >= 5 && p.age <= 12).length}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Anak-anak
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.filter((p) => p.age >= 13 && p.age <= 17).length}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            Remaja
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.filter((p) => p.age >= 18).length}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">
            Dewasa
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-foreground/70">
              <th className="py-2 pr-3">No</th>
              <th className="py-2 pr-3">Nama</th>
              <th className="py-2 pr-3">Usia</th>
              <th className="py-2 pr-3">HP</th>
              <th className="py-2 pr-3">Lomba</th>
              <th className="py-2 pr-3">Waktu Daftar</th>
              {mounted && adminMode && <th className="py-2 pr-3">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, index) => (
              <tr
                key={p.id}
                className="border-t border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <td className="py-2 pr-3 text-center font-medium">
                  {index + 1}
                </td>
                <td className="py-2 pr-3 font-medium">{p.name}</td>
                <td className="py-2 pr-3">{p.age}</td>
                <td className="py-2 pr-3">{p.phone || "-"}</td>
                <td className="py-2 pr-3">
                  <div className="flex flex-wrap gap-1">
                    {p.competitions.map((id) => {
                      const c = competitions.find((x) => x.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-block rounded bg-black/5 dark:bg-white/10 px-2 py-0.5"
                        >
                          {c?.name || id}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="py-2 pr-3">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                {mounted && adminMode && (
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                      title="Hapus peserta"
                    >
                      {deletingId === p.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={mounted && adminMode ? 7 : 6}
                  className="py-6 text-center text-foreground/60"
                >
                  Belum ada data peserta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
