import axios from "axios";

const API_BASE = "https://esports-api.example.com"; // Substitua pela API real

export const getLiveMatches = async () => {
  try {
    const response = await axios.get(`${API_BASE}/matches/live`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return null;
  }
};
