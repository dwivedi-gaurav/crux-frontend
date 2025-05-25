"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { validateUrl } from "./utils/validateUrl";
import { CruxResult } from "./types/crux";
import { headerMetrcKeyMap } from "./utils/constants";
import { fetchCruxData } from "./utils/api";
import DataTable from "./components/DataTable";
import FilterUrl from "./components/FilterUrl";
import FilterRecord from "./components/FilterRecord";

export default function CruxDashboard() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState<CruxResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderBy, setOrderBy] = useState<MetricKey | "">("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [hideErrors, setHideErrors] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<
    Record<MetricKey, boolean>
  >({
    LCP: true,
    FCP: true,
    CLS: true,
    INP: true,
    TTFB: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urlList.length === 0) {
      setError("Please enter at least one valid URL");
      return;
    }

    const invalidUrls = urlList.filter((url) => !validateUrl(url));

    if (invalidUrls.length > 0) {
      setError(`Invalid URLs: ${invalidUrls.join(", ")}`);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const data = await fetchCruxData(urlList);
      setResults(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to fetch CrUX data: ${error.message}`);
      } else {
        setError("Failed to fetch CrUX data: Unknown error");
      }
    }

    setLoading(false);
  };

  type MetricKey = keyof typeof headerMetrcKeyMap;

  const handleSort = (property: MetricKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleMetricToggle = (metric: MetricKey) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const filteredAndSortedResults = [...results]
    .filter((result) => !hideErrors || !result.error)
    .filter(
      (result) => selectedUrls.length === 0 || selectedUrls.includes(result.url)
    )
    .sort((a, b) => {
      if (!orderBy) return 0;

      const metricKey = headerMetrcKeyMap[orderBy];
      const aValue =
        a.data?.record?.metrics?.[metricKey]?.percentiles?.p75 ?? 0;
      const bValue =
        b.data?.record?.metrics?.[metricKey]?.percentiles?.p75 ?? 0;

      return order === "asc" ? aValue - bValue : bValue - aValue;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Webpage Performance Dashboard
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
          sx={{ minWidth: 200 }}
        >
          {loading ? <CircularProgress size={24} /> : "Fetch CrUX Data"}
        </Button>
        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </form>

      {results.length > 0 && (
        <>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <FilterRecord
              hideErrors={hideErrors}
              setHideErrors={setHideErrors}
              selectedMetrics={selectedMetrics}
              handleMetricToggle={handleMetricToggle}
            />
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <FilterUrl
              results={results}
              selectedUrls={selectedUrls}
              setSelectedUrls={setSelectedUrls}
            />
          </Box>
          <Paper elevation={3} sx={{ mt: 2, overflowX: "auto" }}>
            <DataTable
              selectedMetrics={selectedMetrics}
              orderBy={orderBy}
              order={order}
              handleSort={handleSort}
              filteredAndSortedResults={filteredAndSortedResults}
            />
          </Paper>
        </>
      )}
    </Container>
  );
}
