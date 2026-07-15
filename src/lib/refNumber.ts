/**
 * OTI Reference Number Utilities
 * Format: OTIR{YEAR}{SEQUENCE_4_DIGITS}
 * e.g. OTIR20260001, OTIR20270042
 */

import { supabase } from "@/lib/supabase";

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Get next sequential reference number for the current year.
 * The counter is derived from cloud data so it stays consistent across devices.
 */
export async function generateOTIRefNumber(): Promise<string> {
  const year = getCurrentYear();

  try {
    const start = `${year}-01-01T00:00:00.000Z`;
    const end = `${year + 1}-01-01T00:00:00.000Z`;

    const { count, error } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .gte("submitted_at", start)
      .lt("submitted_at", end);

    if (error) {
      throw error;
    }

    const seq = (count ?? 0) + 1;
    return formatRefNumber(year, seq);
  } catch (error) {
    console.error("Unable to generate cloud-based ref number, falling back to timestamp sequence:", error);
    return formatRefNumber(year, Date.now() % 1000000);
  }
}

export function formatRefNumber(year: number, seq: number): string {
  return `OTIR${year}${String(seq).padStart(4, "0")}`;
}

