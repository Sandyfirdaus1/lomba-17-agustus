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
import {
  Trophy,
  Medal,
  Users,
  Calendar,
  Clock,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

interface Peserta {
  _id: string;
  nama: string;
  noTelepon: string;
  usia: number;
  jenisLomba: string;
  tanggalDaftar: string;
  status: string;
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

export default function TurnamenPage() {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [selectedLomba, setSelectedLomba] = useState<string>("semua");
  const [loading, setLoading] = useState(true);

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

  const fetchPeserta = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/peserta`);
      const data = await response.json();

      if (data.success) {
        setPeserta(data.data);
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Juara 1":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Juara 2":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      case "Juara 3":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "Lolos ke Babak Selanjutnya":
        return "bg-green-200 text-green-900 border border-green-300";
      case "Diskualifikasi":
        return "bg-red-200 text-red-900 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800";
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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

  const filteredPeserta =
    selectedLomba === "semua"
      ? peserta
      : peserta.filter((p) => p.jenisLomba === selectedLomba);

  const juara = filteredPeserta.filter((p) => p.status.includes("Juara"));
  const lolos = filteredPeserta.filter(
    (p) => p.status === "Lolos ke Babak Selanjutnya"
  );
  const diskualifikasi = filteredPeserta.filter(
    (p) => p.status === "Diskualifikasi"
  );

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200 shadow-sm p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12 text-red-600" />
              <h1 className="text-4xl font-bold text-red-800">
                Hasil Turnamen Lomba 17 Agustus
              </h1>
            </div>
            <p className="text-lg text-red-700">
              Lihat hasil lengkap turnamen dan pemenang lomba
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-yellow-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Juara
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {juara.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Peserta Lolos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {lolos.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Peserta
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredPeserta.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Lomba Aktif
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(filteredPeserta.map((p) => p.jenisLomba)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
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
          </div>

          {/* Juara Section */}
          {juara.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 shadow-sm p-4">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">🏆</span>
                </div>
                <h2 className="text-2xl font-bold text-yellow-800">
                  Pemenang Lomba
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {juara.map((p) => (
                  <Card
                    key={p._id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg border-2 border-yellow-200 hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <CardTitle className="text-lg font-semibold text-yellow-900 flex-1 min-w-0 truncate">
                          {p.nama}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getStatusColor(p.status)}>
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-yellow-800">
                        <Medal className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{p.jenisLomba}</span>
                      </div>

                      <div className="flex items-center text-sm text-yellow-800">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Usia: {p.usia} tahun</span>
                      </div>

                      {p.hadiah && (
                        <div className="flex items-center text-sm text-yellow-800">
                          <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{p.hadiah}</span>
                        </div>
                      )}

                      {p.catatanJuri && (
                        <div className="flex items-center text-sm text-yellow-800">
                          <Star className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{p.catatanJuri}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Peserta Lolos Section */}
          {lolos.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 shadow-sm p-4">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">→</span>
                </div>
                <h2 className="text-2xl font-bold text-green-800">
                  Peserta Lolos ke Babak Selanjutnya
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lolos.map((p) => (
                  <Card
                    key={p._id}
                    className="bg-gradient-to-br from-green-50 to-blue-50 shadow-lg border-2 border-green-200 hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <CardTitle className="text-lg font-semibold text-green-900 flex-1 min-w-0 truncate">
                          {p.nama}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getStatusColor(p.status)}>
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-green-800">
                        <Medal className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{p.jenisLomba}</span>
                      </div>

                      {p.babak && p.babak !== "Penyisihan" && (
                        <div className="flex items-center text-sm text-green-800">
                          <span className="mr-2">🏆</span>
                          <span className="truncate">Babak: {p.babak}</span>
                        </div>
                      )}

                      {p.skor !== undefined && p.skor > 0 && (
                        <div className="flex items-center text-sm text-green-800">
                          <Star className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Skor: {p.skor}</span>
                        </div>
                      )}

                      {p.ranking && p.ranking > 0 && (
                        <div className="flex items-center text-sm text-green-800">
                          <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Ranking: #{p.ranking}
                          </span>
                        </div>
                      )}

                      {p.waktuPenyelesaian && p.waktuPenyelesaian > 0 && (
                        <div className="flex items-center text-sm text-green-800">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Waktu: {formatTime(p.waktuPenyelesaian)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Ranking Section */}
          {filteredPeserta.filter((p) => p.ranking && p.ranking > 0).length >
            0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm p-4">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">🥇</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-800">
                  Ranking Peserta
                </h2>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ranking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lomba
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Skor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPeserta
                        .filter((p) => p.ranking && p.ranking > 0)
                        .sort((a, b) => (a.ranking || 0) - (b.ranking || 0))
                        .map((p) => (
                          <tr key={p._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{p.ranking}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {p.nama}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {p.jenisLomba}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {p.skor || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {p.waktuPenyelesaian
                                ? formatTime(p.waktuPenyelesaian)
                                : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(p.status)}>
                                {p.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {filteredPeserta.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada hasil turnamen
              </h3>
              <p className="text-gray-600">
                {selectedLomba === "semua"
                  ? "Belum ada hasil turnamen yang tersedia"
                  : `Belum ada hasil turnamen untuk ${selectedLomba}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
