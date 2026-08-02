import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { isMemberEmail } from "./permissions";

const MAX_NOME = 80;
const MAX_BIO = 400;
const MAX_CONCELHO = 80;
const HANDLE_MIN = 3;
const HANDLE_MAX = 24;
/** Só minúsculas, dígitos e travessão. Nada que precise de escape num URL. */
const HANDLE_OK = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/**
 * Nomes que não podem ser de ninguém.
 *
 * O endereço de um perfil é `alusiada.pt/<handle>`, à cabeça do site — por
 * isso qualquer nome que colida com uma página da casa tem de estar fora.
 * Estão aqui todas as rotas de primeiro nível, mais as que ainda não existem
 * mas hão-de existir. Ao acrescentar uma página nova, acrescentar aqui também.
 */
const HANDLES_RESERVADOS = new Set([
  "a-associacao",
  "aderir",
  "admin",
  "administrador",
  "ajuda",
  "api",
  "apoiar",
  "arca",
  "associacao",
  "azulejos",
  "bem-vindo",
  "blog",
  "canto",
  "comunidade",
  "conta",
  "contacto",
  "contactos",
  "criar-conta",
  "decifrados",
  "definicoes",
  "desporto",
  "dicionario",
  "entrar",
  "episodios",
  "explorar",
  "grupos",
  "loja",
  "lusiada",
  "mapa",
  "membros",
  "moderacao",
  "noticias",
  "novo",
  "obras",
  "os-lusiadas",
  "os-lusiadas-decifrados",
  "painel",
  "panteao",
  "perfil",
  "perguntas",
  "plano",
  "privacidade",
  "procurar",
  "programa",
  "registar",
  "sair",
  "sobre",
  "termos",
  "u",
  "viagem",
]);

/** Transforma um nome em algo aceitável para o endereço público. */
export function sugerirHandle(base: string): string {
  const limpo = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, HANDLE_MAX);
  return limpo.length >= HANDLE_MIN
    ? limpo
    : `lusiada-${limpo}`.slice(0, HANDLE_MAX);
}

function validarHandle(handle: string): string {
  const h = handle.trim().toLowerCase();
  if (h.length < HANDLE_MIN || h.length > HANDLE_MAX) {
    throw new Error(
      `O nome de utilizador tem de ter entre ${HANDLE_MIN} e ${HANDLE_MAX} caracteres.`
    );
  }
  if (!HANDLE_OK.test(h)) {
    throw new Error(
      "Use apenas letras minúsculas, números e travessões — e não comece nem acabe em travessão."
    );
  }
  if (HANDLES_RESERVADOS.has(h)) {
    throw new Error("Esse nome de utilizador está reservado. Escolha outro.");
  }
  return h;
}

/** Prende um valor ao intervalo 0–100. Uma percentagem fora dele não existe. */
function limitar(valor: number): number {
  return Number.isFinite(valor) ? Math.min(100, Math.max(0, valor)) : 50;
}

function texto(valor: string | undefined, max: number): string | null {
  if (!valor) {
    return null;
  }
  const t = valor.trim().slice(0, max);
  return t.length > 0 ? t : null;
}

async function porUser(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("user_id", userId))
    .first();
}

/** Forma pública de um perfil, com o que quer que precise de ser resolvido. */
async function paraPublico(ctx: QueryCtx, p: Doc<"profiles">) {
  const user = await ctx.db.get(p.user_id);
  return {
    handle: p.handle,
    nomePublico: p.nome_publico,
    bio: p.bio ?? null,
    concelho: p.concelho ?? null,
    avatarUrl: p.avatar_id ? await ctx.storage.getUrl(p.avatar_id) : null,
    capaUrl: p.capa_id ? await ctx.storage.getUrl(p.capa_id) : null,
    capaPos: p.capa_pos ?? 50,
    desde: p._creationTime,
    ehSocio: await isMemberEmail(ctx, user?.email),
  };
}

/* ──────────────── Leitura ──────────────── */

/** O meu perfil. Devolve null se ainda não passou pelas boas-vindas. */
export const meu = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const p = await porUser(ctx, userId);
    const user = await ctx.db.get(userId);
    if (!p) {
      // Ainda sem perfil: devolve o que se sabe, para as boas-vindas
      // arrancarem já preenchidas.
      return {
        existe: false as const,
        sugestaoNome: user?.name ?? "",
        sugestaoHandle: sugerirHandle(user?.name ?? user?.email ?? "membro"),
        email: user?.email ?? null,
      };
    }
    return {
      existe: true as const,
      handle: p.handle,
      nomePublico: p.nome_publico,
      bio: p.bio ?? null,
      concelho: p.concelho ?? null,
      avatarUrl: p.avatar_id ? await ctx.storage.getUrl(p.avatar_id) : null,
      capaUrl: p.capa_id ? await ctx.storage.getUrl(p.capa_id) : null,
      capaPos: p.capa_pos ?? 50,
      perfilPrivado: p.perfil_privado ?? false,
      onboardingFeito: p.onboarding_feito ?? false,
      email: user?.email ?? null,
      desde: p._creationTime,
    };
  },
});

