/** Hypothetical figures used by the public example. */
export const example = {
  item: "Machined housing",
  agreementRef: "PA-4418",
  invoiceRef: "INV-20441",
  agreedUnit: 41.5,
  billedUnit: 45.6,
  units: 182_000,
} as const;

export const illustrativeLabel = "Example";

export const unitDelta =
  Math.round((example.billedUnit - example.agreedUnit) * 100) / 100;
export const potentialDiscrepancy =
  Math.round(example.units * unitDelta * 100) / 100;

if (unitDelta !== 4.1 || potentialDiscrepancy !== 746_200) {
  throw new Error(
    "Example must equal 182,000 × ($45.60 − $41.50) = $746,200."
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
