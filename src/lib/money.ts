const symbols: Record<string, string> = { COP: "$", USD: "US$", EUR: "€", MXN: "$" };

export function formatDecimalMoney(value: string, currency: string) {
  const match = value.trim().match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!match) return `${value} ${currency}`;
  const [, sign, integer, decimals = ""] = match;
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const visibleDecimals = decimals.replace(/0+$/, "").slice(0, 2);
  return `${sign ? "−" : ""}${symbols[currency] ?? ""}${grouped}${visibleDecimals ? `,${visibleDecimals}` : ""} ${currency}`.trim();
}
