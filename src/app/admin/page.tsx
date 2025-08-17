"use client";

import { useState, useEffect } from "react";
import {
  getCompetitions,
  getAgeGroups,
  setAdminStatus,
  type Competition,
  type AgeGroupKey,
} from "@/lib/competitions";
import { isAdmin } from "@/lib/competitions";
import {
  Edit,
  Save,
  X,
  Users,
  Medal,
  Sparkles,
  Crown,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  RefreshCw,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Peserta {
  _id?: string;
  nama: string;
  noTelepon: string;
  usia: number;
  jenisLomba: string;
  tanggalDaftar: string;
  status: string;
  email: string;
  alamat: string;
  babak?: string;
  skor?: number;
}

const iconByGroup: Record<
  AgeGroupKey,
  React.ComponentType<{ className?: string }>
> = {
  anak: Sparkles,
  remaja: Medal,
  dewasa: Crown,
  lansia: Users,
};

export default function AdminPage() {
  const [adminMode, setAdminMode] = useState(false);
  const [editingCompetition, setEditingCompetition] =
    useState<Competition | null>(null);
  const [editingAgeGroup, setEditingAgeGroup] = useState<AgeGroupKey | null>(
    null
  );
  const [competitionsData, setCompetitionsData] = useState<Competition[]>([]);
  const [ageGroupsData, setAgeGroupsData] = useState<
    Record<AgeGroupKey, { label: string; min: number; max: number }>
  >({} as Record<AgeGroupKey, { label: string; min: number; max: number }>);
  const [mounted, setMounted] = useState(false);
  const [showAddAgeGroup, setShowAddAgeGroup] = useState(false);
  const [showAddCompetition, setShowAddCompetition] = useState(false);
  const [showAddPeserta, setShowAddPeserta] = useState(false);

  // State untuk peserta
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loadingPeserta, setLoadingPeserta] = useState(false);
  const [editingPeserta, setEditingPeserta] = useState<Peserta | null>(null);
  const [deletingPesertaId, setDeletingPesertaId] = useState<string | null>(
    null
  );
  const [selectedTurnamenStatus, setSelectedTurnamenStatus] = useState("semua");

  const [newAgeGroup, setNewAgeGroup] = useState({
    key: "",
    label: "",
    min: 0,
    max: 0,
  });
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
    minAge: 0,
    maxAge: 0,
    team: false,
  });

  useEffect(() => {
    setMounted(true);
    setCompetitionsData(getCompetitions());
    setAgeGroupsData(getAgeGroups());

    // Fetch peserta data
    fetchPeserta();
  }, []);

  // Fetch peserta dari backend
  const fetchPeserta = async () => {
    try {
      setLoadingPeserta(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta`);
      const data = await response.json();

      if (data.success) {
        setPeserta(data.data);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
    } finally {
      setLoadingPeserta(false);
    }
  };

  // Handle delete peserta
  const handleDeletePeserta = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus peserta ini?")) return;

    setDeletingPesertaId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPeserta((prev) => prev.filter((p) => p._id !== id));
        alert("Peserta berhasil dihapus");
      } else {
        throw new Error("Gagal menghapus peserta");
      }
    } catch (error) {
      console.error("Error deleting peserta:", error);
      alert("Gagal menghapus peserta");
    } finally {
      setDeletingPesertaId(null);
    }
  };

  // Handle update status peserta
  const handleUpdatePesertaStatus = async (id: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setPeserta((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        alert("Status peserta berhasil diupdate");
      } else {
        throw new Error("Gagal update status peserta");
      }
    } catch (error) {
      console.error("Error updating peserta status:", error);
      alert("Gagal update status peserta");
    }
  };

  // Handle edit peserta
  const handleEditPeserta = (peserta: Peserta) => {
    setEditingPeserta({ ...peserta });
  };

  // Handle save peserta
  const handleSavePeserta = async () => {
    if (!editingPeserta || !editingPeserta._id) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${apiUrl}/api/peserta/${editingPeserta._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPeserta),
        }
      );

      if (response.ok) {
        setPeserta((prev) =>
          prev.map((p) =>
            p._id === editingPeserta._id ? (editingPeserta as Peserta) : p
          )
        );
        setEditingPeserta(null);
        alert("Data peserta berhasil diupdate");
      } else {
        throw new Error("Gagal update data peserta");
      }
    } catch (error) {
      console.error("Error updating peserta:", error);
      alert("Gagal update data peserta");
    }
  };

  // Handle quick action for turnamen
  const handleQuickAction = async (id: string, action: string) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin melakukan tindakan "${action}" pada peserta ini?`
      )
    )
      return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const requestUrl = `${apiUrl}/api/peserta/${id}/action`;

      console.log("=== Quick Action Debug Info ===");
      console.log(`API URL: ${apiUrl}`);
      console.log(`Request URL: ${requestUrl}`);
      console.log(`Action: ${action}`);
      console.log(`Peserta ID: ${id}`);
      console.log("==============================");

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        // Update local state dengan data yang baru
        setPeserta((prev) => prev.map((p) => (p._id === id ? data.data : p)));
        alert(`Status peserta berhasil diupdate ke "${action}"`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        console.error("Response status:", response.status);
        console.error("Response status text:", response.statusText);
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error performing quick action:", error);
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
        alert(`Gagal melakukan tindakan: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        alert(
          "Gagal melakukan tindakan: Terjadi kesalahan yang tidak diketahui"
        );
      }
    }
  };

  // Handle add peserta
  const handleAddPeserta = async () => {
    if (!editingPeserta) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingPeserta),
      });

      if (response.ok) {
        const data = await response.json();
        setPeserta((prev) => [...prev, data.data]);
        setEditingPeserta(null);
        setShowAddPeserta(false);
        alert("Peserta berhasil ditambahkan");
      } else {
        throw new Error("Gagal menambahkan peserta");
      }
    } catch (error) {
      console.error("Error adding peserta:", error);
      alert("Gagal menambahkan peserta");
    }
  };

  useEffect(() => {
    if (!mounted) return;

    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem("lomba17_admin") === "true";
      setAdminMode(adminStatus);
    };

    const handleAdminStatusChange = (event: CustomEvent) => {
      setAdminMode(event.detail);
    };

    // Check initial status
    checkAdminStatus();

    // Listen for storage changes (when admin status changes in another tab)
    window.addEventListener("storage", checkAdminStatus);

    // Listen for custom events (when admin status changes in same tab)
    window.addEventListener(
      "adminStatusChanged",
      handleAdminStatusChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", checkAdminStatus);
      window.removeEventListener(
        "adminStatusChanged",
        handleAdminStatusChange as EventListener
      );
    };
  }, [mounted]);

  if (!mounted || !adminMode) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
          {!mounted ? "Loading..." : "Akses Ditolak"}
        </h1>
        <p className="text-foreground/70">
          {!mounted
            ? "Memuat halaman..."
            : "Anda harus login sebagai admin untuk mengakses halaman ini."}
        </p>
      </div>
    );
  }

  function handleEditCompetition(comp: Competition) {
    setEditingCompetition({ ...comp });
  }

  function handleSaveCompetition() {
    if (!editingCompetition) return;

    const updated = competitionsData.map((c) =>
      c.id === editingCompetition.id ? editingCompetition : c
    );
    setCompetitionsData(updated);
    setEditingCompetition(null);

    // Simpan ke localStorage
    localStorage.setItem("lomba17_competitions", JSON.stringify(updated));

    // Trigger custom event untuk update komponen lain
    window.dispatchEvent(new CustomEvent("dataUpdated"));
  }

  function handleAddCompetition() {
    if (!newCompetition.name) return;

    const newComp: Competition = {
      id: `comp_${Date.now()}`,
      name: newCompetition.name,
      description: newCompetition.description,
      minAge: newCompetition.minAge,
      maxAge: newCompetition.maxAge,
      team: newCompetition.team,
    };

    const updated = [...competitionsData, newComp];
    setCompetitionsData(updated);
    setShowAddCompetition(false);
    setNewCompetition({
      name: "",
      description: "",
      minAge: 0,
      maxAge: 0,
      team: false,
    });

    // Simpan ke localStorage
    localStorage.setItem("lomba17_competitions", JSON.stringify(updated));

    // Trigger custom event untuk update komponen lain
    window.dispatchEvent(new CustomEvent("dataUpdated"));
  }

  function handleDeleteCompetition(id: string) {
    const comp = competitionsData.find((c) => c.id === id);
    if (!comp) return;

    if (!confirm(`Yakin ingin menghapus lomba "${comp.name}"?`)) return;

    const updated = competitionsData.filter((c) => c.id !== id);
    setCompetitionsData(updated);

    // Simpan ke localStorage
    localStorage.setItem("lomba17_competitions", JSON.stringify(updated));

    // Trigger custom event untuk update komponen lain
    window.dispatchEvent(new CustomEvent("dataUpdated"));
  }

  function handleCancelEdit() {
    setEditingCompetition(null);
    setEditingAgeGroup(null);
  }

  function handleEditAgeGroup(group: AgeGroupKey) {
    setEditingAgeGroup(group);
  }

  function handleSaveAgeGroup() {
    if (!editingAgeGroup) return;

    const updated = { ...ageGroupsData };
    setAgeGroupsData(updated);
    setEditingAgeGroup(null);

    // Simpan ke localStorage
    localStorage.setItem("lomba17_ageGroups", JSON.stringify(updated));

    // Trigger custom event untuk update komponen lain
    window.dispatchEvent(new CustomEvent("dataUpdated"));
  }

  function handleAddAgeGroup() {
    if (!newAgeGroup.key || !newAgeGroup.label) return;

    const updated = {
      ...ageGroupsData,
      [newAgeGroup.key as AgeGroupKey]: {
        label: newAgeGroup.label,
        min: newAgeGroup.min,
        max: newAgeGroup.max,
      },
    };
    setAgeGroupsData(updated);
    setShowAddAgeGroup(false);
    setNewAgeGroup({ key: "", label: "", min: 0, max: 0 });

    // Simpan ke localStorage
    localStorage.setItem("lomba17_ageGroups", JSON.stringify(updated));

    // Trigger custom event untuk update komponen lain
    window.dispatchEvent(new CustomEvent("dataUpdated"));
  }

  function handleDeleteAgeGroup(group: AgeGroupKey) {
    if (
      !confirm(
        `Yakin ingin menghapus kategori "${ageGroupsData[group].label}"?`
      )
    )
      return;

    const updated = { ...ageGroupsData };
    delete updated[group];
    setAgeGroupsData(updated);

    // Simpan ke localStorage
    localStorage.setItem("lomba17_ageGroups", JSON.stringify(updated));

    // Trigger custom event untuk update komponen lain
    window.dispatchEvent(new CustomEvent("dataUpdated"));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight"
        >
          Panel Admin - Kelola Lomba
        </motion.h1>
        <p className="mt-2 text-foreground/70">
          Kelola kategori usia dan daftar lomba untuk acara 17 Agustus.
        </p>

        {/* Admin Toggle for Testing */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Mode Admin:
            </label>
            <button
              onClick={() => {
                const newStatus = !adminMode;
                setAdminMode(newStatus);
                setAdminStatus(newStatus);

                // Show feedback
                alert(
                  `Mode Admin ${newStatus ? "diaktifkan" : "dinonaktifkan"}`
                );
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                adminMode
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
            >
              {adminMode ? "Aktif" : "Nonaktif"}
            </button>
          </div>

          {adminMode && (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Mode Admin Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* Kategori Usia */}
      <section className="mt-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Kategori Usia</h2>
            <button
              onClick={() => setShowAddAgeGroup(true)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Kategori
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(ageGroupsData) as AgeGroupKey[]).map((group) => {
              const Icon = iconByGroup[group];
              const info = ageGroupsData[group];
              const isEditing = editingAgeGroup === group;

              return (
                <div
                  key={group}
                  className="rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold">{info.label}</h3>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => handleEditAgeGroup(group)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            title="Edit kategori"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgeGroup(group)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            title="Hapus kategori"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={info.label}
                          onChange={(e) => {
                            const updated = { ...ageGroupsData };
                            updated[group].label = e.target.value;
                            setAgeGroupsData(updated);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Min Usia
                          </label>
                          <input
                            type="number"
                            value={info.min}
                            onChange={(e) => {
                              const updated = { ...ageGroupsData };
                              updated[group].min = Number(e.target.value);
                              setAgeGroupsData(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Max Usia
                          </label>
                          <input
                            type="number"
                            value={info.max}
                            onChange={(e) => {
                              const updated = { ...ageGroupsData };
                              updated[group].max = Number(e.target.value);
                              setAgeGroupsData(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveAgeGroup}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm"
                        >
                          <Save className="h-4 w-4" />
                          Simpan
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md text-sm"
                        >
                          <X className="h-4 w-4" />
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-foreground/70">
                      <p>
                        Rentang Usia: {info.min} - {info.max} tahun
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Daftar Lomba */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Daftar Lomba</h2>
          <button
            onClick={() => setShowAddCompetition(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Lomba
          </button>
        </div>
        <div className="space-y-4">
          {competitionsData.map((comp) => {
            const isEditing = editingCompetition?.id === comp.id;

            return (
              <div
                key={comp.id}
                className="rounded-lg border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-4"
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nama Lomba
                        </label>
                        <input
                          type="text"
                          value={editingCompetition.name}
                          onChange={(e) =>
                            setEditingCompetition({
                              ...editingCompetition,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Deskripsi (opsional)
                        </label>
                        <input
                          type="text"
                          value={editingCompetition.description || ""}
                          onChange={(e) =>
                            setEditingCompetition({
                              ...editingCompetition,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Min Usia
                        </label>
                        <input
                          type="number"
                          value={editingCompetition.minAge}
                          onChange={(e) =>
                            setEditingCompetition({
                              ...editingCompetition,
                              minAge: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Max Usia
                        </label>
                        <input
                          type="number"
                          value={editingCompetition.maxAge}
                          onChange={(e) =>
                            setEditingCompetition({
                              ...editingCompetition,
                              maxAge: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingCompetition.team || false}
                            onChange={(e) =>
                              setEditingCompetition({
                                ...editingCompetition,
                                team: e.target.checked,
                              })
                            }
                            className="rounded"
                          />
                          <span className="text-sm font-medium">Lomba Tim</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCompetition}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm"
                      >
                        <Save className="h-4 w-4" />
                        Simpan
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md text-sm"
                      >
                        <X className="h-4 w-4" />
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{comp.name}</h3>
                      {comp.description && (
                        <p className="text-sm text-foreground/70 mt-1">
                          {comp.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-foreground/60">
                        <span>
                          Usia: {comp.minAge}-{comp.maxAge} tahun
                        </span>
                        {comp.team && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Tim
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditCompetition(comp)}
                        className="p-2 text-gray-500 hover:text-red-600"
                        title="Edit lomba"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompetition(comp.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                        title="Hapus lomba"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Manajemen Peserta */}
      <section className="mt-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Manajemen Peserta</h2>
            <button
              onClick={() => setShowAddPeserta(true)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Peserta
            </button>
          </div>

          {loadingPeserta ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {peserta.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {p.nama}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {p.jenisLomba} • {p.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditPeserta(p)}
                      className="p-2 text-gray-500 hover:text-blue-600"
                      title="Edit peserta"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePeserta(p._id || "")}
                      disabled={deletingPesertaId === p._id}
                      className="p-2 text-gray-500 hover:text-red-600"
                      title="Hapus peserta"
                    >
                      {deletingPesertaId === p._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Manajemen Turnamen */}
      <section className="mt-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Manajemen Turnamen</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Select
                value={selectedTurnamenStatus}
                onValueChange={setSelectedTurnamenStatus}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Terdaftar">Terdaftar</SelectItem>
                  <SelectItem value="Lolos ke Babak Selanjutnya">
                    Lolos
                  </SelectItem>
                  <SelectItem value="Juara 1">Juara 1</SelectItem>
                  <SelectItem value="Juara 2">Juara 2</SelectItem>
                  <SelectItem value="Juara 3">Juara 3</SelectItem>
                  <SelectItem value="Diskualifikasi">Diskualifikasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingPeserta ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {peserta
                .filter(
                  (p) =>
                    selectedTurnamenStatus === "semua" ||
                    p.status === selectedTurnamenStatus
                )
                .map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {p.nama}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {p.jenisLomba} • {p.status}
                      </p>
                      {p.babak && p.babak !== "Penyisihan" && (
                        <p className="text-xs text-blue-600">
                          Babak: {p.babak}
                        </p>
                      )}
                      {p.skor !== undefined && p.skor > 0 && (
                        <p className="text-xs text-green-600">Skor: {p.skor}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleQuickAction(p._id || "", "Lolos")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Lolos
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleQuickAction(p._id || "", "Juara 1")
                          }
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          Juara 1
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleQuickAction(p._id || "", "Juara 2")
                          }
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          Juara 2
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleQuickAction(p._id || "", "Juara 3")
                          }
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Juara 3
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAction(p._id || "", "DQ")}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          DQ
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Tambah Kategori Usia */}
      {showAddAgeGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5 text-red-600" />
                Tambah Kategori Usia
              </h3>
              <button
                onClick={() => setShowAddAgeGroup(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddAgeGroup();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Key (ID) Kategori
                </label>
                <input
                  type="text"
                  value={newAgeGroup.key}
                  onChange={(e) =>
                    setNewAgeGroup({ ...newAgeGroup, key: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: balita, muda, tua"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Label Kategori
                </label>
                <input
                  type="text"
                  value={newAgeGroup.label}
                  onChange={(e) =>
                    setNewAgeGroup({ ...newAgeGroup, label: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Balita, Usia Muda, Usia Tua"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Min Usia
                  </label>
                  <input
                    type="number"
                    value={newAgeGroup.min}
                    onChange={(e) =>
                      setNewAgeGroup({
                        ...newAgeGroup,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Usia
                  </label>
                  <input
                    type="number"
                    value={newAgeGroup.max}
                    onChange={(e) =>
                      setNewAgeGroup({
                        ...newAgeGroup,
                        max: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAgeGroup(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Lomba */}
      {showAddCompetition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5 text-red-600" />
                Tambah Lomba Baru
              </h3>
              <button
                onClick={() => setShowAddCompetition(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCompetition();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Lomba
                </label>
                <input
                  type="text"
                  value={newCompetition.name}
                  onChange={(e) =>
                    setNewCompetition({
                      ...newCompetition,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Balap Karung, Tarik Tambang"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi (opsional)
                </label>
                <input
                  type="text"
                  value={newCompetition.description}
                  onChange={(e) =>
                    setNewCompetition({
                      ...newCompetition,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Deskripsi singkat tentang lomba"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Min Usia
                  </label>
                  <input
                    type="number"
                    value={newCompetition.minAge}
                    onChange={(e) =>
                      setNewCompetition({
                        ...newCompetition,
                        minAge: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Usia
                  </label>
                  <input
                    type="number"
                    value={newCompetition.maxAge}
                    onChange={(e) =>
                      setNewCompetition({
                        ...newCompetition,
                        maxAge: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCompetition.team}
                    onChange={(e) =>
                      setNewCompetition({
                        ...newCompetition,
                        team: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Lomba Tim</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCompetition(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Peserta */}
      {showAddPeserta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5 text-red-600" />
                Tambah Peserta Baru
              </h3>
              <button
                onClick={() => setShowAddPeserta(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPeserta();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Nama</label>
                <input
                  type="text"
                  value={editingPeserta?.nama || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      nama: e.target.value,
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nama peserta"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (opsional)
                </label>
                <input
                  type="email"
                  value={editingPeserta?.email || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      email: e.target.value,
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      alamat: editingPeserta?.alamat || "",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Email peserta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  No. Telepon
                </label>
                <input
                  type="text"
                  value={editingPeserta?.noTelepon || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      noTelepon: e.target.value,
                      nama: editingPeserta?.nama || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="No. Telepon peserta"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Usia</label>
                <input
                  type="number"
                  value={editingPeserta?.usia || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      usia: Number(e.target.value),
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Jenis Lomba
                </label>
                <input
                  type="text"
                  value={editingPeserta?.jenisLomba || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      jenisLomba: e.target.value,
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Balap Karung, Tarik Tambang"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tanggal Daftar
                </label>
                <input
                  type="date"
                  value={editingPeserta?.tanggalDaftar || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      tanggalDaftar: e.target.value,
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editingPeserta?.status || "Terdaftar"}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      status: e.target.value,
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="Terdaftar">Terdaftar</option>
                  <option value="Lolos ke Babak Selanjutnya">Lolos</option>
                  <option value="Juara 1">Juara 1</option>
                  <option value="Juara 2">Juara 2</option>
                  <option value="Juara 3">Juara 3</option>
                  <option value="Diskualifikasi">Diskualifikasi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alamat</label>
                <input
                  type="text"
                  value={editingPeserta?.alamat || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      alamat: e.target.value,
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Alamat peserta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Babak (opsional)
                </label>
                <input
                  type="text"
                  value={editingPeserta?.babak || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      babak: e.target.value,
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Contoh: Babak 1, Final"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Skor (opsional)
                </label>
                <input
                  type="number"
                  value={editingPeserta?.skor || ""}
                  onChange={(e) =>
                    setEditingPeserta({
                      ...editingPeserta,
                      skor: Number(e.target.value),
                      nama: editingPeserta?.nama || "",
                      noTelepon: editingPeserta?.noTelepon || "",
                      usia: editingPeserta?.usia || 0,
                      jenisLomba: editingPeserta?.jenisLomba || "",
                      tanggalDaftar: editingPeserta?.tanggalDaftar || "",
                      status: editingPeserta?.status || "Terdaftar",
                      email: editingPeserta?.email || "",
                      alamat: editingPeserta?.alamat || "",
                    } as Peserta)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Skor peserta"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPeserta(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
