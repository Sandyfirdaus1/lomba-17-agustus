"use client";

import { useEffect, useMemo, useState } from "react";
import { competitionsForAge, competitions } from "@/lib/competitions";
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    // Clear errors when age changes
    setErrors({});
  }, [age, available]);

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Nama harus diisi";
    } else if (name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }

    if (typeof age !== "number") {
      newErrors.age = "Usia harus diisi";
    } else if (age < 5 || age > 100) {
      newErrors.age = "Usia harus antara 5-100 tahun";
    }

    if (selected.length === 0) {
      newErrors.competitions = "Pilih minimal 1 lomba";
    }

    if (phone && !/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(phone)) {
      newErrors.phone = "Format nomor HP tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    // Clear competition error when user selects something
    if (errors.competitions) {
      setErrors((prev) => ({ ...prev, competitions: "" }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Gunakan environment variable atau fallback ke localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Test koneksi ke backend terlebih dahulu
      try {
        const testResponse = await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!testResponse.ok) {
          throw new Error(
            `Backend tidak dapat diakses (Status: ${testResponse.status})`
          );
        }
      } catch (testError) {
        console.error("Backend connection test failed:", testError);
        throw new Error(
          `Tidak dapat terhubung ke backend. Pastikan backend berjalan di ${apiUrl}`
        );
      }

      // Kirim data ke backend untuk setiap lomba yang dipilih
      const successCount = [];
      const errorCount = [];

      for (const competitionId of selected) {
        const competition = competitions.find((c) => c.id === competitionId);
        if (!competition) continue;

        const pesertaData = {
          nama: name.trim(),
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Generate email dummy
          noTelepon: phone.trim() || "Tidak ada",
          usia: age,
          alamat: "Alamat akan diisi nanti", // Default alamat
          jenisLomba: competition.name,
          catatan: `Mendaftar melalui form online - Lomba: ${competition.name}`,
        };

        try {
          const response = await fetch(`${apiUrl}/api/peserta`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pesertaData),
          });

          console.log(`Response for ${competition.name}:`, {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Backend error for ${competition.name}:`, errorData);

            let errorMessage =
              errorData.message ||
              `HTTP ${response.status}: ${response.statusText}`;

            // Show specific validation errors if available
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessage = `Validasi gagal: ${errorData.errors.join(", ")}`;
            } else if (errorData.missingFields) {
              const missingFields = Object.entries(errorData.missingFields)
                .filter(([_, value]) => value !== null)
                .map(([_, value]) => value)
                .join(", ");
              errorMessage = `Field yang kurang: ${missingFields}`;
            }

            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log(`Success for ${competition.name}:`, result);
          successCount.push(competition.name);
        } catch (competitionError) {
          console.error(
            `Error mendaftar untuk ${competition.name}:`,
            competitionError
          );
          errorCount.push(competition.name);
        }
      }

      setSaving(false);

      // Tampilkan hasil pendaftaran
      if (successCount.length > 0 && errorCount.length === 0) {
        setDone(true);
        setName("");
        setAge("");
        setPhone("");
        setSelected([]);

        // Trigger event untuk update halaman peserta
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("participantAdded"));
        }

        alert(`Pendaftaran berhasil untuk lomba: ${successCount.join(", ")}`);
      } else if (successCount.length > 0 && errorCount.length > 0) {
        alert(
          `Pendaftaran sebagian berhasil.\nBerhasil: ${successCount.join(
            ", "
          )}\nGagal: ${errorCount.join(", ")}`
        );
      } else {
        alert(`Pendaftaran gagal untuk semua lomba: ${errorCount.join(", ")}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSaving(false);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak diketahui";

      // Show more specific error message
      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError")
      ) {
        alert(
          `Koneksi ke backend gagal. Pastikan:\n` +
            `1. Backend berjalan di ${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }\n` +
            `2. Tidak ada masalah jaringan\n` +
            `3. Backend dapat diakses dari browser`
        );
      } else {
        alert(
          `Terjadi kesalahan saat mendaftar:\n${errorMessage}\n\nPastikan backend berjalan di ${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          }`
        );
      }
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
        Isi data diri dan pilih lomba yang sesuai dengan usia.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Contoh: Budi Santoso"
              required
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Usia</label>
            <input
              value={age}
              onChange={(e) => {
                setAge(e.target.value ? Number(e.target.value) : "");
                if (errors.age) setErrors((prev) => ({ ...prev, age: "" }));
              }}
              type="number"
              min={5}
              max={100}
              className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Contoh: 12"
              required
            />
            {errors.age && (
              <p className="mt-1 text-xs text-red-500">{errors.age}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Nomor HP (opsional)</label>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            className="mt-2 w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
            placeholder="08xxxxxxxxxx"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
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
          {errors.competitions && (
            <p className="mt-2 text-xs text-red-500">{errors.competitions}</p>
          )}
          <p className="mt-2 text-xs text-foreground/60">
            Tersedia {available.length} lomba untuk usia ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
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
