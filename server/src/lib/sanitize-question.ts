/** Remove meta-phrases and marks/difficulty clutter from question stems. */
export function sanitizeQuestionText(text: string): string {
  let t = text.trim();

  const patterns = [
    /\s*\(?\d+\s*marks?\)?\s*$/gi,
    /\s*\[\s*\d+\s*marks?\s*\]\s*/gi,
    /\[Easy\]|\[Moderate\]|\[Hard\]|\[Challenging\]/gi,
    /according to the (provided |uploaded )?(material|document|pdf|file|chapter|text)[,.]?\s*/gi,
    /based on the (uploaded |provided )?(material|document|pdf|file|chapter|text)[,.]?\s*/gi,
    /from the (uploaded |provided )?(material|document|pdf|file)[,.]?\s*/gi,
    /as (mentioned|stated|described|given) in the (material|document|pdf|chapter)[,.]?\s*/gi,
    /using (ideas|content|information) from the (uploaded )?(document|material)[,.]?\s*/gi,
    /with reference to the (uploaded )?(material|document)[,.]?\s*/gi,
    /^[-–—]\s*"/,
    /"\s*\?$/,
  ];

  for (const p of patterns) {
    t = t.replace(p, " ");
  }

  return t.replace(/\s{2,}/g, " ").trim();
}

export function normalizeMcqOptions(options: string[] | undefined): string[] | undefined {
  if (!options?.length) return undefined;

  const labels = ["a", "b", "c", "d"];
  const cleaned = options.slice(0, 4).map((opt, i) => {
    let o = opt.trim();
    o = o.replace(/^[A-Da-d][.)]\s*/, "");
    return `${labels[i]}) ${o}`;
  });

  while (cleaned.length < 4) {
    cleaned.push(`${labels[cleaned.length]}) —`);
  }

  return cleaned;
}
