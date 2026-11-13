/** Hypothetical figures used by the public example. Not a customer result. */
export const example = {
  item: "Machined housing",
  agreementRef: "PA-4418",
  invoiceRef: "INV-20441",
  agreedUnit: 42,
  billedUnit: 44,
  units: 18_000,
} as const;

export const illustrativeLabel = "Example";

export const caseLabel =
  "Hypothetical example for illustration only. Not a Kordran customer result.";

export const unitDelta = example.billedUnit - example.agreedUnit;
export const potentialDiscrepancy = example.units * unitDelta;

/** A later validation step in the approach-page case. Still hypothetical. */
export const qualifiedUnits = 15_000;
export const excludedUnits = example.units - qualifiedUnits;
export const supportedExposure = qualifiedUnits * unitDelta;
export const excludedExposure = excludedUnits * unitDelta;

if (
  unitDelta !== 2 ||
  potentialDiscrepancy !== 36_000 ||
  qualifiedUnits + excludedUnits !== example.units ||
  supportedExposure !== 30_000 ||
  excludedExposure !== 6_000 ||
  potentialDiscrepancy - excludedExposure !== supportedExposure
) {
  throw new Error(
    "Example must equal 18,000 × ($44 − $42) = $36,000, with 15,000 qualifying units supporting $30,000."
  );
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
