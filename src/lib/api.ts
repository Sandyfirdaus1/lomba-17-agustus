// API Service untuk Backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface BackendParticipant {
  _id: string;
  nama: string;
  email: string;
  noTelepon: string;
  alamat: string;
  jenisLomba: string;
  tanggalDaftar: string;
  status: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewParticipant {
  nama: string;
  email: string;
  noTelepon: string;
  alamat: string;
  jenisLomba: string;
  catatan?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface StatsResponse {
  totalPeserta: number;
  pesertaPerLomba: Array<{
    _id: string;
    count: number;
  }>;
  statusCounts: Array<{
    _id: string;
    count: number;
  }>;
}

// API Functions
export async function getAllParticipants(): Promise<BackendParticipant[]> {
  try {
    const response = await fetch(`${API_BASE}/peserta`);
    const result: ApiResponse<BackendParticipant[]> = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch participants");
    }
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
}

export async function registerParticipant(
  participant: NewParticipant
): Promise<BackendParticipant | null> {
  try {
    const response = await fetch(`${API_BASE}/peserta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(participant),
    });

    const result: ApiResponse<BackendParticipant> = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to register participant");
    }
  } catch (error) {
    console.error("Error registering participant:", error);
    return null;
  }
}

export async function getParticipantById(
  id: string
): Promise<BackendParticipant | null> {
  try {
    const response = await fetch(`${API_BASE}/peserta/${id}`);
    const result: ApiResponse<BackendParticipant> = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch participant");
    }
  } catch (error) {
    console.error("Error fetching participant:", error);
    return null;
  }
}

export async function updateParticipant(
  id: string,
  updates: Partial<NewParticipant>
): Promise<BackendParticipant | null> {
  try {
    const response = await fetch(`${API_BASE}/peserta/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const result: ApiResponse<BackendParticipant> = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to update participant");
    }
  } catch (error) {
    console.error("Error updating participant:", error);
    return null;
  }
}

export async function deleteParticipant(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/peserta/${id}`, {
      method: "DELETE",
    });

    const result: ApiResponse<any> = await response.json();

    if (result.success) {
      return true;
    } else {
      throw new Error(result.message || "Failed to delete participant");
    }
  } catch (error) {
    console.error("Error deleting participant:", error);
    return false;
  }
}

export async function getStats(): Promise<StatsResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/peserta/stats/summary`);
    const result: ApiResponse<StatsResponse> = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch stats");
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export async function getParticipantsByCompetition(
  competition: string
): Promise<BackendParticipant[]> {
  try {
    const response = await fetch(
      `${API_BASE}/peserta/lomba/${encodeURIComponent(competition)}`
    );
    const result: ApiResponse<BackendParticipant[]> = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(
        result.message || "Failed to fetch participants by competition"
      );
    }
  } catch (error) {
    console.error("Error fetching participants by competition:", error);
    return [];
  }
}

// Health check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE.replace("/api", "")}/health`);
    const result = await response.json();
    return result.status === "healthy";
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}
