"use client";

import { useEffect, useMemo, useState } from "react";
import { competitions } from "@/lib/competitions";
import { registerParticipant, NewParticipant } from "@/lib/api";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DaftarPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jenisLomba, setJenisLomba] = useState("");
  const [catatan, setCatatan] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const availableLomba = [
    "Lomba Makan Kerupuk",
    "Lomba Balap Karung",
    "Lomba Tarik Tambang",
    "Lomba Panjat Pinang",
    "Lomba Bakiak",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama || !email || !noTelepon || !alamat || !jenisLomba) {
      setError("Semua field wajib diisi kecuali catatan");
      return;
    }

    setSaving(true);
    setError("");

    const participant: NewParticipant = {
      nama,
      email,
      noTelepon,
      alamat,
      jenisLomba,
      catatan: catatan || undefined,
    };

    try {
      const result = await registerParticipant(participant);

      if (result) {
        setDone(true);
        setNama("");
        setEmail("");
        setNoTelepon("");
        setAlamat("");
        setJenisLomba("");
        setCatatan("");

        // Trigger event untuk update halaman peserta
        window.dispatchEvent(new CustomEvent("participantAdded"));
      } else {
        setError("Gagal mendaftarkan peserta. Silakan coba lagi.");
      }
    } catch (err) {
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
        Isi data diri lengkap untuk mendaftar lomba 17 Agustus.
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
            <label className="text-sm font-medium">Email *</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="budi@email.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Nomor Telepon *</label>
            <input
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="08xxxxxxxxxx"
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
                <option key={lomba} value={lomba}>
                  {lomba}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Alamat Lengkap *</label>
          <textarea
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Jl. Contoh No. 123, Kota, Provinsi"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Catatan (Opsional)</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Tambahan informasi atau catatan khusus"
          />
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
              saving || !nama || !email || !noTelepon || !alamat || !jenisLomba
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
