/**
 * OTI Reference Number Utilities
 * Format: OTIR{YEAR}{SEQUENCE_4_DIGITS}
 * e.g. OTIR20260001, OTIR20270042
 */

const COUNTER_KEY_PREFIX = "oti_ref_counter_";

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Get next sequential reference number for the current year.
 * The counter resets on new year automatically.
 */
export function generateOTIRefNumber(): string {
  const year = getCurrentYear();
  const counterKey = `${COUNTER_KEY_PREFIX}${year}`;

  const current = parseInt(localStorage.getItem(counterKey) || "0", 10);
  const next = current + 1;
  localStorage.setItem(counterKey, String(next));
  const ref = formatRefNumber(year, next);
  localStorage.setItem("oti_last_refno", ref);
  return ref;
}

export function formatRefNumber(year: number, seq: number): string {
  return `OTIR${year}${String(seq).padStart(4, "0")}`;
}

/**
 * Assign sequential OTIR numbers to all stored apps that still use old OTI- format.
 * Runs on Admin load to normalize legacy data.
 */
export function normalizeRefNumbers(): void {
  const appKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("oti_app_")) appKeys.push(k);
  }

  // Sort by submittedAt
  const apps = appKeys
    .map((k) => {
      try { return { key: k, data: JSON.parse(localStorage.getItem(k) || "") }; }
      catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a!.data.submittedAt).getTime() - new Date(b!.data.submittedAt).getTime()) as { key: string; data: Record<string, unknown> }[];

  // Only renumber apps that have old OTI- format refs
  apps.forEach((app, idx) => {
    const existingRef = String(app.data.refNo || "");
    if (existingRef.startsWith("OTI-") || !existingRef.startsWith("OTIR")) {
      const year = app.data.submittedAt
        ? new Date(String(app.data.submittedAt)).getFullYear()
        : getCurrentYear();

      // Count how many OTIR refs already exist for this year to determine sequence
      const seq = idx + 1;
      const newRef = formatRefNumber(year, seq);
      const updatedData = { ...app.data, refNo: newRef };

      // Remove old key, add new key
      localStorage.removeItem(app.key);
      localStorage.setItem(`oti_app_${newRef}`, JSON.stringify(updatedData));
    }
  });
}
