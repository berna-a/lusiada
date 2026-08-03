import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Semear painéis de azulejo encontrados no álbum "033 Azulejos" do Photos do
 * Bernardo. Corre-se à mão, em dois passos por painel (upload não pode
 * acontecer dentro de uma mutation):
 *   1. `internalGenerateUploadUrl` → URL de upload
 *   2. curl POST da imagem → {storageId}
 *   3. `internalInsertAzulejo` com esse storageId + metadados
 * Fica sempre "pending" — a aprovação é manual, painel a painel.
 */

export const internalGenerateUploadUrl = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

const ESTADO = v.union(
  v.literal("integro"),
  v.literal("danificado"),
  v.literal("em_risco"),
  v.literal("desaparecido")
);

export const internalInsertAzulejo = internalMutation({
  args: {
    imageId: v.id("_storage"),
    lat: v.number(),
    lng: v.number(),
    morada: v.optional(v.string()),
    concelho: v.optional(v.string()),
    estado: ESTADO,
    authorId: v.id("users"),
    authorName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("azulejos", {
      lat: args.lat,
      lng: args.lng,
      gps_accuracy: null,
      morada: args.morada ?? null,
      concelho: args.concelho ?? null,
      image_id: args.imageId,
      estado: args.estado,
      padrao: null,
      epoca: null,
      oficina: null,
      autor: null,
      historia_confirmada: false,
      author_id: args.authorId,
      author_name: args.authorName ?? null,
      status: "pending",
    });
    return { id };
  },
});

/** Limpeza de uma corrida com duplicados (dois processos a inserir a par). */
export const internalDeleteAzulejo = internalMutation({
  args: { id: v.id("azulejos") },
  handler: async (ctx, { id }) => {
    const a = await ctx.db.get(id);
    if (a?.image_id) {
      await ctx.storage.delete(a.image_id);
    }
    await ctx.db.delete(id);
  },
});
