/** Hypothetical figures used by the public example. Not a customer result. */
export const example = {
  item: "Machined housing",
  agreementRef: "PA-4418",
  invoiceRef: "INV-20441",
  agreedUnit: 42,
  billedUnit: 44,
  units: 18_000,
} as const;

export const illustrativeLabel =
  "Illustrative example — not a customer result";

export const unitDelta = example.billedUnit - example.agreedUnit;
export const potentialDiscrepancy = example.units * unitDelta;

if (unitDelta !== 2 || potentialDiscrepancy !== 36_000) {
  throw new Error(
    "Illustrative example must equal 18,000 × ($44 − $42) = $36,000."
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
