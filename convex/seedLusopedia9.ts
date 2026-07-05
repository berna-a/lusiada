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
    slug: "alfama",
    title: "Alfama",
    category: "Lugares",
    summary:
      "O bairro mais antigo de Lisboa — labirinto mourisco, berço do fado e de Santo António.",
    tags: ["Lisboa", "bairro", "fado"],
    infobox: [
      { label: "Cidade", value: "Lisboa" },
      { label: "Origem do nome", value: "Do árabe «al-hamma» (as fontes)" },
      { label: "Ex-líbris", value: "Fado, Sé, Castelo de São Jorge" },
    ],
    sources: [{ label: "História dos bairros de Lisboa", url: null }],
    body: `
<p>Alfama é o bairro mais antigo de ${lk("lisboa", "Lisboa")} — um labirinto de ruelas, escadinhas e becos que desce do Castelo de São Jorge até ao Tejo. O seu nome vem do árabe, herança dos séculos mouros da cidade.</p>
<h2>O bairro que resistiu</h2>
<p>Construído sobre rocha firme, Alfama foi dos poucos lugares que sobreviveram ao ${lk("terramoto-de-1755", "terramoto de 1755")}. Manteve, por isso, o traçado medieval e mourisco — estreito, sombrio e fresco — que o resto de Lisboa perdeu.</p>
<h2>Fado e festa</h2>
<p>É na Alfama que mais vive o ${lk("fado", "fado")}, cantado nas casas e nas tascas das suas ruas. E é aqui que arde a maior das festas: a noite de ${lk("santo-antonio", "Santo António")}, a 12 de Junho, com arraiais, manjericos e sardinha em cada esquina.</p>
<h2>Porque importa</h2>
<p>Alfama é a alma popular de Lisboa — o coração antigo onde a cidade guarda a sua memória árabe, a sua música e o seu santo. Perder-se nas suas ruas é tocar o Portugal mais autêntico.</p>
`.trim(),
  },
  {
    slug: "conimbriga",
    title: "Conímbriga",
    category: "Lugares",
    summary:
      "As maiores ruínas romanas de Portugal — uma cidade de mosaicos junto a Coimbra.",
    tags: ["arqueologia", "romano", "património"],
    infobox: [
      { label: "Localização", value: "Condeixa-a-Nova, junto a Coimbra" },
      { label: "Época", value: "Cidade romana (séc. I a.C.–V d.C.)" },
      { label: "Ex-líbris", value: "Casa dos Repuxos e mosaicos" },
    ],
    sources: [{ label: "Escavações de Conímbriga", url: null }],
    body: `
<p>Conímbriga é o maior e mais bem conservado sítio arqueológico romano de Portugal. Perto de ${lk("coimbra", "Coimbra")} — que dela herdou o nome —, foi uma próspera cidade do Império, hoje desenterrada e visitável.</p>
<h2>Uma cidade romana</h2>
<p>Habitada já antes dos romanos, floresceu sob o Império com fórum, termas, aquedutos e ruas calcetadas. Aí se vê como vivia uma cidade da Lusitânia: as casas, as lojas, os banhos públicos.</p>
<h2>O esplendor dos mosaicos</h2>
<p>O seu tesouro são os mosaicos. Na Casa dos Repuxos, pavimentos inteiros mostram caçadas, deuses e animais, e um engenhoso sistema de jogos de água. É a arte romana à escala do quotidiano.</p>
<h2>Porque importa</h2>
<p>Conímbriga lembra que, muito antes de ser Portugal, esta terra foi Roma. As suas pedras e mosaicos são a raiz mais antiga da nossa civilização — e da própria ${lk("lingua-portugueza", "língua portugueza")}, filha do latim.</p>
`.trim(),
  },
  {
    slug: "vale-do-coa",
    title: "Vale do Côa",
    category: "Lugares",
    summary:
      "O maior santuário de arte rupestre ao ar livre do mundo — gravuras com milénios.",
    tags: ["arte rupestre", "pré-história", "património"],
    infobox: [
      { label: "Localização", value: "Vila Nova de Foz Côa" },
      { label: "Idade", value: "Paleolítico (dezenas de milhares de anos)" },
      { label: "Património", value: "Mundial (UNESCO)" },
    ],
    sources: [{ label: "Parque Arqueológico do Vale do Côa", url: null }],
    body: `
<p>O Vale do Côa guarda o maior conjunto de arte rupestre ao ar livre do mundo: milhares de gravuras feitas na rocha ao longo de dezenas de milhares de anos, desde o Paleolítico até à Idade do Ferro.</p>
<h2>Os primeiros artistas</h2>
<p>Nas escarpas do rio Côa, mãos pré-históricas gravaram cavalos, auroques, cabras e cervos com um realismo impressionante. É a prova de que, muito antes da escrita, já havia aqui quem quisesse fixar o mundo em imagens.</p>
<h2>Salvas das águas</h2>
<p>As gravuras quase desapareceram nos anos 90, sob uma barragem em construção. Uma vasta mobilização — "as gravuras não sabem nadar" — fez parar a obra e salvar o vale, hoje Património Mundial e parque arqueológico.</p>
<h2>Porque importa</h2>
<p>O Côa liga o Portugal de hoje aos seus habitantes mais antigos, há milénios. É a mais funda raiz da arte nesta terra — e um exemplo raro de um país que escolheu a memória em vez do betão.</p>
`.trim(),
  },
  {
    slug: "belmonte",
    title: "Belmonte",
    category: "Lugares",
    summary:
      "A vila da fé escondida — berço de Pedro Álvares Cabral e da memória judaica.",
    tags: ["vila", "judeus", "descobrimentos"],
    infobox: [
      { label: "Distrito", value: "Castelo Branco" },
      { label: "Filho ilustre", value: "Pedro Álvares Cabral" },
      { label: "Memória", value: "Comunidade judaica histórica" },
    ],
    sources: [{ label: "História dos cristãos-novos de Belmonte", url: null }],
    body: `
<p>Belmonte é uma vila serrana da Beira com duas histórias extraordinárias: foi o berço de um descobridor do Brasil e o último refúgio de uma fé praticada em segredo durante séculos.</p>
<h2>A fé escondida</h2>
<p>Após a expulsão e conversão forçada dos judeus, em 1496-97, muitos mantiveram a sua religião às escondidas, sob aparência cristã. Em Belmonte, isolada na serra, uma comunidade conseguiu preservar tradições judaicas em segredo até ao século XX — caso único no mundo.</p>
<h2>O berço de Cabral</h2>
<p>De Belmonte era a família de ${lk("pedro-alvares-cabral", "Pedro Álvares Cabral")}, o navegador que, em 1500, aportou ao Brasil. O castelo e a igreja da vila guardam a sua memória e a da ${lk("era-dos-descobrimentos", "expansão")}.</p>
<h2>Porque importa</h2>
<p>Belmonte é um símbolo da resistência da fé e da memória. Numa só vila convivem a glória dos Descobrimentos e a história comovente de um povo que se recusou a desaparecer.</p>
`.trim(),
  },
  {
    slug: "gil-eanes",
    title: "Gil Eanes",
    category: "Pessoas",
    summary:
      "O navegador que dobrou o Cabo Bojador e venceu o medo do «mar tenebroso».",
    tags: ["navegação", "descobrimentos", "século XV"],
    infobox: [
      { label: "Feito", value: "Dobrou o Cabo Bojador (1434)" },
      { label: "Patrono", value: "Infante D. Henrique" },
      { label: "Significado", value: "Abriu a expansão pela costa africana" },
    ],
    sources: [{ label: "Crónica da Guiné, Zurara", url: null }],
    body: `
<p>Gil Eanes foi o escudeiro do ${lk("infante-dom-henrique", "Infante D. Henrique")} que, em 1434, realizou um feito mais psicológico do que geográfico: dobrou o Cabo Bojador, vencendo o terror que travara, durante anos, a expansão portuguesa.</p>
<h2>O medo do fim do mundo</h2>
<p>Dizia-se que, para lá do Bojador, na costa de África, o mar fervia, os monstros esperavam e nenhum navio voltava. Era o "mar tenebroso". Várias expedições recuavam, sem coragem de passar.</p>
<h2>O salto da fé</h2>
<p>Por ordem do Infante, Gil Eanes afastou-se da costa, contornou o cabo por mar alto e regressou são e salvo — provando que as lendas eram falsas. O medo quebrou-se, e o caminho para o Sul ficou aberto.</p>
<h2>Porque importa</h2>
<p>O feito de Gil Eanes foi a verdadeira primeira vitória dos Descobrimentos: não sobre o mar, mas sobre o medo. Sem ele, ${lk("vasco-da-gama", "Vasco da Gama")} talvez nunca tivesse chegado à Índia.</p>
`.trim(),
  },
  {
    slug: "amadeo-de-souza-cardoso",
    title: "Amadeo de Souza-Cardoso",
    category: "Pessoas",
    summary:
      "O pioneiro da pintura moderna em Portugal — vanguardista de génio, morto jovem.",
    tags: ["arte", "pintura", "século XX"],
    infobox: [
      { label: "Nascimento", value: "14 de Novembro de 1887, Manhufe" },
      { label: "Morte", value: "25 de Outubro de 1918, Espinho" },
      { label: "Movimento", value: "Vanguardas (cubismo, futurismo)" },
    ],
    sources: [
      { label: "Catálogo raisonné de Amadeo de Souza-Cardoso", url: null },
    ],
    body: `
<p>Amadeo de Souza-Cardoso (1887–1918) foi o primeiro grande pintor moderno português. Em Paris, no fervilhar das vanguardas, criou uma obra de fulgor único — e morreu cedo demais para a ver reconhecida.</p>
<h2>No coração da vanguarda</h2>
<p>Mudou-se para Paris ainda jovem e tornou-se amigo de Modigliani e de outros nomes maiores da arte do seu tempo. Absorveu o cubismo e o futurismo, mas fundiu-os numa linguagem própria, vibrante de cor e de movimento.</p>
<h2>Génio interrompido</h2>
<p>Regressado a Portugal com a guerra, continuou a pintar no isolamento do Norte. Morreu aos 30 anos, vítima da pneumónica — a gripe que então assolava o mundo. Deixou uma obra breve e deslumbrante, hoje das mais valiosas da arte portuguesa.</p>
<h2>Porque importa</h2>
<p>Amadeo abriu Portugal à modernidade artística, antes de ${lk("vieira-da-silva", "Vieira da Silva")} e dos que viriam. É a prova de que, mesmo na periferia, podia nascer um génio à altura da vanguarda mundial.</p>
`.trim(),
  },
  {
    slug: "guitarra-portuguesa",
    title: "Guitarra Portuguesa",
    category: "Arte",
    summary:
      "O instrumento de doze cordas que dá voz ao fado — som inconfundível de Portugal.",
    tags: ["música", "fado", "instrumento"],
    infobox: [
      { label: "Cordas", value: "Doze (em seis pares)" },
      { label: "Forma", value: "Caixa em pera; cravelhame em leque" },
      { label: "Modelos", value: "De Lisboa e de Coimbra" },
    ],
    sources: [{ label: "Organologia da guitarra portuguesa", url: null }],
    body: `
<p>A guitarra portuguesa é o instrumento que dá ao ${lk("fado", "fado")} o seu som inconfundível: cristalino, trémulo, melancólico. De caixa em forma de pera e doze cordas em seis pares, é uma das mais belas criações da música portuguesa.</p>
<h2>Um som único</h2>
<p>Descendente das antigas cítaras europeias, ganhou em Portugal forma e voz próprias. O seu característico cravelhame em leque e a afinação em pares de cordas produzem aquele timbre brilhante que dialoga com a voz do fadista.</p>
<h2>Lisboa e Coimbra</h2>
<p>Há dois grandes modelos: o de Lisboa, mais agudo e ornamentado, que acompanha o fado de ${lk("alfama", "Alfama")}; e o de Coimbra, de som mais grave e sóbrio, ligado à canção académica. Mestres como Carlos Paredes elevaram-na a instrumento solista.</p>
<h2>Porque importa</h2>
<p>A guitarra portuguesa é a voz instrumental da alma nacional. Sem ela não há fado — e poucas coisas dizem "Portugal" tão depressa como o seu primeiro acorde.</p>
`.trim(),
  },
  {
    slug: "alvaro-siza",
    title: "Álvaro Siza",
    category: "Pessoas",
    summary:
      "O maior arquitecto português — mestre da luz e da forma, laureado com o Pritzker.",
    tags: ["arquitectura", "arte", "século XX"],
    infobox: [
      { label: "Nascimento", value: "25 de Junho de 1933, Matosinhos" },
      { label: "Prémio Pritzker", value: "1992" },
      { label: "Escola", value: "Escola do Porto" },
    ],
    sources: [{ label: "Obra de Álvaro Siza Vieira", url: null }],
    body: `
<p>Álvaro Siza Vieira (n. 1933) é o mais influente arquitecto português e um dos maiores do mundo. Em 1992 recebeu o Prémio Pritzker, o "Nobel da arquitectura", levando o nome de Portugal ao topo da disciplina.</p>
<h2>A arquitectura da luz</h2>
<p>A sua obra é reconhecível pela depuração das formas, pelo branco das paredes e pelo modo magistral como trabalha a luz e o lugar. Das Piscinas de Marés de Leça, junto ao ${lk("porto", "Porto")}, ao Pavilhão de Portugal da ${lk("expo-98", "Expo 98")}, com a sua pala de betão suspensa como um pano, cada edifício é uma lição de contenção.</p>
<h2>A Escola do Porto</h2>
<p>Formado e formador na cidade do Porto, Siza tornou-se mestre de gerações de arquitectos, projectando a chamada "Escola do Porto" para o mundo. Continua a desenhar, com a mesma mão sábia, bem entrado o século XXI.</p>
<h2>Porque importa</h2>
<p>Siza provou que Portugal podia dar ao mundo arquitectura da mais alta exigência. A sua obra, sóbria e luminosa, é uma das maiores contribuições portuguesas para a cultura contemporânea.</p>
`.trim(),
  },
  {
    slug: "miguel-torga",
    title: "Miguel Torga",
    category: "Pessoas",
    summary:
      "O médico-escritor de Trás-os-Montes — voz telúrica e livre das letras portuguezas.",
    tags: ["literatura", "século XX", "Trás-os-Montes"],
    infobox: [
      {
        label: "Nascimento",
        value: "12 de Agosto de 1907, São Martinho de Anta",
      },
      { label: "Morte", value: "17 de Janeiro de 1995, Coimbra" },
      { label: "Obras", value: "A Criação do Mundo; Bichos; Diário" },
    ],
    sources: [{ label: "Diário, Miguel Torga", url: null }],
    body: `
<p>Miguel Torga — pseudónimo de Adolfo Correia da Rocha (1907–1995) — foi médico e escritor, uma das vozes mais íntegras e telúricas da literatura portugueza do século XX. A sua palavra cheira a terra, a serra e a liberdade.</p>
<h2>A terra e o homem</h2>
<p>Nascido camponês em Trás-os-Montes, nunca cortou o vínculo com a sua terra áspera. Em <em>Bichos</em>, <em>A Criação do Mundo</em> e nos contos, deu voz aos humildes, aos animais e às pedras do seu mundo rural, numa ${lk("lingua-portugueza", "língua portugueza")} densa e seca.</p>
<h2>O Diário</h2>
<p>Durante mais de sessenta anos escreveu um <em>Diário</em> monumental — a crónica de um homem livre que recusou compromissos com a ditadura e com as modas. Médico em ${lk("coimbra", "Coimbra")}, fez da escrita a sua segunda vocação e o seu testemunho.</p>
<h2>Porque importa</h2>
<p>Torga é a consciência rude e honesta das letras portuguezas — o escritor que provou que o universal se alcança a partir do mais fundo enraizamento na terra natal.</p>
`.trim(),
  },
  {
    slug: "tratado-de-windsor",
    title: "Tratado de Windsor",
    category: "Eventos",
    summary:
      "A aliança luso-britânica de 1386 — a mais antiga aliança diplomática ainda em vigor.",
    tags: ["medieval", "diplomacia", "século XIV"],
    infobox: [
      { label: "Ano", value: "1386" },
      { label: "Partes", value: "Portugal e Inglaterra" },
      { label: "Estatuto", value: "Aliança mais antiga do mundo em vigor" },
    ],
    sources: [{ label: "Texto do Tratado de Windsor, 1386", url: null }],
    body: `
<p>O Tratado de Windsor, assinado em 1386, selou a aliança entre Portugal e a Inglaterra. Mais de seis séculos depois, continua em vigor — é a mais antiga aliança diplomática do mundo ainda activa.</p>
<h2>«Amizade perpétua»</h2>
<p>O tratado estabelecia uma "amizade perpétua" e apoio mútuo entre os dois reinos. Veio na sequência da ajuda inglesa a ${lk("d-joao-i", "D. João I")} na crise que dera a independência a Portugal face a Castela.</p>
<h2>Selada por um casamento</h2>
<p>A aliança foi reforçada pelo casamento de D. João I com Filipa de Lencastre, princesa inglesa. Dessa união nasceu a "Ínclita Geração" que lançaria a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} — entre eles o ${lk("infante-dom-henrique", "Infante D. Henrique")}, de sangue meio inglês.</p>
<h2>Porque importa</h2>
<p>Windsor mostra a continuidade extraordinária da diplomacia portuguesa: uma aliança feita na Idade Média que atravessou guerras e séculos. É um dos mais duradouros laços da história mundial.</p>
`.trim(),
  },
];

/**
 * Seed: nona leva de artigos-âncora da Lusopédia — fecha o canon dos ~100.
 * Mesmo molde: voz editorial, "Porque importa", interlinks, capas, grafia
 * Portuguez. Idempotente por slug.
 */
export const seedFoundation9 = internalMutation({
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
