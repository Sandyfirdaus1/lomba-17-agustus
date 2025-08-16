"use client";

import { useState, useEffect } from "react";
import { Medal, Users, Sparkles, Crown } from "lucide-react";
import {
  getAgeGroups,
  getCompetitions,
  competitionsForGroup,
  type AgeGroupKey,
} from "@/lib/competitions";

const iconByGroup: Record<
  AgeGroupKey,
  React.ComponentType<{ className?: string }>
> = {
  anak: Sparkles,
  remaja: Medal,
  dewasa: Crown,
  lansia: Users,
};

export default function CategoryGrid() {
  const [mounted, setMounted] = useState(false);
  const [competitions, setCompetitions] = useState(getCompetitions());
  const [ageGroups, setAgeGroups] = useState(getAgeGroups());

  useEffect(() => {
    setMounted(true);

    const handleDataUpdate = () => {
      setCompetitions(getCompetitions());
      setAgeGroups(getAgeGroups());
    };

    window.addEventListener("dataUpdated", handleDataUpdate);

    return () => {
      window.removeEventListener("dataUpdated", handleDataUpdate);
    };
  }, []);

  if (!mounted) {
    return (
      <section id="kategori" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Kategori Usia & Lomba
        </h2>
        <p className="mt-2 text-foreground/70 max-w-2xl">Memuat data...</p>
      </section>
    );
  }

  const groups: AgeGroupKey[] = Object.keys(ageGroups) as AgeGroupKey[];

  return (
    <section id="kategori" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Kategori Usia & Lomba
      </h2>
      <p className="mt-2 text-foreground/70 max-w-2xl">
        Berikut daftar lomba yang tersedia untuk tiap kategori usia. Detail
        dapat berubah sesuai kebijakan panitia.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((g) => {
          const Icon = iconByGroup[g] || Users;
          const comps = competitionsForGroup(g);
          const info = ageGroups[g];
          return (
            <div
              key={g}
              className="rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur shadow-sm"
            >
              <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center gap-3">
                <Icon className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold">{info.label}</h3>
                  <p className="text-sm text-foreground/70">
                    {comps.length} lomba
                  </p>
                </div>
              </div>
              <ul className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {comps.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="inline-block rounded-md bg-red-50 text-red-700 dark:bg-white/10 dark:text-red-300 px-2 py-1">
                      {c.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
