"use client";

import { useState, useEffect } from "react";
import {
  getCompetitions,
  getAgeGroups,
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
} from "lucide-react";
import { motion } from "framer-motion";

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
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setAdminMode(isAdmin());
    const checkAdmin = () => setAdminMode(isAdmin());
    const handleAdminStatusChange = (event: CustomEvent) => {
      setAdminMode(event.detail);
    };

    window.addEventListener("storage", checkAdmin);
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
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
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

      {/* Kategori Usia */}
      <section className="mt-12">
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
                  <div className="flex items-center gap-1">
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
                  <div className="flex items-center justify-between">
                    <div>
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
                    <div className="flex items-center gap-1">
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
    </div>
  );
}
