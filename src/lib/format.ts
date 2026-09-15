export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function formatDateRange(daysFromMin: number, daysFromMax: number): string {
  const min = new Date();
  min.setDate(min.getDate() + daysFromMin);
  const max = new Date();
  max.setDate(max.getDate() + daysFromMax);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${min.toLocaleDateString("en-US", opts)} – ${max.toLocaleDateString("en-US", opts)}`;
}
