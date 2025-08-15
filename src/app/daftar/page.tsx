"use client";

import { useEffect, useMemo, useState } from "react";
import {
  competitionsForAge,
  competitions,
  saveParticipant,
  type Participant,
} from "@/lib/competitions";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DaftarPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  const available = useMemo(
    () => (typeof age === "number" ? competitionsForAge(age) : competitions),
    [age]
  );

  useEffect(() => {
    setMounted(true);
    // Reset choices when age changes to keep valid
    setSelected((prev) =>
      prev.filter((id) => available.some((c) => c.id === id))
    );
  }, [age, available]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || typeof age !== "number" || selected.length === 0) return;
    setSaving(true);
    const participant: Participant = {
      id: crypto.randomUUID(),
      name,
      age,
      phone,
      competitions: selected,
      createdAt: Date.now(),
    };
    await new Promise((r) => setTimeout(r, 400));
    saveParticipant(participant);
    setSaving(false);
    setDone(true);
    setName("");
    setAge("");
    setPhone("");
    setSelected([]);

    // Trigger event untuk update halaman peserta
    window.dispatchEvent(new CustomEvent("participantAdded"));
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
        Isi data diri dan pilih lomba yang sesuai dengan usia.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Usia</label>
            <input
              value={age}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : "")
              }
              type="number"
              min={5}
              max={100}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Contoh: 12"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Nomor HP (opsional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Pilih Lomba</label>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {available.map((c) => {
              const active = selected.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-left transition ${
                    active
                      ? "border-red-500 bg-red-50 text-red-700 dark:bg-white/10 dark:text-red-300"
                      : "border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm font-medium">{c.name}</span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            Tersedia {available.length} lomba untuk usia ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={
              saving ||
              !name ||
              typeof age !== "number" ||
              selected.length === 0
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
              Pendaftaran berhasil tersimpan!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
