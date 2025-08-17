"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Users, Phone, Calendar, Trash2, X } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

interface Peserta {
  _id: string;
  nama: string;
  noTelepon: string;
  usia: number;
  jenisLomba: string;
  tanggalDaftar: string;
  status: string;
  // Field baru untuk turnamen
  babak?: string;
  skor?: number;
  waktuPenyelesaian?: number;
  ranking?: number;
  alasanDiskualifikasi?: string;
  tanggalDiskualifikasi?: string;
  juara?: string;
  hadiah?: string;
  catatanJuri?: string;
  isLolos?: boolean;
  isDiskualifikasi?: boolean;
  isJuara?: boolean;
}

type FilterType =
  | "all"
  | "today"
  | "juara1"
  | "juara2"
  | "juara3"
  | "lolos"
  | "diskualifikasi"
  | null;

export default function DaftarPeserta() {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [filteredPeserta, setFilteredPeserta] = useState<Peserta[]>([]);
  const [selectedLomba, setSelectedLomba] = useState<string>("semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  // Update lomba options sesuai dengan backend
  const lombaOptions = [
    { value: "semua", label: "Semua Lomba" },
    { value: "Balap Karung", label: "Balap Karung" },
    { value: "Makan Kerupuk", label: "Makan Kerupuk" },
    { value: "Balap Kelereng", label: "Balap Kelereng" },
    { value: "Memasukkan Paku ke Botol", label: "Memasukkan Paku ke Botol" },
    { value: "Tarik Tambang (Tim)", label: "Tarik Tambang (Tim)" },
    { value: "Bakiak (Tim)", label: "Bakiak (Tim)" },
    { value: "Panjat Pinang", label: "Panjat Pinang" },
    { value: "Lempar Cincin", label: "Lempar Cincin" },
    { value: "Fashion Show Merah Putih", label: "Fashion Show Merah Putih" },
  ];

  // Check admin status
  useEffect(() => {
    const adminStatus = localStorage.getItem("lomba17_admin") === "true";
    setIsAdmin(adminStatus);

    // Listen for admin status changes
    const handleStorageChange = () => {
      const newAdminStatus = localStorage.getItem("lomba17_admin") === "true";
      setIsAdmin(newAdminStatus);
    };

    const handleAdminStatusChange = (event: CustomEvent) => {
      setIsAdmin(event.detail);
    };

    // Listen for storage changes (when admin status changes in another tab)
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events (when admin status changes in same tab)
    window.addEventListener(
      "adminStatusChanged",
      handleAdminStatusChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "adminStatusChanged",
        handleAdminStatusChange as EventListener
      );
    };
  }, []);

  const fetchPeserta = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta`);
      const data = await response.json();

      if (data.success) {
        setPeserta(data.data);
        setFilteredPeserta(data.data);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPeserta();

    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchPeserta, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = peserta;

    // Apply competition filter
    if (selectedLomba !== "semua") {
      filtered = filtered.filter((p) => p.jenisLomba === selectedLomba);
    }

    // Apply active filter
    if (activeFilter) {
      switch (activeFilter) {
        case "all":
          // Show all participants
          break;
        case "today":
          const today = new Date().toDateString();
          filtered = filtered.filter((p) => {
            const daftarDate = new Date(p.tanggalDaftar).toDateString();
            return today === daftarDate;
          });
          break;
        case "juara1":
          filtered = filtered.filter((p) => p.status === "Juara 1");
          break;
        case "juara2":
          filtered = filtered.filter((p) => p.status === "Juara 2");
          break;
        case "juara3":
          filtered = filtered.filter((p) => p.status === "Juara 3");
          break;
        case "lolos":
          filtered = filtered.filter(
            (p) => p.status === "Lolos ke Babak Selanjutnya"
          );
          break;
        case "diskualifikasi":
          filtered = filtered.filter((p) => p.status === "Diskualifikasi");
          break;
      }
    }

      setFilteredPeserta(filtered);
  }, [selectedLomba, peserta, activeFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPeserta();
  };

  const handleDeletePeserta = async (id: string) => {
    if (!isAdmin) return;

    if (!confirm("Apakah Anda yakin ingin menghapus peserta ini?")) return;

    setDeletingId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setPeserta((prev) => prev.filter((p) => p._id !== id));
        setFilteredPeserta((prev) => prev.filter((p) => p._id !== id));
        alert("Peserta berhasil dihapus");
      } else {
        throw new Error("Gagal menghapus peserta");
      }
    } catch (error) {
      console.error("Error deleting peserta:", error);
      alert("Gagal menghapus peserta");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terdaftar":
        return "bg-blue-200 text-blue-900 border border-blue-300";
      case "Diskualifikasi":
        return "bg-red-200 text-red-900 border border-red-300";
      case "Juara 1":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Juara 2":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      case "Juara 3":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "Lolos ke Babak Selanjutnya":
        return "bg-green-200 text-green-900 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case "all":
        return "Semua Peserta";
      case "today":
        return "Peserta Hari Ini";
      case "juara1":
        return "Juara 1";
      case "juara2":
        return "Juara 2";
      case "juara3":
        return "Juara 3";
      case "lolos":
        return "Peserta Lolos ke Babak Selanjutnya";
      case "diskualifikasi":
        return "Peserta Diskualifikasi";
      default:
        return "Daftar Peserta";
    }
  };

  const getFilterDescription = () => {
    switch (activeFilter) {
      case "all":
        return "Semua peserta yang telah mendaftar";
      case "today":
        return "Peserta yang mendaftar hari ini";
      case "juara1":
        return "Pemenang juara 1 dari setiap kategori lomba";
      case "juara2":
        return "Pemenang juara 2 dari setiap kategori lomba";
      case "juara3":
        return "Pemenang juara 3 dari setiap kategori lomba";
      case "lolos":
        return "Peserta yang lolos ke babak selanjutnya";
      case "diskualifikasi":
        return "Peserta yang didiskualifikasi";
      default:
        return "Lihat semua peserta yang telah mendaftar secara realtime";
    }
  };

  // Group peserta by lomba for better organization
  const groupedPeserta = filteredPeserta.reduce((acc, p) => {
    if (!acc[p.jenisLomba]) {
      acc[p.jenisLomba] = [];
    }
    acc[p.jenisLomba].push(p);
    return acc;
  }, {} as Record<string, Peserta[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {getFilterTitle()}
            </h1>
            <p className="text-lg text-gray-600">{getFilterDescription()}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "all" ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === "all" ? null : "all")
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Peserta
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {peserta.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "today" ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === "today" ? null : "today")
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Peserta Hari Ini
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        peserta.filter((p) => {
                          const today = new Date().toDateString();
                          const daftarDate = new Date(
                            p.tanggalDaftar
                          ).toDateString();
                          return today === daftarDate;
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Turnamen Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "juara1" ? "ring-2 ring-yellow-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === "juara1" ? null : "juara1")
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Juara 1</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {peserta.filter((p) => p.status === "Juara 1").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "juara2" ? "ring-2 ring-gray-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === "juara2" ? null : "juara2")
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Juara 2</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {peserta.filter((p) => p.status === "Juara 2").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "juara3" ? "ring-2 ring-orange-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === "juara3" ? null : "juara3")
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Juara 3</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {peserta.filter((p) => p.status === "Juara 3").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "lolos" ? "ring-2 ring-green-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(activeFilter === "lolos" ? null : "lolos")
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-sm">→</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lolos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        peserta.filter(
                          (p) => p.status === "Lolos ke Babak Selanjutnya"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-white shadow-lg border border-gray-200 cursor-pointer transition-all hover:shadow-xl ${
                activeFilter === "diskualifikasi" ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() =>
                setActiveFilter(
                  activeFilter === "diskualifikasi" ? null : "diskualifikasi"
                )
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Diskualifikasi
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        peserta.filter((p) => p.status === "Diskualifikasi")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Refresh */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-4">
              <Select value={selectedLomba} onValueChange={setSelectedLomba}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Pilih kategori lomba" />
                </SelectTrigger>
                <SelectContent>
                  {lombaOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              {activeFilter && (
                <Button
                  variant="outline"
                  onClick={() => setActiveFilter(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  Hapus Filter
                </Button>
              )}

            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Memperbarui..." : "Perbarui Data"}
            </Button>
          </div>
                        </div>

          {/* Peserta List - Grouped by Lomba */}
          {Object.entries(groupedPeserta).map(([lombaName, pesertaList]) => (
            <div key={lombaName} className="mb-8">
              <div className="flex items-center gap-3 mb-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {lombaName}
                </h2>
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-600"
                >
                  {pesertaList.length} peserta
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pesertaList.map((p) => (
                  <Card
                    key={p._id}
                    className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex-1 min-w-0 truncate">
                          {p.nama}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getStatusColor(p.status)}>
                            {p.status}
                          </Badge>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePeserta(p._id)}
                              disabled={deletingId === p._id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8 flex-shrink-0 border border-red-200"
                              title="Hapus peserta"
                            >
                              {deletingId === p._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{p.noTelepon}</span>
                      </div>

                      {p.usia && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Usia: {p.usia} tahun</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(p.tanggalDaftar)}
                        </span>
                      </div>

                      {/* Info Turnamen */}
                      {p.babak && p.babak !== "Penyisihan" && (
                        <div className="flex items-center text-sm text-blue-600">
                          <span className="mr-2">🏆</span>
                          <span className="truncate">Babak: {p.babak}</span>
                        </div>
                      )}

                      {p.skor !== undefined && p.skor > 0 && (
                        <div className="flex items-center text-sm text-blue-600">
                          <span className="mr-2">⭐</span>
                          <span className="truncate">Skor: {p.skor}</span>
                        </div>
                      )}

                      {p.ranking && p.ranking > 0 && (
                        <div className="flex items-center text-sm text-blue-600">
                          <span className="mr-2">🥇</span>
                          <span className="truncate">
                            Ranking: #{p.ranking}
                          </span>
                        </div>
                      )}

                      {p.waktuPenyelesaian && p.waktuPenyelesaian > 0 && (
                        <div className="flex items-center text-sm text-blue-600">
                          <span className="mr-2">⏱️</span>
                          <span className="truncate">
                            Waktu: {p.waktuPenyelesaian}s
                          </span>
                        </div>
                      )}

                      {p.catatanJuri && (
                        <div className="flex items-center text-sm text-blue-600">
                          <span className="mr-2">📝</span>
                          <span className="truncate">
                            Catatan: {p.catatanJuri}
                          </span>
                        </div>
                      )}

                      {/* Additional info for winners */}
                      {p.hadiah && (
                        <div className="flex items-center text-sm text-yellow-600">
                          <span className="mr-2">🎁</span>
                          <span className="truncate">{p.hadiah}</span>
                        </div>
                      )}

                      {/* Additional info for disqualified */}
                      {p.alasanDiskualifikasi && (
                        <div className="flex items-center text-sm text-red-600">
                          <span className="mr-2">⚠️</span>
                          <span className="truncate">
                            Alasan: {p.alasanDiskualifikasi}
                          </span>
                        </div>
                      )}

                      {p.tanggalDiskualifikasi && (
                        <div className="flex items-center text-sm text-red-600">
                          <span className="mr-2">📅</span>
                          <span className="truncate">
                            Tanggal:{" "}
                            {new Date(
                              p.tanggalDiskualifikasi
                            ).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredPeserta.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada peserta
              </h3>
              <p className="text-gray-600">
                {activeFilter
                  ? `Belum ada peserta untuk filter yang dipilih`
                  : selectedLomba === "semua"
                  ? "Belum ada peserta yang mendaftar"
                  : `Belum ada peserta untuk ${selectedLomba}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
