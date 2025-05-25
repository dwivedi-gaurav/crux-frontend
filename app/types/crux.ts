export interface CruxMetric {
  percentiles: {
    p75: number;
  };
  histogram: Array<{
    start: number;
    end: number;
    density: number;
  }>;
}

export interface CruxMetrics {
  largest_contentful_paint: CruxMetric;
  first_contentful_paint: CruxMetric;
  cumulative_layout_shift: CruxMetric;
  interaction_to_next_paint: CruxMetric;
  experimental_time_to_first_byte: CruxMetric;
}

export interface CruxRecord {
  key: {
    url: string;
    formFactor: string;
  };
  metrics: CruxMetrics;
}

export interface CruxData {
  record: CruxRecord;
}

export interface CruxError {
  code: number;
  message: string;
  status: string;
  details?: unknown;
}

export interface CruxResult {
  url: string;
  data?: CruxData;
  error?: CruxError;
}