/** Perfil público de outra pessoa, pelo handle. */
export const porHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const p = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) =>
        q.eq("handle", handle.trim().toLowerCase())
      )
      .first();
    if (!p || p.perfil_privado) {
      return null;
    }
    return await paraPublico(ctx, p);
  },
});

/** Os painéis aprovados de alguém — o que se mostra no perfil público. */
export const contributosPorHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const p = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) =>
        q.eq("handle", handle.trim().toLowerCase())
      )
      .first();
    if (!p || p.perfil_privado) {
      return [];
    }
    const items = await ctx.db
      .query("azulejos")
      .withIndex("by_author", (q) => q.eq("author_id", p.user_id))
      .order("desc")
      .collect();
    return Promise.all(
      items
        .filter((a) => a.status === "approved")
        .map(async (a) => ({
          _id: a._id,
          criadoEm: a._creationTime,
          estado: a.estado,
          morada: a.morada ?? null,
          concelho: a.concelho ?? null,
          imageUrl: await ctx.storage.getUrl(a.image_id),
        }))
    );
  },
});

/** Está livre este nome de utilizador? Usado enquanto se escreve. */
export const handleLivre = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const h = handle.trim().toLowerCase();
    if (h.length < HANDLE_MIN || h.length > HANDLE_MAX || !HANDLE_OK.test(h)) {
      return { livre: false, motivo: "formato" as const };
    }
    if (HANDLES_RESERVADOS.has(h)) {
      return { livre: false, motivo: "reservado" as const };
    }
    const existente = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", h))
      .first();
    if (!existente) {
      return { livre: true, motivo: null };
    }
    const userId = await getAuthUserId(ctx);
    // O meu próprio handle conta como livre para mim.
    return existente.user_id === userId
      ? { livre: true, motivo: null }
      : { livre: false, motivo: "ocupado" as const };
  },
});

/* ──────────────── Escrita ──────────────── */

/**
 * Só o enquadramento da capa. Arrastar a capa não é editar o perfil: pedir o
 * formulário inteiro para guardar um número era pesado e arriscava apagar o
 * que ainda estivesse por escrever.
 */
export const guardarCapaPos = mutation({
  args: { capaPos: v.number() },
  handler: async (ctx, { capaPos }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão.");
    }
    const p = await porUser(ctx, userId);
    if (!p) {
      throw new Error("Ainda não tem perfil.");
    }
    await ctx.db.patch(p._id, { capa_pos: limitar(capaPos) });
  },
});

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

/**
 * Cria ou actualiza o perfil. É o mesmo caminho para as boas-vindas e para a
 * edição — muda só se já existia.
 */
export const guardar = mutation({
  args: {
    handle: v.string(),
    nomePublico: v.string(),
    bio: v.optional(v.string()),
    concelho: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
    removerAvatar: v.optional(v.boolean()),
    capaId: v.optional(v.id("_storage")),
    removerCapa: v.optional(v.boolean()),
    capaPos: v.optional(v.number()),
    perfilPrivado: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão.");
    }
    const handle = validarHandle(args.handle);
    const nome = texto(args.nomePublico, MAX_NOME);
    if (!nome) {
      throw new Error("Escreva o nome que quer mostrar.");
    }

    // O handle é único: confirma-se aqui, que o Convex não impõe unicidade.
    const ocupado = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .first();
    if (ocupado && ocupado.user_id !== userId) {
      throw new Error("Esse nome de utilizador já está a ser usado.");
    }

    const existente = await porUser(ctx, userId);
    const campos = {
      handle,
      nome_publico: nome,
      bio: texto(args.bio, MAX_BIO),
      concelho: texto(args.concelho, MAX_CONCELHO),
      perfil_privado: args.perfilPrivado ?? existente?.perfil_privado ?? false,
      capa_pos: limitar(args.capaPos ?? existente?.capa_pos ?? 50),
      onboarding_feito: true,
    };

    // Trocar uma imagem apaga a anterior: sem isto o armazenamento enche-se
    // de retratos que ninguém volta a ver.
    const trocar = async (
      actual: Id<"_storage"> | null,
      nova: Id<"_storage"> | undefined,
      remover: boolean | undefined
    ) => {
      if (nova) {
        if (actual) {
          await ctx.storage.delete(actual);
        }
        return nova;
      }
      if (remover && actual) {
        await ctx.storage.delete(actual);
        return null;
      }
      return actual;
    };

    if (existente) {
      await ctx.db.patch(existente._id, {
        ...campos,
        avatar_id: await trocar(
          existente.avatar_id ?? null,
          args.avatarId,
          args.removerAvatar
        ),
        capa_id: await trocar(
          existente.capa_id ?? null,
          args.capaId,
          args.removerCapa
        ),
      });
      return { handle };
    }

    await ctx.db.insert("profiles", {
      user_id: userId,
      ...campos,
      avatar_id: args.avatarId ?? null,
      capa_id: args.capaId ?? null,
    });
    return { handle };
  },
});
