import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireAdmin } from "./permissions";

/** Limites generosos de Portugal — continente, Madeira e Açores. */
const LAT_MIN = 30;
const LAT_MAX = 43;
const LNG_MIN = -32;
const LNG_MAX = -6;

const MAX_MORADA = 240;
const MAX_CAMPO = 160;
/** Tecto de segurança na leitura do mapa (o V1 não precisa de mais). */
const MAX_NO_MAPA = 5000;

const ESTADO = v.union(
  v.literal("integro"),
  v.literal("danificado"),
  v.literal("em_risco"),
  v.literal("desaparecido")
);

const STATUS = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

/** Normaliza um campo opcional de texto: corta espaços, limita, vazio vira null. */
function campo(valor: string | undefined, max: number): string | null {
  if (!valor) {
    return null;
  }
  const limpo = valor.trim().slice(0, max);
  return limpo.length > 0 ? limpo : null;
}

/** Valida as coordenadas na fronteira. Um painel sem sítio não é um registo. */
function validarCoordenadas(lat: number, lng: number) {
  if (!(Number.isFinite(lat) && Number.isFinite(lng))) {
    throw new Error("Localização inválida.");
  }
  if (lat < LAT_MIN || lat > LAT_MAX || lng < LNG_MIN || lng > LNG_MAX) {
    throw new Error(
      "A localização está fora de Portugal. Por agora só registamos painéis em território português."
    );
  }
}

/* ──────────────── Leitura pública ──────────────── */

/** Todos os painéis aprovados, para desenhar no mapa. */
export const listApproved = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("azulejos")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(MAX_NO_MAPA);
    return items.map((a) => ({
      _id: a._id,
      lat: a.lat,
      lng: a.lng,
      estado: a.estado,
      concelho: a.concelho ?? null,
    }));
  },
});

/**
 * Ficha completa de um painel aprovado.
 * Aceita o id como texto e normaliza-o: um endereço partilhado que já não
 * existe, ou mal copiado, deve dar «não encontrado» e não rebentar a página.
 */
export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const idValido = ctx.db.normalizeId("azulejos", id);
    if (!idValido) {
      return null;
    }
    const a = await ctx.db.get(idValido);
    if (a?.status !== "approved") {
      return null;
    }
    return {
      _id: a._id,
      createdAt: a._creationTime,
      lat: a.lat,
      lng: a.lng,
      morada: a.morada ?? null,
      concelho: a.concelho ?? null,
      estado: a.estado,
      imageUrl: await ctx.storage.getUrl(a.image_id),
      padrao: a.padrao ?? null,
      epoca: a.epoca ?? null,
      oficina: a.oficina ?? null,
      autor: a.autor ?? null,
      historiaConfirmada: a.historia_confirmada ?? false,
      authorName: a.author_name ?? null,
    };
  },
});

/** Contagens para a barra de estado do mapa. */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("azulejos")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(MAX_NO_MAPA);
    const concelhos = new Set(
      items.map((a) => a.concelho).filter((c): c is string => Boolean(c))
    );
    return {
      total: items.length,
      concelhos: concelhos.size,
      desaparecidos: items.filter((a) => a.estado === "desaparecido").length,
      emRisco: items.filter((a) => a.estado === "em_risco").length,
    };
  },
});

/** Os painéis submetidos pelo próprio utilizador (qualquer estado). */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const items = await ctx.db
      .query("azulejos")
      .withIndex("by_author", (q) => q.eq("author_id", userId))
      .order("desc")
      .collect();
    return Promise.all(
      items.map(async (a) => ({
        _id: a._id,
        createdAt: a._creationTime,
        status: a.status,
        estado: a.estado,
        morada: a.morada ?? null,
        concelho: a.concelho ?? null,
        imageUrl: await ctx.storage.getUrl(a.image_id),
      }))
    );
  },
});

/* ──────────────── Submissão ──────────────── */

