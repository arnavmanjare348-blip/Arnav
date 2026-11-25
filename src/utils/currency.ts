export const FREE_SHIPPING_THRESHOLD_INR = 1499;
export const SHIPPING_FEE_INR = 99;

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}
