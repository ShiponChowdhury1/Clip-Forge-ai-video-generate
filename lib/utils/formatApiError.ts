export function formatApiDetail(detail: unknown): string {
  if (!detail && detail !== 0) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        if (!d) return "";
        if (typeof d === "string") return d;
        if (typeof d === "object") return (d as any).msg || (d as any).message || JSON.stringify(d);
        return String(d);
      })
      .filter(Boolean)
      .join("; ");
  }
  if (typeof detail === "object") {
    const d = detail as any;
    if (d.detail) return formatApiDetail(d.detail);
    if (d.message) return String(d.message);
    return JSON.stringify(detail);
  }
  return String(detail);
}
