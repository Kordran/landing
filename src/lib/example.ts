/** The worked example used across the site. One supplier, one part number. */
export const example = {
  item: "Machined housing",
  agreementRef: "PA-4418",
  invoiceRef: "INV-20441",
  agreedUnit: 42,
  billedUnit: 44.6,
  unitsPerMonth: 5_000,
  months: 24,
} as const;

export const illustrativeLabel = "Example";

export const unitDelta = round2(example.billedUnit - example.agreedUnit);
export const totalUnits = example.unitsPerMonth * example.months;
export const potentialDiscrepancy = round2(totalUnits * unitDelta);

/** Units outside the agreement's terms once the records are checked. */
export const excludedUnits = 20_000;
export const qualifiedUnits = totalUnits - excludedUnits;
export const supportedExposure = round2(qualifiedUnits * unitDelta);
export const excludedExposure = round2(excludedUnits * unitDelta);

/** What the corrected price is worth each year after the fix. */
export const annualPrevented = round2(example.unitsPerMonth * 12 * unitDelta);

if (
  unitDelta !== 2.6 ||
  totalUnits !== 120_000 ||
  potentialDiscrepancy !== 312_000 ||
  supportedExposure !== 260_000 ||
  excludedExposure !== 52_000 ||
  annualPrevented !== 156_000 ||
  potentialDiscrepancy - excludedExposure !== supportedExposure
) {
  throw new Error(
    "Example must equal 120,000 × ($44.60 − $42.00) = $312,000, with 100,000 qualifying units supporting $260,000."
  );
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatUsd(amount: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compact currency for chart scales: $40K, $1.2M. */
export function formatUsdShort(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}$${trim(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}$${trim(abs / 1_000)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function trim(value: number): string {
  return value >= 100 ? value.toFixed(0) : value.toFixed(1).replace(/\.0$/, "");
}
