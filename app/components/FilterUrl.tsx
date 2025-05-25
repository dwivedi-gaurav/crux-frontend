import { Autocomplete, TextField } from "@mui/material";
import { CruxResult } from "../types/crux";

interface FilterUrlProps {
  results: CruxResult[];
  selectedUrls: string[];
  setSelectedUrls: (urls: string[]) => void;
}

const FilterUrl = ({
  results,
  selectedUrls,
  setSelectedUrls,
}: FilterUrlProps) => {
  return (
    <Autocomplete
      multiple
      options={results.map((r) => r.url)}
      value={selectedUrls}
      onChange={(_, newValue) => setSelectedUrls(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search URLs"
          placeholder="Type to search URLs..."
          size="small"
        />
      )}
      sx={{ maxWidth: 600 }}
      clearOnBlur={false}
    />
  );
};

export default FilterUrl;
