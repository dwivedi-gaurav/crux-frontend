import { CruxMetrics } from "../types/crux";

export const headerMetrcKeyMap: Record<string, keyof CruxMetrics> = {
  LCP: "largest_contentful_paint",
  FCP: "first_contentful_paint",
  CLS: "cumulative_layout_shift",
  INP: "interaction_to_next_paint",
  TTFB: "experimental_time_to_first_byte",
} as const;
