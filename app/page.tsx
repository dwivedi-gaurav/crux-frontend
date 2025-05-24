"use client";

import { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
} from "@mui/material";

type CruxResult = {
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
};

export default function CruxDashboard() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState<CruxResult[]>([]);
  const [loading, setLoading] = useState(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urlList.length === 0) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await axios.post<CruxResult[]>(`${backendUrl}/crux`, {
        urls: urlList,
      });
      setResults(response.data);
    } catch (error) {
      alert(`Failed to fetch CrUX data: ${error}`);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        CrUX Performance Dashboard
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter URLs (one per line)"
          multiline
          rows={5}
          fullWidth
          margin="normal"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Fetch CrUX Data"}
        </Button>
      </form>

      {results.length > 0 && (
        <Paper elevation={3} sx={{ mt: 4, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>URL</strong>
                </TableCell>
                <TableCell>LCP (ms)</TableCell>
                <TableCell>FCP (ms)</TableCell>
                <TableCell>CLS</TableCell>
                <TableCell>INP (ms)</TableCell>
                <TableCell>TTFB (ms)</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.url}</TableCell>
                  <TableCell>
                    {r.data?.record?.metrics?.largest_contentful_paint
                      ?.percentiles?.p75 ?? "–"}
                  </TableCell>
                  <TableCell>
                    {r.data?.record?.metrics?.first_contentful_paint
                      ?.percentiles?.p75 ?? "–"}
                  </TableCell>
                  <TableCell>
                    {r.data?.record?.metrics?.cumulative_layout_shift
                      ?.percentiles?.p75 ?? "–"}
                  </TableCell>
                  <TableCell>
                    {r.data?.record?.metrics?.interaction_to_next_paint
                      ?.percentiles?.p75 ?? "–"}
                  </TableCell>
                  <TableCell>
                    {r.data?.record?.metrics?.experimental_time_to_first_byte
                      ?.percentiles?.p75 ?? "–"}
                  </TableCell>
                  <TableCell sx={{ color: "red" }}>
                    {r.error ? JSON.stringify(r.error) : "–"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
