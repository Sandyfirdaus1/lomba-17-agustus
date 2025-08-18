export type Competition = {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  description?: string;
  icon?: string;
  team?: boolean;
};

export const competitions: Competition[] = [
  {
    id: "balap-karung",
    name: "Balap Karung",
    minAge: 7,
    maxAge: 60,
    description: "Lomba lari menggunakan karung.",
  },
  {
    id: "makan-kerupuk",
    name: "Makan Kerupuk",
    minAge: 5,
    maxAge: 70,
    description: "Siapa paling cepat habiskan kerupuk tanpa tangan!",
  },
  {
    id: "balap-kelereng",
    name: "Balap Kelereng",
    minAge: 5,
    maxAge: 15,
    description: "Bawa kelereng di sendok sambil berlari.",
  },
  {
    id: "paku-ke-botol",
    name: "Memasukkan Paku ke Botol",
    minAge: 10,
    maxAge: 60,
  },
  {
    id: "tarik-tambang",
    name: "Tarik Tambang (Tim)",
    minAge: 12,
    maxAge: 60,
    team: true,
  },
  {
    id: "bakiak",
    name: "Bakiak (Tim)",
    minAge: 10,
    maxAge: 60,
    team: true,
  },
  {
    id: "panjat-pinang",
    name: "Panjat Pinang",
    minAge: 17,
    maxAge: 50,
    description: "Khusus dewasa, wajib safety.",
  },
  {
    id: "melempar-cincin",
    name: "Lempar Cincin",
    minAge: 5,
    maxAge: 70,
  },
  {
    id: "fashion-merah-putih",
    name: "Fashion Show Merah Putih",
    minAge: 5,
    maxAge: 15,
  },
];

export type AgeGroupKey = "anak" | "remaja" | "dewasa" | "lansia";

export const ageGroups: Record<
  AgeGroupKey,
  { label: string; min: number; max: number }
> = {
  anak: { label: "Anak-anak (5–12)", min: 5, max: 12 },
  remaja: { label: "Remaja (13–17)", min: 13, max: 17 },
  dewasa: { label: "Dewasa (18–59)", min: 18, max: 59 },
  lansia: { label: "Lansia (60+)", min: 60, max: 120 },
};

export function getCompetitions(): Competition[] {
  if (typeof window === "undefined") return competitions;
  try {
    const stored = localStorage.getItem("lomba17_competitions");
    if (stored) {
      const data = JSON.parse(stored) as Competition[];
      return Array.isArray(data) ? data : competitions;
    }
  } catch {
    // Fallback to default
  }
  return competitions;
}

export function getAgeGroups(): Record<
  AgeGroupKey,
  { label: string; min: number; max: number }
> {
  if (typeof window === "undefined") return ageGroups;
  try {
    const stored = localStorage.getItem("lomba17_ageGroups");
    if (stored) {
      const data = JSON.parse(stored) as Record<
        AgeGroupKey,
        { label: string; min: number; max: number }
      >;
      return data;
    }
  } catch {
    // Fallback to default
  }
  return ageGroups;
}

export function competitionsForAge(age: number): Competition[] {
  const comps = getCompetitions();
  return comps.filter((c) => age >= c.minAge && age <= c.maxAge);
}

export function competitionsForGroup(group: AgeGroupKey): Competition[] {
  const comps = getCompetitions();
  const groups = getAgeGroups();
  const g = groups[group];
  return comps.filter((c) => c.minAge <= g.max && c.maxAge >= g.min);
}

export type Participant = {
  id: string;
  name: string;
  age: number;
  phone?: string;
  competitions: string[]; // ids
  createdAt: number;
};

export const STORAGE_KEY = "lomba17_peserta";

export function saveParticipant(p: Participant) {
  if (typeof window === "undefined") return;
  const existing = loadParticipants();
  const next = [p, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function loadParticipants(): Participant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Participant[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function deleteParticipant(id: string) {
  if (typeof window === "undefined") return;
  const existing = loadParticipants();
  const filtered = existing.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("lomba17_admin") === "true";
}

export function setAdminStatus(status: boolean) {
  if (typeof window === "undefined") return;
  if (status) {
    localStorage.setItem("lomba17_admin", "true");
    // Simpan timestamp terakhir aktivitas admin
    localStorage.setItem("lomba17_admin_lastActive", String(Date.now()));
  } else {
    localStorage.removeItem("lomba17_admin");
    localStorage.removeItem("lomba17_admin_lastActive");
  }

  // Dispatch custom event untuk update komponen lain secara real-time
  window.dispatchEvent(
    new CustomEvent("adminStatusChanged", { detail: status })
  );
}

export function toggleAdminStatus() {
  if (typeof window === "undefined") return false;
  const currentStatus = isAdmin();
  const newStatus = !currentStatus;
  setAdminStatus(newStatus);
  return newStatus;
}

export function exportToCSV(participants: Participant[]) {
  const headers = ["No", "Nama", "Usia", "HP", "Lomba", "Waktu Daftar"];
  const csvContent = [
    headers.join(","),
    ...participants.map((p, index) => {
      const lombaNames = p.competitions
        .map((id) => competitions.find((c) => c.id === id)?.name || id)
        .join("; ");
      return [
        index + 1,
        `"${p.name}"`,
        p.age,
        p.phone || "-",
        `"${lombaNames}"`,
        new Date(p.createdAt).toLocaleString(),
      ].join(",");
    }),
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
}
