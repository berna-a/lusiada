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
    slug: "padre-antonio-vieira",
    title: "Padre António Vieira",
    category: "Pessoas",
    summary:
      "O «imperador da língua portugueza» — pregador, diplomata e defensor dos oprimidos.",
    tags: ["literatura", "religião", "século XVII"],
    infobox: [
      { label: "Nascimento", value: "6 de Fevereiro de 1608, Lisboa" },
      { label: "Morte", value: "18 de Julho de 1697, Baía" },
      { label: "Ordem", value: "Companhia de Jesus" },
      { label: "Obra", value: "Sermões; Cartas" },
    ],
    sources: [{ label: "Sermões, Padre António Vieira", url: null }],
    body: `
<p>O Padre António Vieira (1608–1697) foi o maior prosador da língua portugueza do seu século e uma das suas figuras mais extraordinárias: jesuíta, pregador, diplomata e defensor incansável dos perseguidos.</p>
<h2>O púlpito e a palavra</h2>
<p>Os seus <em>Sermões</em> — como o célebre Sermão de Santo António aos Peixes, em que repreende os homens falando aos peixes — são obras-primas de eloquência e crítica social. ${lk("fernando-pessoa", "Fernando Pessoa")} chamou-lhe o "imperador da ${lk("lingua-portugueza", "língua portugueza")}".</p>
<h2>A defesa dos oprimidos</h2>
<p>No Brasil, bateu-se pelos índios contra a escravatura dos colonos; em Portugal, defendeu os cristãos-novos contra a Inquisição — que o processou. Diplomata ao serviço de D. João IV, sonhou com um "Quinto Império" de paz universal sob língua portugueza.</p>
<h2>Porque importa</h2>
<p>Vieira uniu como ninguém a beleza da palavra à coragem da causa. A sua prosa é um cume da nossa língua, e a sua voz pela justiça atravessa, intacta, mais de três séculos.</p>
`.trim(),
  },
  {
    slug: "gil-vicente",
    title: "Gil Vicente",
    category: "Pessoas",
    summary: "O pai do teatro português — autor dos autos que fundaram a nossa cena.",
    tags: ["literatura", "teatro", "século XVI"],
    infobox: [
      { label: "Nascimento", value: "c. 1465" },
      { label: "Morte", value: "c. 1536" },
      { label: "Obra", value: "Auto da Barca do Inferno; Trilogia das Barcas" },
    ],
    sources: [{ label: "Compilaçam de todalas obras de Gil Vicente, 1562", url: null }],
    body: `
<p>Gil Vicente (c. 1465 – c. 1536) é o fundador do teatro em língua portugueza. Nas cortes de ${lk("d-manuel-i", "D. Manuel I")} e D. João III, escreveu e encenou autos e farsas que misturam o sagrado e o riso, a fé e a sátira.</p>
<h2>O teatro que nasce</h2>
<p>Do <em>Auto da Visitação</em> à <em>Trilogia das Barcas</em>, criou um teatro novo, em verso, povoado de tipos populares — o fidalgo, o sapateiro, a alcoviteira. O <em>Auto da Barca do Inferno</em>, onde as almas são julgadas à beira da morte, é a sua obra mais célebre.</p>
<h2>O espelho e a crítica</h2>
<p>Sob a comédia, Gil Vicente foi um crítico agudo do seu tempo: do clero relaxado, da vaidade dos nobres, da hipocrisia. Escreveu numa ${lk("lingua-portugueza", "língua portugueza")} viva, cheia do falar do povo.</p>
<h2>Porque importa</h2>
<p>Sem Gil Vicente não haveria teatro português. Foi ele quem pôs em cena, pela primeira vez, a alma e a fala de um povo — e o fez rir de si mesmo.</p>
`.trim(),
  },
  {
    slug: "camilo-castelo-branco",
    title: "Camilo Castelo Branco",
    category: "Pessoas",
    summary: "O romancista da paixão e da tragédia — autor de «Amor de Perdição».",
    tags: ["literatura", "romance", "século XIX"],
    infobox: [
      { label: "Nascimento", value: "16 de Março de 1825, Lisboa" },
      { label: "Morte", value: "1 de Junho de 1890, Ceide" },
      { label: "Obra maior", value: "Amor de Perdição" },
    ],
    sources: [{ label: "Amor de Perdição, Camilo Castelo Branco", url: null }],
    body: `
<p>Camilo Castelo Branco (1825–1890) foi o mais fecundo e apaixonado romancista português do século XIX. Escreveu mais de duas centenas de obras e fez da própria vida tormentosa a matéria da sua arte.</p>
<h2>Amor de Perdição</h2>
<p>Escrito, segundo conta, em quinze dias na cadeia da Relação do ${lk("porto", "Porto")} — onde estava preso por adultério —, <em>Amor de Perdição</em> é o grande romance trágico da nossa literatura: a paixão impossível de Simão e Teresa, condenados pela família e pelo destino.</p>
<h2>O génio e a desgraça</h2>
<p>A sua vida foi um romance: paixões, duelos, prisão, a luta com a pobreza e, no fim, a cegueira, que o levou a pôr termo à vida. Rival e contemporâneo de ${lk("eca-de-queiroz", "Eça de Queiroz")}, deu à ${lk("lingua-portugueza", "língua portugueza")} uma prosa de fogo.</p>
<h2>Porque importa</h2>
<p>Camilo é o coração romântico das letras portuguezas — o escritor que transformou o sofrimento em literatura e fez do amor trágico um dos grandes temas nacionais.</p>
`.trim(),
  },
  {
    slug: "pedro-nunes",
    title: "Pedro Nunes",
    category: "Pessoas",
    summary:
      "O maior matemático português — o cérebro científico dos Descobrimentos.",
    tags: ["ciência", "matemática", "navegação"],
    infobox: [
      { label: "Nascimento", value: "1502, Alcácer do Sal" },
      { label: "Morte", value: "11 de Agosto de 1578, Coimbra" },
      { label: "Cargo", value: "Cosmógrafo-mor do Reino" },
      { label: "Invenção", value: "Nónio; teoria da loxodromia" },
    ],
    sources: [{ label: "Tratado da Esfera, Pedro Nunes", url: null }],
    body: `
<p>Pedro Nunes (1502–1578) foi o maior matemático português e um dos maiores da Europa do seu tempo. Cosmógrafo-mor do Reino, deu fundamento científico à arte de navegar que levou Portugal ao mundo.</p>
<h2>A matemática do mar</h2>
<p>Foi o primeiro a compreender a <em>loxodromia</em> — a "linha de rumo" que um navio segue ao manter o mesmo ângulo com os meridianos —, peça-chave da navegação oceânica da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Inventou o <em>nónio</em>, instrumento de medição de grande precisão.</p>
<h2>Mestre e sábio</h2>
<p>Ensinou em ${lk("coimbra", "Coimbra")} e foi mestre dos infantes. As suas obras de cosmografia e álgebra correram a Europa e influenciaram a ciência da navegação durante gerações.</p>
<h2>Porque importa</h2>
<p>Se os pilotos abriram os mares, foi Pedro Nunes quem lhes deu a ciência. Encarna a face sábia dos Descobrimentos — a prova de que a aventura portugueza foi também uma revolução do conhecimento.</p>
`.trim(),
  },
  {
    slug: "diogo-cao",
    title: "Diogo Cão",
    category: "Pessoas",
    summary:
      "O navegador que chegou ao rio Congo e abriu a costa da África Austral.",
    tags: ["navegação", "descobrimentos", "século XV"],
    infobox: [
      { label: "Atividade", value: "Navegador (séc. XV)" },
      { label: "Feito", value: "Descoberta da foz do rio Congo (1482)" },
      { label: "Marcas", value: "Padrões de pedra na costa africana" },
    ],
    sources: [{ label: "Crónicas da expansão portuguesa", url: null }],
    body: `
<p>Diogo Cão foi o navegador que, na década de 1480, levou Portugal mais longe do que nunca pela costa ocidental de África, abrindo o caminho que ${lk("vasco-da-gama", "Vasco da Gama")} viria a completar até à Índia.</p>
<h2>Para lá do desconhecido</h2>
<p>Em duas viagens, descobriu a foz do imenso rio Congo e desceu a costa até ao actual território da Namíbia — milhares de quilómetros de litoral até então ignorado pelos europeus. Foi o auge da exploração lançada pelo ${lk("infante-dom-henrique", "Infante D. Henrique")}.</p>
<h2>Os padrões</h2>
<p>Em cada ponto extremo, Diogo Cão erguia um <em>padrão</em> — uma coluna de pedra com as armas de Portugal e a cruz — a marcar a presença e a posse. Esses marcos inspiram o ${lk("padrao-dos-descobrimentos", "Padrão dos Descobrimentos")} de hoje.</p>
<h2>Porque importa</h2>
<p>Diogo Cão é o elo que faltava entre a costa da Guiné e o Cabo da Boa Esperança. Cada padrão que cravou foi um passo decisivo rumo ao caminho marítimo para o Oriente.</p>
`.trim(),
  },
  {
    slug: "santo-antonio",
    title: "Santo António",
    category: "Pessoas",
    summary:
      "O santo de Lisboa, casamenteiro do povo — Doutor da Igreja e padroeiro popular.",
    tags: ["religião", "Lisboa", "século XIII"],
    infobox: [
      { label: "Nascimento", value: "c. 1195, Lisboa" },
      { label: "Morte", value: "13 de Junho de 1231, Pádua" },
      { label: "Festa", value: "13 de Junho (Santos Populares)" },
      { label: "Título", value: "Doutor da Igreja" },
    ],
    sources: [{ label: "Legenda Assídua (biografia medieval)", url: null }],
    body: `
<p>Santo António (c. 1195–1231), nascido Fernando de Bulhões em ${lk("lisboa", "Lisboa")}, é um dos santos mais amados do mundo católico. Conhecido por Pádua, onde morreu, é de coração e berço lisboeta.</p>
<h2>O pregador</h2>
<p>Frade franciscano, foi um pregador de tal saber e eloquência que a Igreja o fez Doutor — um dos mais jovens da sua história. A lenda atribui-lhe milagres famosos, como o sermão aos peixes que veio a inspirar ${lk("padre-antonio-vieira", "Padre António Vieira")}.</p>
<h2>O santo do povo</h2>
<p>Em Portugal é, sobretudo, o santo casamenteiro e protector dos perdidos. A sua festa, a 13 de Junho, é o auge dos Santos Populares de Lisboa: arraiais, manjericos, sardinha assada e os "casamentos de Santo António".</p>
<h2>Porque importa</h2>
<p>Santo António liga a alta cultura da Igreja ao calor da devoção popular. É, ao mesmo tempo, Doutor universal e o santo da rua, das festas e do coração de Lisboa.</p>
`.trim(),
  },
  {
    slug: "douro",
    title: "Douro",
    category: "Lugares",
    summary:
      "O rio e a região vinhateira mais antiga do mundo — paisagem de socalcos e vinho.",
    tags: ["rio", "vinho", "património"],
    infobox: [
      { label: "Região", value: "Alto Douro Vinhateiro" },
      { label: "Demarcação", value: "1756 (a mais antiga do mundo)" },
      { label: "Património", value: "Mundial (UNESCO)" },
    ],
    sources: [{ label: "Companhia Geral da Agricultura das Vinhas do Alto Douro", url: null }],
    body: `
<p>O Douro é o grande rio do Norte e dá nome a uma das mais belas paisagens de Portugal: o Alto Douro Vinhateiro, onde os homens esculpiram a montanha em socalcos para nela plantar a vinha.</p>
<h2>A região demarcada mais antiga</h2>
<p>Foi aqui que nasceu, por acção do ${lk("marques-de-pombal", "Marquês de Pombal")} em 1756, a primeira região vinícola demarcada e regulamentada do mundo — para proteger a qualidade e o nome do vinho.</p>
<h2>O vinho e o rio</h2>
<p>Das suas encostas nasce o ${lk("vinho-do-porto", "vinho do Porto")}, que outrora descia o rio em barcos rabelos até às caves de Vila Nova de Gaia, junto ao ${lk("porto", "Porto")}. A paisagem de quintas e socalcos é Património Mundial.</p>
<h2>Porque importa</h2>
<p>O Douro é a prova de como o trabalho humano pode criar beleza: uma paisagem inteira moldada à mão, ao longo de séculos, para dar ao mundo um vinho único.</p>
`.trim(),
  },
  {
    slug: "serra-da-estrela",
    title: "Serra da Estrela",
    category: "Lugares",
    summary:
      "O ponto mais alto de Portugal continental — terra de neve, queijo e cão pastor.",
    tags: ["montanha", "natureza", "tradição"],
    infobox: [
      { label: "Ponto mais alto", value: "Torre (1 993 m)" },
      { label: "Origem", value: "Vales de origem glaciar" },
      { label: "Ex-líbris", value: "Queijo Serra da Estrela" },
    ],
    sources: [{ label: "Parque Natural da Serra da Estrela", url: null }],
    body: `
<p>A Serra da Estrela é o maciço mais alto de Portugal continental, culminando na Torre, a 1 993 metros. É a única região do país onde a neve cobre regularmente o inverno e onde se pode esquiar.</p>
<h2>Gelo e pedra</h2>
<p>Modelada por antigos glaciares, a serra guarda vales em forma de U, lagoas e penedos imensos. Dela nascem o Mondego e o Zêzere, dois dos grandes rios do país. É hoje um Parque Natural que protege uma fauna e flora únicas.</p>
<h2>O queijo e o cão</h2>
<p>Das ovelhas que pastam nas suas encostas faz-se o <em>queijo Serra da Estrela</em>, amanteigado e curado a frio, um dos mais célebres de Portugal. E delas guarda o imponente <em>Cão da Serra da Estrela</em>, fiel companheiro dos pastores.</p>
<h2>Porque importa</h2>
<p>A Serra da Estrela é o tecto de Portugal — o lugar onde a natureza é mais áspera e mais grandiosa, e onde o saber dos pastores se faz sabor e tradição.</p>
`.trim(),
  },
  {
    slug: "expo-98",
    title: "Expo 98",
    category: "Eventos",
    summary:
      "A Exposição Mundial de Lisboa que celebrou os oceanos e renovou a cidade.",
    tags: ["século XX", "Lisboa", "oceanos"],
    infobox: [
      { label: "Ano", value: "1998" },
      { label: "Tema", value: "«Os Oceanos: um Património para o Futuro»" },
      { label: "Legado", value: "Parque das Nações; Oceanário" },
    ],
    sources: [{ label: "Relatório oficial da Expo 98", url: null }],
    body: `
<p>A Expo 98 foi a Exposição Mundial realizada em ${lk("lisboa", "Lisboa")} em 1998, no ano em que se assinalavam 500 anos da chegada de ${lk("vasco-da-gama", "Vasco da Gama")} à Índia. Teve como tema os oceanos — a herança maior de Portugal.</p>
<h2>Portugal mostra-se ao mundo</h2>
<p>Durante meses, milhões de visitantes acorreram a um recinto novo, à beira do Tejo. A Expo afirmou um Portugal moderno e europeu, confiante, dez anos depois de ter aderido à Comunidade Europeia.</p>
<h2>Uma cidade nova</h2>
<p>O seu maior legado foi físico: uma zona oriental degradada de Lisboa transformou-se no <em>Parque das Nações</em>, com o <em>Oceanário</em> — um dos maiores do mundo —, a Gare do Oriente e a Ponte Vasco da Gama, então a mais longa da Europa.</p>
<h2>Porque importa</h2>
<p>A Expo 98 foi o grande símbolo do Portugal contemporâneo a olhar o futuro sem esquecer o mar. Renovou uma cidade e deixou ao país uma das suas marcas mais modernas.</p>
`.trim(),
  },
  {
    slug: "fundacao-de-portugal",
    title: "Fundação de Portugal",
    category: "Eventos",
    summary:
      "Como um condado se tornou reino — o nascimento de Portugal no século XII.",
    tags: ["medieval", "fundação", "século XII"],
    infobox: [
      { label: "Condado Portucalense", value: "Doado a D. Henrique de Borgonha" },
      { label: "São Mamede", value: "1128, junto a Guimarães" },
      { label: "Reconhecimento", value: "1143 (Zamora); 1179 (Papa)" },
    ],
    sources: [{ label: "Chronica Gothorum; tratados medievais", url: null }],
    body: `
<p>A fundação de Portugal foi um processo de meio século, no qual um condado dependente do reino de Leão se tornou um reino independente — o mais antigo da Europa com fronteiras quase inalteradas.</p>
<h2>Do condado ao reino</h2>
<p>O Condado Portucalense foi entregue a D. Henrique de Borgonha. Foi o seu filho, ${lk("dom-afonso-henriques", "D. Afonso Henriques")}, quem rompeu com a mãe e com Leão: na Batalha de São Mamede, em 1128, junto a ${lk("guimaraes", "Guimarães")}, impôs-se como senhor da terra.</p>
<h2>Rei pela espada e pela fé</h2>
<p>Após a vitória de Ourique sobre os mouros (1139), Afonso Henriques intitulou-se rei. Castela reconheceu-o no Tratado de Zamora (1143) e o Papa, em 1179, confirmou Portugal como reino — selando a independência.</p>
<h2>Porque importa</h2>
<p>De Guimarães — "aqui nasceu Portugal" — saiu uma nação que dura há quase nove séculos. A fundação é a raiz de tudo: a língua, a fronteira, a identidade que os Descobrimentos levariam ao mundo.</p>
`.trim(),
  },
];

/**
 * Seed: sétima leva de artigos-âncora da Lusopédia (canon rumo aos ~100).
 * Mesmo molde: voz editorial, "Porque importa", interlinks, capas, grafia
 * Portuguez. Idempotente por slug.
 */
export const seedFoundation7 = internalMutation({
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
