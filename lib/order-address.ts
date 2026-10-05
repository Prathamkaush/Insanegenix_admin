export type OrderAddress = Partial<Record<
  "name" | "phone" | "street" | "addressLine1" | "addressLine2" | "city" | "state" | "pincode" | "country",
  string
>>;

// Accept both API objects and serialized order snapshots from older deployments.
export function normalizeOrderAddress(value: unknown): OrderAddress | null {
  let address = value;
  for (let depth = 0; depth < 2 && typeof address === "string"; depth += 1) {
    try {
      address = JSON.parse(address);
    } catch {
      return null;
    }
  }
  if (!address || typeof address !== "object" || Array.isArray(address)) return null;

  const result: OrderAddress = {};
  const fields = ["name", "phone", "street", "addressLine1", "addressLine2", "city", "state", "pincode", "country"] as const;
  for (const key of fields) {
    const field = (address as Record<string, unknown>)[key];
    if (typeof field === "string" && field.trim()) result[key] = field.trim();
    else if (typeof field === "number" && Number.isFinite(field)) result[key] = String(field);
  }
  return Object.keys(result).length ? result : null;
}
