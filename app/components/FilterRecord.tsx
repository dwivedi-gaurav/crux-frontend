import { Typography, Divider, FormControlLabel, Checkbox } from "@mui/material";
import { headerMetrcKeyMap } from "../utils/constants";

type MetricKey = keyof typeof headerMetrcKeyMap;

interface FilterRecordProps {
  hideErrors: boolean;
  setHideErrors: (hideErrors: boolean) => void;
  selectedMetrics: Record<MetricKey, boolean>;
  handleMetricToggle: (metric: MetricKey) => void;
}
const FilterRecord = ({
  hideErrors,
  setHideErrors,
  selectedMetrics,
  handleMetricToggle,
}: FilterRecordProps) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={hideErrors}
            onChange={(e) => setHideErrors(e.target.checked)}
          />
        }
        label="Hide URLs with errors"
      />
      <Divider orientation="vertical" flexItem />
      <Typography variant="subtitle1">Show metrics:</Typography>
      {Object.entries(headerMetrcKeyMap).map(([key]) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={selectedMetrics[key as MetricKey]}
              onChange={() => handleMetricToggle(key as MetricKey)}
            />
          }
          label={key}
        />
      ))}
    </>
  );
};

export default FilterRecord;
