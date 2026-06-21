import { v } from "convex/values";
import { LEXICON } from "../src/lib/grafia/lexicon";
import { internalMutation, query } from "./_generated/server";

/** Léxico aprovado (para o seletor de grafia e exportação para o conversor). */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("lexicon")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();
    return rows.map((r) => ({
      pz: r.pz,
      ao: r.ao,
      pre: r.pre,
      kind: r.kind,
      caseExact: r.case_exact ?? false,
    }));
  },
});

/** Conta entradas do léxico. */
export const count = query({
  args: {},
  handler: async (ctx) => (await ctx.db.query("lexicon").collect()).length,
});

/** Esvazia a tabela (para re-semear de forma limpa). */
export const clearLexicon = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("lexicon").collect();
    for (const r of rows) {
      await ctx.db.delete(r._id);
    }
    return { deleted: rows.length };
  },
});

/**
 * Semeia/atualiza a tabela `lexicon` a partir do léxico do motor de conversão.
 * Idempotente por `pz`. A médio prazo a direção inverte-se: a tabela passa a
 * master (editada pela ARCA) e exporta-se para o bundle.
 */
export const seedLexicon = internalMutation({
  args: {},
  handler: async (ctx) => {
    let created = 0;
    let updated = 0;
    for (const e of LEXICON) {
      const fields = {
        pz: e.pz,
        ao: e.ao,
        pre: e.pre,
        kind: e.kind,
        case_exact: e.caseExact ?? false,
        status: "approved" as const,
      };
      const existing = await ctx.db
        .query("lexicon")
        .withIndex("by_pz", (q) => q.eq("pz", e.pz))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, fields);
        updated += 1;
      } else {
        await ctx.db.insert("lexicon", fields);
        created += 1;
      }
    }
    return { created, updated, total: LEXICON.length };
  },
});
