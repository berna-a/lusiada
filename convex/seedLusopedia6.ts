import { internalMutation } from "./_generated/server";

type Seed = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  infobox: { label: string; value: string }[];
  sources: { label: string; url?: string | null }[];
  body: string;
  pantheonSlug?: string;
  aliases?: string[];
};

/** Liga interna a outro artigo da Lusopédia. */
function lk(slug: string, text: string) {
  return `<a href="/arca/lusopedia/${slug}">${text}</a>`;
}

const SEEDS: Seed[] = [
  {
    slug: "alexandre-herculano",
    title: "Alexandre Herculano",
    category: "Pessoas",
    summary:
      "O fundador da história científica em Portugal — e um dos grandes do Romantismo.",
    tags: ["literatura", "história", "século XIX"],
    infobox: [
      { label: "Nascimento", value: "28 de Março de 1810, Lisboa" },
      { label: "Morte", value: "13 de Setembro de 1877, Vale de Lobos" },
      { label: "Obra maior", value: "História de Portugal" },
    ],
    sources: [{ label: "História de Portugal, Alexandre Herculano", url: null }],
    body: `
<p>Alexandre Herculano (1810–1877) foi historiador, romancista e poeta — uma das figuras maiores do Romantismo e o homem que deu a Portugal uma história escrita com rigor de documento.</p>
<h2>A história como ciência</h2>
<p>A sua <em>História de Portugal</em> rompeu com a lenda e a tradição: Herculano foi aos arquivos, criticou as fontes e contou o nascimento do reino como nenhum antes dele. Foi também o primeiro grande arquivista do país, salvando da ruína documentos de séculos.</p>
<h2>O romancista e o cidadão</h2>
<p>Em romances históricos como <em>Eurico, o Presbítero</em> deu vida ao passado medieval; companheiro de geração de ${lk("almeida-garrett", "Almeida Garrett")}, escreveu numa ${lk("lingua-portugueza", "língua portugueza")} de grande dignidade. Liberal íntegro, recolheu-se por fim a uma quinta, fiel à sua consciência.</p>
<h2>Porque importa</h2>
<p>Herculano ensinou Portugal a olhar-se com verdade. Sem ele, a história da fundação por ${lk("dom-afonso-henriques", "D. Afonso Henriques")} seria ainda lenda — foi ele quem a tornou conhecimento.</p>
`.trim(),
  },
  {
    slug: "mario-soares",
    title: "Mário Soares",
    category: "Pessoas",
    summary:
      "O pai da democracia portuguesa — opositor da ditadura, primeiro-ministro e Presidente.",
    tags: ["política", "democracia", "século XX"],
    infobox: [
      { label: "Nascimento", value: "7 de Dezembro de 1924, Lisboa" },
      { label: "Morte", value: "7 de Janeiro de 2017, Lisboa" },
      { label: "Cargos", value: "Primeiro-ministro; Presidente (1986–1996)" },
    ],
    sources: [{ label: "Arquivo da Fundação Mário Soares", url: null }],
    body: `
<p>Mário Soares (1924–2017) é frequentemente chamado o "pai da democracia" portuguesa. Opositor de toda a vida à ditadura, foi peça central na construção do Portugal livre que nasceu do ${lk("25-de-abril-de-1974", "25 de Abril")}.</p>
<h2>A luta contra a ditadura</h2>
<p>Preso e deportado várias vezes pelo Estado Novo, viveu no exílio até à Revolução. Fundador do Partido Socialista, regressou a ${lk("lisboa", "Lisboa")} em 1974 para ajudar a erguer um regime democrático onde antes houvera medo.</p>
<h2>Democracia e Europa</h2>
<p>Como primeiro-ministro, conduziu Portugal à adesão à Comunidade Europeia, em 1986; nesse mesmo ano tornou-se o primeiro Presidente civil em sessenta anos. Defendeu sempre a liberdade, a tolerância e o diálogo, mesmo com os adversários.</p>
<h2>Porque importa</h2>
<p>Soares encarna a passagem de Portugal da ditadura à democracia e à Europa. A sua figura combativa e conciliadora é uma das âncoras do país contemporâneo.</p>
`.trim(),
  },
  {
    slug: "gago-coutinho-e-sacadura-cabral",
    title: "Gago Coutinho e Sacadura Cabral",
    category: "Pessoas",
    summary:
      "Os aviadores da primeira travessia aérea do Atlântico Sul, em 1922.",
    tags: ["aviação", "século XX", "descobrimentos"],
    infobox: [
      { label: "Façanha", value: "1.ª travessia aérea do Atlântico Sul" },
      { label: "Ano", value: "1922 (Lisboa–Rio de Janeiro)" },
      { label: "Invenção", value: "Sextante de horizonte artificial" },
    ],
    sources: [{ label: "Relatório da Travessia, 1922", url: null }],
    body: `
<p>Carlos Viegas Gago Coutinho e Artur de Sacadura Cabral realizaram, em 1922, a primeira travessia aérea do Atlântico Sul, de ${lk("lisboa", "Lisboa")} ao Rio de Janeiro. Foi a herança dos ${lk("era-dos-descobrimentos", "Descobrimentos")} levada aos céus.</p>
<h2>Navegar pelo ar</h2>
<p>Antes do rádio e do radar, voar sobre o oceano exigia navegar como os antigos pilotos do mar — pelos astros. Gago Coutinho aperfeiçoou um <em>sextante de horizonte artificial</em>, que permitia medir a posição no céu sem ver a linha do mar. Foi um feito de ciência tanto como de coragem.</p>
<h2>Uma viagem de meses</h2>
<p>A travessia, feita por etapas e com aviões perdidos pelo caminho, durou de Março a Junho. Quando aterraram no Rio, foram aclamados como heróis dos dois lados do Atlântico.</p>
<h2>Porque importa</h2>
<p>A façanha provou que o engenho náutico português continuava vivo na era da máquina. Coutinho e Sacadura uniram pelo ar os dois continentes que Portugal unira pelo mar.</p>
`.trim(),
  },
  {
    slug: "florbela-espanca",
    title: "Florbela Espanca",
    category: "Pessoas",
    summary:
      "A poetisa da paixão e da dor — uma das vozes femininas mais intensas da língua.",
    tags: ["literatura", "poesia", "século XX"],
    infobox: [
      { label: "Nascimento", value: "8 de Dezembro de 1894, Vila Viçosa" },
      { label: "Morte", value: "8 de Dezembro de 1930, Matosinhos" },
      { label: "Obras", value: "Livro de Mágoas, Charneca em Flor" },
    ],
    sources: [{ label: "Sonetos, Florbela Espanca", url: null }],
    body: `
<p>Florbela Espanca (1894–1930) é uma das vozes mais intensas da poesia portugueza. Numa época que pouco espaço dava às mulheres, escreveu sobre o desejo, a solidão e a dor com uma coragem que escandalizou e comoveu.</p>
<h2>O soneto da alma</h2>
<p>Mestra do soneto, deixou em <em>Livro de Mágoas</em> e <em>Charneca em Flor</em> versos de uma sinceridade ardente. A sua poesia é toda feita de paixão e de ferida — "Eu quero amar, amar perdidamente!".</p>
<h2>Uma vida breve</h2>
<p>A vida foi-lhe áspera: casamentos desfeitos, a morte do irmão aviador, a incompreensão. Morreu no dia em que fazia 36 anos. Só depois da morte a sua obra alcançou o lugar que merecia, na ${lk("lingua-portugueza", "língua portugueza")}.</p>
<h2>Porque importa</h2>
<p>Florbela deu voz, como ninguém antes, ao mundo interior das mulheres portuguezas. A sua palavra, livre e febril, continua a falar a cada geração que a redescobre.</p>
`.trim(),
  },
  {
    slug: "cesario-verde",
    title: "Cesário Verde",
    category: "Pessoas",
    summary:
      "O poeta da cidade e do quotidiano — precursor da poesia moderna portugueza.",
    tags: ["literatura", "poesia", "século XIX"],
    infobox: [
      { label: "Nascimento", value: "25 de Fevereiro de 1855, Lisboa" },
      { label: "Morte", value: "19 de Julho de 1886, Lisboa" },
      { label: "Obra", value: "O Livro de Cesário Verde (póstumo)" },
    ],
    sources: [{ label: "O Livro de Cesário Verde, 1887", url: null }],
    body: `
<p>Cesário Verde (1855–1886) foi um poeta incompreendido em vida e hoje reconhecido como o grande precursor da poesia moderna em Portugal. Cantou o que ninguém cantava: a cidade, o trabalho, a rua.</p>
<h2>O olhar da rua</h2>
<p>Comerciante de dia, poeta de noite, fez de ${lk("lisboa", "Lisboa")} a sua matéria. Em <em>O Sentimento dum Ocidental</em>, percorre a cidade ao anoitecer com um olhar de fotógrafo — as varinas, os operários, as montras, o Tejo. É a vida real feita verso.</p>
<h2>O pai dos modernos</h2>
<p>Morreu de tuberculose aos 31 anos, quase ignorado. Mas o seu rigor visual e a sua linguagem concreta abriram caminho à modernidade — ${lk("fernando-pessoa", "Fernando Pessoa")} reconheceu-o como mestre, e dele dizia Álvaro de Campos versos de admiração.</p>
<h2>Porque importa</h2>
<p>Cesário ensinou a poesia portugueza a ver o presente e a cidade. Sem ele, faltaria o elo entre o Romantismo e o século XX das letras.</p>
`.trim(),
  },
  {
    slug: "guerra-peninsular",
    title: "Guerra Peninsular",
    category: "Eventos",
    summary:
      "As invasões francesas e a resistência luso-britânica que defenderam Portugal (1807–1814).",
    tags: ["século XIX", "guerra", "Napoleão"],
    infobox: [
      { label: "Período", value: "1807–1814" },
      { label: "Invasões", value: "Três invasões francesas" },
      { label: "Defesa-chave", value: "Linhas de Torres Vedras" },
    ],
    sources: [{ label: "Memórias da Guerra Peninsular", url: null }],
    body: `
<p>A Guerra Peninsular foi o conflito que, entre 1807 e 1814, opôs Portugal e os seus aliados britânicos aos exércitos de Napoleão. Travou-se em solo português e espanhol e marcou profundamente o país.</p>
<h2>As invasões francesas</h2>
<p>Quando Portugal recusou aderir ao bloqueio continental contra a Inglaterra, Napoleão mandou invadi-lo. A corte refugiou-se no Brasil, e três invasões assolaram o reino. O povo respondeu com uma resistência feroz, da guerrilha às ordenanças.</p>
<h2>As Linhas de Torres</h2>
<p>A norte de ${lk("lisboa", "Lisboa")}, o duque de Wellington mandou erguer as Linhas de Torres Vedras — um sistema secreto de fortificações que travou o avanço francês e salvou a capital. Foi a chave da vitória aliada.</p>
<h2>Porque importa</h2>
<p>A guerra defendeu a independência, mas deixou o país arruinado e a corte no Brasil — uma fractura que conduziria às lutas liberais. Foi o violento limiar do Portugal contemporâneo.</p>
`.trim(),
  },
  {
    slug: "obidos",
    title: "Óbidos",
    category: "Lugares",
    summary:
      "A vila medieval muralhada que os reis ofereciam às rainhas.",
    tags: ["vila", "medieval", "castelo"],
    infobox: [
      { label: "Distrito", value: "Leiria" },
      { label: "Ex-líbris", value: "Castelo e muralhas intactas" },
      { label: "Tradição", value: "«Vila das Rainhas»" },
    ],
    sources: [{ label: "Foral de Óbidos", url: null }],
    body: `
<p>Óbidos é uma das vilas mais bem preservadas de Portugal: um casario branco e florido encerrado por muralhas medievais, coroado por um castelo. Atravessá-la é entrar na Idade Média.</p>
<h2>A vila das rainhas</h2>
<p>Diz a tradição que, ao visitá-la, a rainha D. Isabel se encantou de tal modo que o rei ${lk("d-dinis", "D. Dinis")} lha ofereceu. Daí em diante, Óbidos pertenceu sempre às rainhas de Portugal — a "Casa das Rainhas" — durante séculos.</p>
<h2>Muralha e ginja</h2>
<p>Pode percorrer-se o adarve da muralha em redor de toda a vila. As ruelas estreitas, as igrejas e a ginja servida em copo de chocolate fazem dela um dos lugares mais visitados do país, palco hoje de festivais de livros e de época medieval.</p>
<h2>Porque importa</h2>
<p>Óbidos guarda, intacta, a memória da vila medieval portugueza. É um retrato vivo de como era o país quando os seus reis cavalgavam entre castelos.</p>
`.trim(),
  },
  {
    slug: "aveiro",
    title: "Aveiro",
    category: "Lugares",
    summary:
      "A cidade da ria e dos moliceiros — a «Veneza de Portugal».",
    tags: ["cidade", "ria", "Arte Nova"],
    infobox: [
      { label: "Distrito", value: "Aveiro" },
      { label: "Ex-líbris", value: "Ria, canais e moliceiros" },
      { label: "Doçaria", value: "Ovos moles" },
    ],
    sources: [{ label: "Monografia de Aveiro", url: null }],
    body: `
<p>Aveiro é a cidade da água: assenta junto a uma vasta ria, recortada por canais onde deslizam os <em>moliceiros</em>, barcos coloridos de proa erguida. Por isso lhe chamam, com orgulho, a "Veneza de Portugal".</p>
<h2>A ria e o sal</h2>
<p>A laguna deu à cidade a sua riqueza: o sal das salinas, a apanha do moliço e a pesca. Os moliceiros, outrora de trabalho, são hoje a imagem festiva de Aveiro, com as suas pinturas humorísticas na proa.</p>
<h2>Arte Nova e ovos moles</h2>
<p>No início do século XX, Aveiro encheu-se de fachadas de <em>Arte Nova</em>, com flores e curvas em azulejo e ferro. E há os <em>ovos moles</em> — doce conventual de gema e açúcar em hóstia, com a forma de búzios e peixes da ria.</p>
<h2>Porque importa</h2>
<p>Aveiro mostra como a geografia faz a identidade: de uma laguna nasceram um modo de vida, uma arte e um doce únicos. É a água feita cidade.</p>
`.trim(),
  },
  {
    slug: "galo-de-barcelos",
    title: "Galo de Barcelos",
    category: "Símbolos",
    summary:
      "O galo da lenda que virou o mais popular símbolo de Portugal.",
    tags: ["símbolos", "lenda", "artesanato"],
    infobox: [
      { label: "Origem", value: "Barcelos, Minho" },
      { label: "Lenda", value: "O galo que cantou para salvar um inocente" },
      { label: "Hoje", value: "Símbolo popular de Portugal" },
    ],
    sources: [{ label: "Lendas do Minho", url: null }],
    body: `
<p>O Galo de Barcelos é, talvez, o mais reconhecível símbolo popular de Portugal: uma figura de louça pintada de cores vivas, presente em todas as casas e lojas de recordações do país.</p>
<h2>A lenda</h2>
<p>Conta-se que um peregrino, acusado injustamente de um roubo em Barcelos, foi condenado à forca. Perante o juiz que jantava um galo assado, jurou: "Tão certo como eu estar inocente, esse galo cantará quando me enforcarem." E o galo ergueu-se e cantou — e o homem foi salvo.</p>
<h2>De lenda a ícone</h2>
<p>A história fixou-se na louça de Barcelos, terra de oleiros do Minho. Pintado de coração, cravos e cores, o galo tornou-se emblema da justiça, da fé e da boa-sorte — e cartão de visita de Portugal no mundo.</p>
<h2>Porque importa</h2>
<p>O Galo de Barcelos prova como uma lenda popular pode tornar-se identidade nacional. É o Portugal do povo, da fé simples e da esperança, feito barro e cor.</p>
`.trim(),
  },
  {
    slug: "calcada-portuguesa",
    title: "Calçada Portuguesa",
    category: "Arte",
    summary:
      "O empedrado de pedra preta e branca que faz dos passeios um tapete de arte.",
    tags: ["arte", "património", "Lisboa"],
    infobox: [
      { label: "Material", value: "Calcário branco e basalto preto" },
      { label: "Ex-líbris", value: "As ondas do Rossio, em Lisboa" },
      { label: "Alcance", value: "De Lisboa ao antigo império" },
    ],
    sources: [{ label: "História da Calçada Portuguesa", url: null }],
    body: `
<p>A calçada portugueza é a arte de pavimentar ruas e praças com pequenas pedras de calcário branco e basalto preto, dispostas em padrões. Transforma o chão das cidades num tapete desenhado.</p>
<h2>O chão como tela</h2>
<p>Difundida em ${lk("lisboa", "Lisboa")} no século XIX, cobriu praças e passeios de figuras geométricas, brasões e cenas. O mais famoso de todos é o "Mar Largo" do Rossio — ondas em preto e branco que dão vertigem a quem as olha.</p>
<h2>Um chão que viajou</h2>
<p>Da capital, a calçada espalhou-se pelo país e pelo antigo império, do Brasil a Macau — outra herança da ${lk("era-dos-descobrimentos", "vocação")} de levar Portugal ao mundo. É feita à mão, pedra a pedra, pelos <em>calceteiros</em>.</p>
<h2>Porque importa</h2>
<p>A calçada é a arte que se pisa sem reparar — e que, no entanto, é das mais portuguezas que há. Faz do espaço público um museu ao ar livre, sob os pés de todos.</p>
`.trim(),
  },
];

/**
 * Seed: sexta leva de artigos-âncora da Lusopédia (canon rumo aos ~100).
 * Mesmo molde: voz editorial, "Porque importa", interlinks, capas, grafia
 * Portuguez. Idempotente por slug.
 */
export const seedFoundation6 = internalMutation({
  args: {},
  handler: async (ctx) => {
    let created = 0;
    let updated = 0;
    for (const s of SEEDS) {
      const fields = {
        title: s.title,
        category: s.category,
        tags: s.tags,
        summary: s.summary,
        body: s.body,
        cover_image_id: null,
        cover_image_url: `/lusopedia/${s.slug}.webp`,
        image_credit: "Wikimedia Commons",
        aliases: s.aliases,
        authorship: "ai",
        infobox: s.infobox,
        sources: s.sources,
        status: "published" as const,
        pantheon_slug: s.pantheonSlug ?? null,
      };
      const existing = await ctx.db
        .query("articles")
        .withIndex("by_slug", (q) => q.eq("slug", s.slug))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, fields);
        updated += 1;
      } else {
        await ctx.db.insert("articles", {
          ...fields,
          slug: s.slug,
          author_id: null,
        });
        created += 1;
      }
    }
    return { created, updated, total: SEEDS.length };
  },
});
