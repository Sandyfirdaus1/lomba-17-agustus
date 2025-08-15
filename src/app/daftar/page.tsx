"use client";

import { useEffect, useState } from "react";
import { registerParticipant, NewParticipant } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DaftarPage() {
  const [nama, setNama] = useState("");
  const [usia, setUsia] = useState<number | "">("");
  const [jenisLomba, setJenisLomba] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const availableLomba = [
    {
      id: "makan-kerupuk",
      name: "Lomba Makan Kerupuk",
      minAge: 5,
      maxAge: 70,
      description: "Usia 5-70 tahun",
    },
    {
      id: "balap-karung",
      name: "Lomba Balap Karung",
      minAge: 7,
      maxAge: 60,
      description: "Usia 7-60 tahun",
    },
    {
      id: "tarik-tambang",
      name: "Lomba Tarik Tambang",
      minAge: 12,
      maxAge: 60,
      description: "Usia 12-60 tahun",
    },
    {
      id: "panjat-pinang",
      name: "Lomba Panjat Pinang",
      minAge: 17,
      maxAge: 50,
      description: "Usia 17-50 tahun",
    },
    {
      id: "bakiak",
      name: "Lomba Bakiak",
      minAge: 10,
      maxAge: 60,
      description: "Usia 10-60 tahun",
    },
  ];

  // Get selected lomba info
  const selectedLomba = availableLomba.find((l) => l.id === jenisLomba);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset usia when lomba changes
  useEffect(() => {
    if (jenisLomba && usia !== "") {
      if (
        selectedLomba &&
        (usia < selectedLomba.minAge || usia > selectedLomba.maxAge)
      ) {
        setUsia("");
        setError(
          `Usia harus ${selectedLomba.minAge}-${selectedLomba.maxAge} tahun untuk ${selectedLomba.name}`
        );
      } else {
        setError("");
      }
    }
  }, [jenisLomba, usia, selectedLomba]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama || typeof usia !== "number" || !jenisLomba) {
      setError("Nama, usia, dan jenis lomba wajib diisi");
      return;
    }

    // Validate usia range
    if (
      selectedLomba &&
      (usia < selectedLomba.minAge || usia > selectedLomba.maxAge)
    ) {
      setError(
        `Usia harus ${selectedLomba.minAge}-${selectedLomba.maxAge} tahun untuk ${selectedLomba.name}`
      );
      return;
    }

    setSaving(true);
    setError("");

    const participant: NewParticipant = {
      nama,
      email: `${nama.toLowerCase().replace(/\s+/g, "")}@peserta.com`, // Generate email otomatis
      noTelepon: noTelepon || "Tidak ada",
      alamat: "Tidak diisi", // Default value
      jenisLomba: selectedLomba?.name || jenisLomba,
      catatan: `Usia: ${usia} tahun`,
    };

    try {
      const result = await registerParticipant(participant);

      if (result) {
        setDone(true);
        setNama("");
        setUsia("");
        setJenisLomba("");
        setNoTelepon("");

        // Trigger event untuk update halaman peserta
        window.dispatchEvent(new CustomEvent("participantAdded"));
      } else {
        setError("Gagal mendaftarkan peserta. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Pendaftaran Peserta
        </h1>
        <p className="mt-2 text-foreground/70">Memuat form pendaftaran...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-semibold tracking-tight"
      >
        Pendaftaran Peserta
      </motion.h1>
      <p className="mt-2 text-foreground/70">
        Isi data diri untuk mendaftar lomba 17 Agustus.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Nama Lengkap *</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Jenis Lomba *</label>
            <select
              value={jenisLomba}
              onChange={(e) => setJenisLomba(e.target.value)}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Pilih Jenis Lomba</option>
              {availableLomba.map((lomba) => (
                <option key={lomba.id} value={lomba.id}>
                  {lomba.name} ({lomba.description})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              Usia *
              {selectedLomba && (
                <span className="text-xs text-gray-500 ml-2">
                  ({selectedLomba.minAge}-{selectedLomba.maxAge} tahun)
                </span>
              )}
            </label>
            <input
              value={usia}
              onChange={(e) =>
                setUsia(e.target.value ? Number(e.target.value) : "")
              }
              type="number"
              min={selectedLomba?.minAge || 5}
              max={selectedLomba?.maxAge || 100}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder={
                selectedLomba
                  ? `Min: ${selectedLomba.minAge}, Max: ${selectedLomba.maxAge}`
                  : "Pilih lomba dulu"
              }
              required
              disabled={!jenisLomba}
            />
            {selectedLomba && (
              <p className="mt-1 text-xs text-gray-500">
                Usia yang diizinkan: {selectedLomba.minAge}-
                {selectedLomba.maxAge} tahun
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">
              Nomor Telepon (Opsional)
            </label>
            <input
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={
              saving || !nama || typeof usia !== "number" || !jenisLomba
            }
            className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Simpan Pendaftaran"
            )}
          </button>
          {done && (
            <span className="text-green-600 text-sm">
              ✅ Pendaftaran berhasil tersimpan!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
