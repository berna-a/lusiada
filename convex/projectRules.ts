export const PROJECT_LIMITS = {
  slug: 80,
  title: 120,
  summary: 320,
  description: 10_000,
  coverUrl: 500,
  budgetNote: 1000,
  need: 240,
  needsPerGroup: 20,
  updates: 30,
  updateTitle: 120,
  updateBody: 4000,
  goalCents: 100_000_000,
  contributionCents: 100_000_000,
  reference: 160,
  provider: 80,
} as const;

export const SUPPORT_WINDOW_MS = 15 * 60 * 1000;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function assertText(
  value: string,
  label: string,
  min: number,
  max: number
) {
  const clean = value.trim();
  if (clean.length < min || clean.length > max) {
    throw new Error(`${label} inválido.`);
  }
  return clean;
}

export function assertIntegerCents(
  value: number,
  max: number,
  allowZero = false
) {
  if (
    !Number.isSafeInteger(value) ||
    value < (allowZero ? 0 : 1) ||
    value > max
  ) {
    throw new Error("Montante inválido.");
  }
  return value;
}

export function normalizeSlug(value: string) {
  const slug = value.trim().toLowerCase();
  if (slug.length > PROJECT_LIMITS.slug || !SLUG_RE.test(slug)) {
    throw new Error("Endereço inválido.");
  }
  return slug;
}

export function validateNeeds(values: string[]) {
  if (values.length > PROJECT_LIMITS.needsPerGroup) {
    throw new Error("Demasiadas necessidades no mesmo grupo.");
  }
  return values.map((value) =>
    assertText(value, "Necessidade", 2, PROJECT_LIMITS.need)
  );
}

export function sumConfirmed<
  T extends { amount_cents: number; revoked_at?: number | null },
>(rows: T[]) {
  return rows.reduce(
    (total, row) => (row.revoked_at ? total : total + row.amount_cents),
    0
  );
}
