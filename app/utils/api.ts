import axios from "axios";
import { CruxResult } from "../types/crux";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const fetchCruxData = async (urls: string[]): Promise<CruxResult[]> => {
  const response = await axios.post<CruxResult[]>(`${backendUrl}/crux`, {
    urls,
  });
  return response.data;
};
