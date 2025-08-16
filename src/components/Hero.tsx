"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_-10%,rgba(255,0,0,0.15),transparent)]"
      />
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold tracking-tight"
        >
          Semarak Lomba 17 Agustus
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 text-base md:text-lg text-foreground/80 max-w-2xl"
        >
          Dari anak-anak hingga dewasa, semua bisa ikut! Daftar sekarang dan
          pilih lomba sesuai usia kamu.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex items-center gap-3"
        >
          <Link
            href="/daftar"
            className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-red-700"
          >
            Daftar Sekarang
          </Link>
          <a
            href="#kategori"
            className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
          >
            Lihat Kategori
          </a>
        </motion.div>
      </div>
    </section>
  );
}
