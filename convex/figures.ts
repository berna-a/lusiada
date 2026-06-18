import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Lista as figuras publicadas, ordenadas por display_order. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const figures = await ctx.db
      .query("figures")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
    return figures.sort(
      (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
    );
  },
});

/** Devolve uma figura por slug, com os seus blocos de conteúdo ordenados. */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const figure = await ctx.db
      .query("figures")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!figure) return null;

    const blocks = await ctx.db
      .query("figure_content_blocks")
      .withIndex("by_figure", (q) => q.eq("figure_id", figure._id))
      .collect();
    blocks.sort((a, b) => a.display_order - b.display_order);

    return { figure, blocks };
  },
});

/**
 * Seed (reset idempotente) do nosso patrono, Luiz Vaz de Camões.
 * Remove versões anteriores e respectivos blocos antes de inserir, deixando
 * sempre um único Camões correcto. Corre com: npx convex run figures:seedCamoes
 */
export const seedCamoes = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "luiz-vaz-de-camoes";

    // Limpar quaisquer versões anteriores (slug actual ou grafia antiga).
    for (const s of [slug, "luis-vaz-de-camoes"]) {
      const prev = await ctx.db
        .query("figures")
        .withIndex("by_slug", (q) => q.eq("slug", s))
        .first();
      if (prev) {
        const prevBlocks = await ctx.db
          .query("figure_content_blocks")
          .withIndex("by_figure", (q) => q.eq("figure_id", prev._id))
          .collect();
        for (const blk of prevBlocks) {
          await ctx.db.delete(blk._id);
        }
        await ctx.db.delete(prev._id);
      }
    }

    const figureId = await ctx.db.insert("figures", {
      name: "Luiz Vaz de Camões",
      slug,
      epithet: "O Príncipe dos Poetas",
      category: "Poeta",
      era: "Século XVI",
      birth_year: "1524",
      death_year: "1580",
      attributes: ["Poeta", "Soldado", "Patrono da Lusíada"],
      display_order: 1,
      is_published: true,
      is_figure_of_year: true,
    });

    const blocks: Array<{
      block_type: string;
      title?: string;
      content?: string;
      attribution?: string;
      display_order: number;
    }> = [
      {
        block_type: "quote",
        content:
          "As armas e os barões assinalados,\nQue da ocidental praia Lusitana,\nPor mares nunca de antes navegados,\nPassaram ainda além da Taprobana…",
        attribution: "Os Lusíadas — Canto I, 1",
        display_order: 1,
      },
      {
        block_type: "text",
        title: "Vida",
        content:
          "Luiz Vaz de Camões nasceu por volta de 1524, provavelmente em Lisboa, no seio de uma família de pequena nobreza. Recebeu formação humanística sólida — conhecia os clássicos latinos, a mitologia e a história — e cedo se revelou poeta de talento raro. A sua vida foi de aventura e infortúnio: cortesão caído em desgraça, soldado em Ceuta onde perdeu o olho direito, viajante por todo o Oriente português, de Goa a Macau. Naufragou na foz do rio Mekong, onde, conta a tradição, salvou a nado o manuscrito da sua obra maior. Regressou a Lisboa pobre e doente, mas trazendo consigo o poema que haveria de imortalizar a língua portuguesa.",
        display_order: 2,
      },
      {
        block_type: "text",
        title: "Os Lusíadas",
        content:
          "Publicada em 1572, Os Lusíadas é a epopeia da nação portuguesa. Em dez cantos e mais de mil estrofes, Camões canta a viagem de Vasco da Gama à Índia e, com ela, toda a história e o destino de Portugal. É obra de ambição universal: nela convivem a mitologia clássica e a fé cristã, a geografia dos Descobrimentos e a reflexão sobre a glória e a decadência dos povos. Deu forma definitiva à língua portuguesa e ofereceu a um pequeno país à beira-mar um lugar entre as grandes literaturas do mundo.",
        display_order: 3,
      },
      {
        block_type: "text",
        title: "Legado",
        content:
          "Camões morreu a 10 de Junho de 1580, data que Portugal escolheu para celebrar o seu dia nacional — o Dia de Camões, de Portugal e das Comunidades. Mais do que um poeta, tornou-se símbolo da própria identidade portuguesa: a voz que deu palavras àquilo que um povo sentia ser. É por isso que a Associação Memória Lusíada o tem por patrono. No seu verso vive o fogo que nos fez, e que nos cabe agora manter aceso.",
        display_order: 4,
      },
    ];

    for (const b of blocks) {
      await ctx.db.insert("figure_content_blocks", {
        figure_id: figureId,
        block_type: b.block_type,
        title: b.title ?? null,
        content: b.content ?? null,
        attribution: b.attribution ?? null,
        display_order: b.display_order,
      });
    }

    return { id: figureId };
  },
});