/** Gera um URL de upload para a fotografia. Requer sessão iniciada. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão.");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

/** Regista um painel (fica pendente de aprovação). Requer sessão. */
export const submit = mutation({
  args: {
    lat: v.number(),
    lng: v.number(),
    gpsAccuracy: v.optional(v.number()),
    imageId: v.id("_storage"),
    estado: ESTADO,
    morada: v.optional(v.string()),
    concelho: v.optional(v.string()),
    padrao: v.optional(v.string()),
    epoca: v.optional(v.string()),
    oficina: v.optional(v.string()),
    autor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para registar um painel.");
    }
    validarCoordenadas(args.lat, args.lng);

    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("azulejos", {
      lat: args.lat,
      lng: args.lng,
      gps_accuracy: args.gpsAccuracy ?? null,
      morada: campo(args.morada, MAX_MORADA),
      concelho: campo(args.concelho, MAX_CAMPO),
      image_id: args.imageId,
      estado: args.estado,
      padrao: campo(args.padrao, MAX_CAMPO),
      epoca: campo(args.epoca, MAX_CAMPO),
      oficina: campo(args.oficina, MAX_CAMPO),
      autor: campo(args.autor, MAX_CAMPO),
      historia_confirmada: false,
      author_id: userId,
      author_name: user?.name ?? user?.email ?? null,
      status: "pending",
    });
    return { id };
  },
});

/* ──────────────── Admin ──────────────── */

/** Contagem de painéis pendentes, para o crachá do menu. */
export const adminPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const email = user?.email;
    if (!email) {
      return 0;
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    if (!admin) {
      return 0;
    }
    const items = await ctx.db
      .query("azulejos")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return items.length;
  },
});

/** Lista painéis por estado de moderação. Apenas administradores. */
export const adminList = query({
  args: { status: v.optional(STATUS) },
  handler: async (ctx, { status }) => {
    const user = await getCurrentUser(ctx);
    const email = user?.email;
    if (!email) {
      return [];
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    if (!admin) {
      return [];
    }
    const items = await ctx.db
      .query("azulejos")
      .withIndex("by_status", (q) => q.eq("status", status ?? "pending"))
      .order("desc")
      .collect();
    return Promise.all(
      items.map(async (a) => ({
        _id: a._id,
        createdAt: a._creationTime,
        status: a.status,
        estado: a.estado,
        lat: a.lat,
        lng: a.lng,
        morada: a.morada ?? null,
        concelho: a.concelho ?? null,
        gpsAccuracy: a.gps_accuracy ?? null,
        // Bloco 2 — o que se sabe. Quem modera precisa de ver o que foi
        // afirmado sobre o painel, não só onde ele está.
        padrao: a.padrao ?? null,
        epoca: a.epoca ?? null,
        oficina: a.oficina ?? null,
        autor: a.autor ?? null,
        historiaConfirmada: a.historia_confirmada ?? false,
        authorName: a.author_name ?? null,
        imageUrl: await ctx.storage.getUrl(a.image_id),
      }))
    );
  },
});

/** Quantos painéis há em cada estado de moderação — para os separadores. */
export const adminCounts = query({
  args: {},
  handler: async (ctx) => {
    const vazio = { pending: 0, approved: 0, rejected: 0 };
    const user = await getCurrentUser(ctx);
    const email = user?.email;
    if (!email) {
      return vazio;
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    if (!admin) {
      return vazio;
    }
    const items = await ctx.db.query("azulejos").take(MAX_NO_MAPA);
    return items.reduce((acc, a) => {
      acc[a.status] += 1;
      return acc;
    }, vazio);
  },
});

/** Aprova/rejeita/repõe um painel. Apenas administradores. */
export const adminSetStatus = mutation({
  args: { id: v.id("azulejos"), status: STATUS },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

/** Confirma (ou retira a confirmação d)a informação histórica do bloco 2. */
export const adminSetHistoriaConfirmada = mutation({
  args: { id: v.id("azulejos"), confirmada: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { historia_confirmada: args.confirmada });
  },
});

/** Elimina um painel e a respetiva fotografia. Apenas administradores. */
export const adminDelete = mutation({
  args: { id: v.id("azulejos") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const a = await ctx.db.get(id);
    if (a?.image_id) {
      await ctx.storage.delete(a.image_id);
    }
    await ctx.db.delete(id);
  },
});
