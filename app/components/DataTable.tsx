import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableBody,
  Table,
} from "@mui/material";

import { headerMetrcKeyMap } from "../utils/constants";
import { CruxResult } from "../types/crux";

type MetricKey = keyof typeof headerMetrcKeyMap;
type MetricValue = (typeof headerMetrcKeyMap)[MetricKey];

interface DataTableProps {
  selectedMetrics: Record<MetricKey, boolean>;
  orderBy: MetricKey | "";
  order: "asc" | "desc";
  handleSort: (property: MetricKey) => void;
  filteredAndSortedResults: CruxResult[];
}

const DataTable = ({
  selectedMetrics,
  orderBy,
  order,
  handleSort,
  filteredAndSortedResults,
}: DataTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <strong>URL</strong>
          </TableCell>
          {Object.entries(headerMetrcKeyMap)
            .filter(([key]) => selectedMetrics[key as MetricKey])
            .map(([key]) => (
              <TableCell key={key}>
                <TableSortLabel
                  active={orderBy === key}
                  direction={orderBy === key ? order : "asc"}
                  onClick={() => handleSort(key as MetricKey)}
                  hideSortIcon={false}
                >
                  {key} (ms)
                </TableSortLabel>
              </TableCell>
            ))}
          <TableCell>Error</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredAndSortedResults.map((r, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{r.url}</TableCell>
              {Object.entries(headerMetrcKeyMap)
                .filter(([key]) => selectedMetrics[key as MetricKey])
                .map(([key, value]) => (
                  <TableCell key={key}>
                    {r.data?.record?.metrics?.[value as MetricValue]
                      ?.percentiles?.p75 ?? "–"}
                  </TableCell>
                ))}
              <TableCell sx={{ color: "red" }}>
                {r.error ? r.error.message || "something went wrong" : "–"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DataTable;
