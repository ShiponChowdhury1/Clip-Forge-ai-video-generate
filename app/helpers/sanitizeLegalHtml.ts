export function sanitizeLegalHtml(html?: string | null): string {
  if (!html) return "";

  const removeConflictingStyles = (styleValue: string) => {
    const keptRules = styleValue
      .split(";")
      .map((rule) => rule.trim())
      .filter(Boolean)
      .filter((rule) => !/^(color|background-color)\s*:/i.test(rule));

    return keptRules.join("; ");
  };

  return html
    .replace(/\sstyle=("([^"]*)"|'([^']*)')/gi, (full, quoted, dbl, sgl) => {
      const styleValue = typeof dbl === "string" && dbl.length > 0 ? dbl : (sgl || "");
      const sanitized = removeConflictingStyles(styleValue);

      if (!sanitized) {
        return "";
      }

      const quote = quoted.startsWith("\"") ? '"' : "'";
      return ` style=${quote}${sanitized}${quote}`;
    })
    .replace(/\scolor=("[^"]*"|'[^']*')/gi, "");
}