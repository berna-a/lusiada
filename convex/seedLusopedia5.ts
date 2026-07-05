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
    slug: "ines-de-castro",
    title: "Inês de Castro",
    category: "Pessoas",
    summary:
      "«A que depois de morta foi rainha» — o mais trágico amor da história de Portugal.",
    tags: ["século XIV", "amor", "lenda"],
    infobox: [
      { label: "Nascimento", value: "c. 1325, Galiza" },
      { label: "Morte", value: "7 de Janeiro de 1355, Coimbra" },
      { label: "Amado", value: "Infante D. Pedro (futuro Pedro I)" },
      { label: "Sepultura", value: "Mosteiro de Alcobaça" },
    ],
    sources: [{ label: "Os Lusíadas, Canto III, Luís de Camões", url: null }],
    body: `
<p>Inês de Castro (c. 1325–1355) é a heroína do mais célebre amor trágico português. Dama galega ao serviço da corte, foi amada em segredo pelo herdeiro do trono — e a sua morte por razões de Estado transformou-a em lenda.</p>
<h2>O amor proibido</h2>
<p>O Infante D. Pedro, casado por conveniência, apaixonou-se por Inês. A ligação, vista como ameaça política pela aproximação à nobreza castelhana, foi combatida pela corte. Por fim, o rei D. Afonso IV mandou matá-la, em Coimbra, à beira da Fonte dos Amores.</p>
<h2>A vingança e a coroa</h2>
<p>Quando subiu ao trono, Pedro I perseguiu os algozes e — diz a tradição — mandou exumar Inês, coroá-la rainha e obrigar a corte a beijar-lhe a mão. Mandou-a sepultar no ${lk("mosteiro-de-alcobaca", "Mosteiro de Alcobaça")}, num túmulo defronte do seu, para que ao ressuscitarem se vissem primeiro um ao outro.</p>
<h2>Porque importa</h2>
<p>${lk("luiz-vaz-de-camoes", "Camões")} imortalizou-a n'${lk("os-lusiadas", "<em>Os Lusíadas</em>")} — "Tu, só tu, puro Amor" —, e o seu mito atravessou a Europa em peças e óperas. Inês é o símbolo do amor que vence a morte, gravado no coração da memória portugueza.</p>
`.trim(),
  },
  {
    slug: "mosteiro-de-alcobaca",
    title: "Mosteiro de Alcobaça",
    category: "Lugares",
    summary:
      "A primeira grande obra gótica portugueza — e o túmulo do amor de Pedro e Inês.",
    tags: ["património", "gótico", "Cister"],
    infobox: [
      { label: "Fundação", value: "1153, por D. Afonso Henriques" },
      { label: "Ordem", value: "Cistercienses" },
      { label: "Túmulos", value: "D. Pedro I e Inês de Castro" },
      { label: "Património", value: "Mundial (UNESCO)" },
    ],
    sources: [{ label: "Crónica da Ordem de Cister", url: null }],
    body: `
<p>O Mosteiro de Santa Maria de Alcobaça é uma das primeiras e maiores obras do gótico em Portugal. Fundado pelo primeiro rei em agradecimento pela conquista de Santarém, foi durante séculos um centro de saber, oração e agricultura.</p>
<h2>O voto do primeiro rei</h2>
<p>${lk("dom-afonso-henriques", "D. Afonso Henriques")} entregou em 1153 vastas terras à Ordem de Cister. Os monges ergueram um templo de uma pureza austera — a nave altíssima e nua é uma das mais belas da arquitectura medieval — e fizeram do vale um modelo de cultivo.</p>
<h2>Os túmulos do amor</h2>
<p>Na igreja repousam, frente a frente, ${lk("ines-de-castro", "Inês de Castro")} e o rei D. Pedro I. Os dois túmulos, lavrados em pedra com cenas da vida e do Juízo Final, são obras-primas da escultura gótica — e o cenário onde a lenda do amor que venceu a morte se fez pedra.</p>
<h2>Porque importa</h2>
<p>Alcobaça é a casa de uma das histórias mais amadas de Portugal e um marco da arte medieval europeia. Nas suas pedras lê-se a fé de um reino jovem e a paixão que ${lk("luiz-vaz-de-camoes", "Camões")} levou à epopeia.</p>
`.trim(),
  },
  {
    slug: "d-joao-i",
    title: "D. João I",
    category: "Pessoas",
    summary:
      "O Mestre de Avis que salvou a independência e fundou a dinastia dos Descobrimentos.",
    tags: ["reis", "Avis", "Aljubarrota"],
    infobox: [
      { label: "Nascimento", value: "11 de Abril de 1357, Lisboa" },
      { label: "Morte", value: "14 de Agosto de 1433, Lisboa" },
      { label: "Reinado", value: "1385–1433" },
      { label: "Dinastia", value: "Fundador da Casa de Avis" },
    ],
    sources: [{ label: "Crónica de D. João I, Fernão Lopes", url: null }],
    body: `
<p>D. João I (1357–1433), o Mestre de Avis, foi aclamado rei na crise de 1383-85, quando Portugal corria o risco de ser absorvido por Castela. A sua vitória salvou a independência e abriu a era mais gloriosa do país.</p>
<h2>A crise de 1383-85</h2>
<p>Sem herdeiro legítimo após a morte de D. Fernando, o reino dividiu-se. O povo de ${lk("lisboa", "Lisboa")} aclamou o Mestre de Avis, e o génio militar de ${lk("nuno-alvares-pereira", "Nuno Álvares Pereira")} fez o resto: na ${lk("batalha-de-aljubarrota", "Batalha de Aljubarrota")}, em 1385, Portugal esmagou o exército castelhano.</p>
<h2>A Ínclita Geração</h2>
<p>Do casamento com Filipa de Lencastre — que selou a aliança com a Inglaterra, a mais antiga do mundo ainda em vigor — nasceu a "Ínclita Geração", os príncipes que lançaram a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}, entre eles o ${lk("infante-dom-henrique", "Infante D. Henrique")}. Em agradecimento à vitória, ergueu o ${lk("mosteiro-da-batalha", "Mosteiro da Batalha")}.</p>
<h2>Porque importa</h2>
<p>D. João I é o rei que manteve Portugal de pé e lançou as raízes da expansão marítima. Com ele, um país pequeno preparou-se para descobrir o mundo.</p>
`.trim(),
  },
  {
    slug: "belem",
    title: "Belém",
    category: "Lugares",
    summary:
      "A ribeira de Lisboa de onde partiram as naus — hoje o coração monumental dos Descobrimentos.",
    tags: ["Lisboa", "descobrimentos", "património"],
    infobox: [
      { label: "Localização", value: "Lisboa, junto ao Tejo" },
      { label: "Monumentos", value: "Jerónimos, Torre de Belém, Padrão" },
      { label: "Significado", value: "Ponto de partida das viagens" },
    ],
    sources: [
      { label: "Roteiro da Primeira Viagem de Vasco da Gama", url: null },
    ],
    body: `
<p>Belém, na foz do Tejo a ocidente de ${lk("lisboa", "Lisboa")}, é o lugar de onde Portugal partiu para o mundo. Daqui largaram as naus para a Índia e para o Brasil, e aqui se ergueram os monumentos que celebram essa epopeia.</p>
<h2>O ponto de partida</h2>
<p>Foi da praia de Belém que ${lk("vasco-da-gama", "Vasco da Gama")} zarpou, em 1497, para o caminho marítimo da Índia. Os marinheiros velavam armas na ermida ali existente antes de enfrentar o mar — e ao mesmo lugar regressavam os que tinham a fortuna de voltar.</p>
<h2>Pedra da memória</h2>
<p>No sítio dessa ermida ergueu-se o ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")}, joia do ${lk("estilo-manuelino", "manuelino")}; à beira-rio, a ${lk("torre-de-belem", "Torre de Belém")} guardava a entrada do porto; e o ${lk("padrao-dos-descobrimentos", "Padrão dos Descobrimentos")} reúne, em proa de pedra, os heróis da ${lk("era-dos-descobrimentos", "expansão")}. É também aqui que nasceu o ${lk("pastel-de-nata", "pastel de nata")}.</p>
<h2>Porque importa</h2>
<p>Belém é o altar laico dos Descobrimentos — o lugar onde Portugal celebra, em pedra e em água, o momento em que abriu os oceanos do planeta.</p>
`.trim(),
  },
  {
    slug: "estilo-manuelino",
    title: "Estilo Manuelino",
    category: "Arte",
    summary:
      "A arquitectura única que cobriu de mar e de cordas a pedra portugueza.",
    tags: ["arquitectura", "manuelino", "descobrimentos"],
    infobox: [
      { label: "Época", value: "Reinado de D. Manuel I (1495–1521)" },
      { label: "Motivos", value: "Esferas armilares, cordas, seres do mar" },
      {
        label: "Obras-primas",
        value: "Jerónimos, Torre de Belém, Janela de Tomar",
      },
    ],
    sources: [{ label: "Estudos de arte manuelina", url: null }],
    body: `
<p>O manuelino é o estilo arquitectónico que floresceu no reinado de ${lk("d-manuel-i", "D. Manuel I")}, no auge da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Tardo-gótico na estrutura, é único na decoração: traz para a pedra o imaginário do mar e da aventura oceânica.</p>
<h2>A pedra feita mar</h2>
<p>Cordas, nós, âncoras, conchas, corais, plantas exóticas e a ${lk("esfera-armilar", "esfera armilar")} cobrem portais e janelas, como se a arquitectura quisesse contar as viagens. É uma arte de transição, entre o gótico e o Renascimento, e profundamente portugueza.</p>
<h2>As obras maiores</h2>
<p>O ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")} e a ${lk("torre-de-belem", "Torre de Belém")}, em ${lk("belem", "Belém")}, são o seu apogeu. A célebre Janela do Capítulo do ${lk("convento-de-cristo", "Convento de Cristo")}, em Tomar, é a sua página mais delirante de pedra rendilhada.</p>
<h2>Porque importa</h2>
<p>O manuelino é a assinatura artística do momento em que Portugal liderou o mundo. Não há outro estilo igual: é a glória dos Descobrimentos transformada em pedra.</p>
`.trim(),
  },
  {
    slug: "convento-de-cristo",
    title: "Convento de Cristo",
    category: "Lugares",
    summary:
      "A casa dos Templários e da Ordem de Cristo, em Tomar — berço espiritual dos Descobrimentos.",
    tags: ["património", "templários", "manuelino"],
    infobox: [
      { label: "Localização", value: "Tomar" },
      { label: "Origem", value: "Ordem dos Templários (séc. XII)" },
      { label: "Sucessora", value: "Ordem de Cristo" },
      { label: "Património", value: "Mundial (UNESCO)" },
    ],
    sources: [{ label: "História da Ordem de Cristo", url: null }],
    body: `
<p>O Convento de Cristo, em Tomar, foi a sede dos Cavaleiros Templários em Portugal e, depois, da Ordem de Cristo que lhes sucedeu. Das suas rendas e da sua cruz nasceu boa parte do impulso dos Descobrimentos.</p>
<h2>Dos Templários à Ordem de Cristo</h2>
<p>Quando a Ordem do Templo foi extinta na Europa, o rei D. Dinis conseguiu que os seus bens passassem, em Portugal, a uma nova ordem nacional — a Ordem de Cristo. A célebre Charola redonda, igreja-fortaleza dos Templários, é o coração do conjunto.</p>
<h2>A cruz que cruzou o mar</h2>
<p>O ${lk("infante-dom-henrique", "Infante D. Henrique")} foi governador da Ordem, e as suas riquezas financiaram as viagens. A Cruz de Cristo, vermelha, enfunava as velas das naus da ${lk("era-dos-descobrimentos", "expansão")}. A Janela do Capítulo é a obra-prima do ${lk("estilo-manuelino", "manuelino")}.</p>
<h2>Porque importa</h2>
<p>Tomar liga a cavalaria medieval à aventura dos mares: foi com a cruz da Ordem de Cristo ao peito que os portugueses partiram para descobrir o mundo.</p>
`.trim(),
  },
  {
    slug: "esfera-armilar",
    title: "Esfera Armilar",
    category: "Símbolos",
    summary:
      "O instrumento dos astros que se tornou símbolo de Portugal e dos Descobrimentos.",
    tags: ["símbolos", "navegação", "manuelino"],
    infobox: [
      { label: "Função", value: "Modelo astronómico da esfera celeste" },
      { label: "Divisa de", value: "D. Manuel I" },
      { label: "Hoje", value: "Na bandeira de Portugal" },
    ],
    sources: [{ label: "Tratados de astronomia náutica", url: null }],
    body: `
<p>A esfera armilar é um antigo instrumento astronómico, feito de anéis ("armilas") que representam os círculos da esfera celeste. Em Portugal, tornou-se muito mais do que um aparelho: virou símbolo nacional.</p>
<h2>Medir o céu e o mar</h2>
<p>Servia para representar o movimento dos astros e ensinar a posição das estrelas — saber essencial para a navegação astronómica que levou os portugueses ao alto-mar, longe da costa, na ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>De instrumento a emblema</h2>
<p>${lk("d-manuel-i", "D. Manuel I")} adoptou-a como divisa pessoal, e ela espalhou-se pela arquitectura ${lk("estilo-manuelino", "manuelina")} e pelas velas. Hoje, ocupa o centro da ${lk("bandeira-de-portugal", "bandeira de Portugal")}, lembrando a vocação oceânica do país.</p>
<h2>Porque importa</h2>
<p>A esfera armilar é o emblema do génio náutico português — a prova de que, para descobrir o mundo, foi preciso primeiro aprender a ler o céu.</p>
`.trim(),
  },
  {
    slug: "implantacao-da-republica",
    title: "Implantação da República",
    category: "Eventos",
    summary:
      "O 5 de Outubro de 1910 — o fim de oito séculos de monarquia em Portugal.",
    tags: ["século XX", "república", "revolução"],
    infobox: [
      { label: "Data", value: "5 de Outubro de 1910" },
      { label: "Local", value: "Lisboa" },
      { label: "Fim", value: "Monarquia (D. Manuel II)" },
      { label: "Início", value: "Primeira República Portuguesa" },
    ],
    sources: [{ label: "Actas da proclamação da República, 1910", url: null }],
    body: `
<p>A 5 de Outubro de 1910, uma revolução em ${lk("lisboa", "Lisboa")} pôs fim à monarquia em Portugal e proclamou a República. Terminavam quase oito séculos de reis, iniciados com ${lk("dom-afonso-henriques", "D. Afonso Henriques")}.</p>
<h2>O fim da monarquia</h2>
<p>O regime monárquico vinha desgastado pela crise económica, pelo Ultimato inglês de 1890 e pelo regicídio de 1908. Militares e civis republicanos sublevaram-se; após dois dias de combates, o jovem rei D. Manuel II partiu para o exílio.</p>
<h2>Um país novo</h2>
<p>Da varanda da Câmara de Lisboa proclamou-se a República. Adoptaram-se novos símbolos — a ${lk("bandeira-de-portugal", "bandeira")} verde e vermelha e o hino ${lk("a-portuguesa", "<em>A Portuguesa</em>")} — e separou-se o Estado da Igreja. Começava um período turbulento, mas decisivo, da história moderna.</p>
<h2>Porque importa</h2>
<p>O 5 de Outubro fechou o ciclo dos reis e abriu o Portugal contemporâneo. Foi a primeira grande ruptura política do século XX português — antes do ${lk("25-de-abril-de-1974", "25 de Abril")} que, décadas depois, traria a democracia.</p>
`.trim(),
  },
  {
    slug: "antero-de-quental",
    title: "Antero de Quental",
    category: "Pessoas",
    summary:
      "O poeta-pensador da Geração de 70 — a consciência inquieta do seu tempo.",
    tags: ["literatura", "poesia", "século XIX"],
    infobox: [
      { label: "Nascimento", value: "18 de Abril de 1842, Ponta Delgada" },
      { label: "Morte", value: "11 de Setembro de 1891, Ponta Delgada" },
      { label: "Obra", value: "Sonetos Completos" },
    ],
    sources: [{ label: "Sonetos Completos, Antero de Quental", url: null }],
    body: `
<p>Antero de Quental (1842–1891), açoriano, foi o espírito mais inquieto da Geração de 70 — o grupo que quis sacudir o Portugal adormecido do século XIX. Poeta e pensador, fez da dúvida e do ideal a matéria da sua obra.</p>
<h2>A revolta de uma geração</h2>
<p>Foi a alma das Conferências do Casino, em 1871, onde uma nova geração de intelectuais — entre eles ${lk("eca-de-queiroz", "Eça de Queiroz")} — exigiu modernizar o país e a sua cultura. Antero combateu o atraso e a hipocrisia com a força de um manifesto.</p>
<h2>O poeta metafísico</h2>
<p>Os seus <em>Sonetos</em> são dos mais densos da ${lk("lingua-portugueza", "língua portugueza")}: interrogam Deus, o Bem, o Nada e o sentido da existência. Atormentado, pôs fim à própria vida na sua ilha natal, nos Açores.</p>
<h2>Porque importa</h2>
<p>Antero é a consciência filosófica das letras portuguezas — o homem que transformou a angústia de pensar num dos cumes da nossa poesia.</p>
`.trim(),
  },
  {
    slug: "sophia-de-mello-breyner",
    title: "Sophia de Mello Breyner Andresen",
    category: "Pessoas",
    summary:
      "A poetisa do mar e da luz — primeira mulher a receber o Prémio Camões.",
    tags: ["literatura", "poesia", "século XX"],
    infobox: [
      { label: "Nascimento", value: "6 de Novembro de 1919, Porto" },
      { label: "Morte", value: "2 de Julho de 2004, Lisboa" },
      { label: "Prémio Camões", value: "1999 (1.ª mulher)" },
    ],
    sources: [{ label: "Obra Poética, Sophia de Mello Breyner", url: null }],
    body: `
<p>Sophia de Mello Breyner Andresen (1919–2004) é uma das maiores vozes da poesia portugueza do século XX. A sua palavra, clara como água e firme como pedra, fez do mar, da luz e da justiça os seus grandes temas.</p>
<h2>A poesia da claridade</h2>
<p>Contra a obscuridade, Sophia escreveu uma poesia de exactidão e transparência, herdeira dos gregos que amava. O mar do ${lk("porto", "Porto")} e das praias da infância atravessa toda a sua obra como uma presença sagrada.</p>
<h2>A palavra e a cidadania</h2>
<p>Escreveu para crianças contos hoje clássicos, como <em>O Cavaleiro da Dinamarca</em>, e bateu-se pela liberdade contra a ditadura. Foi a primeira mulher a receber o Prémio Camões, o mais alto galardão da ${lk("lingua-portugueza", "língua portugueza")}.</p>
<h2>Porque importa</h2>
<p>Sophia ensinou que a poesia é uma forma de procurar a verdade e a justiça. A sua voz límpida é uma das mais amadas de Portugal — "Esta é a madrugada que eu esperava".</p>
`.trim(),
  },
];

/**
 * Seed: quinta leva de artigos-âncora da Lusopédia (canon rumo aos ~100).
 * Mesmo molde: voz editorial, "Porque importa", interlinks, capas, grafia
 * Portuguez. Idempotente por slug.
 */
export const seedFoundation5 = internalMutation({
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
