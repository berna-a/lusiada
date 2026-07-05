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
    slug: "fatima",
    title: "Fátima",
    category: "Lugares",
    summary:
      "O santuário das aparições de 1917 — um dos maiores centros de peregrinação do mundo católico.",
    tags: ["religião", "santuário", "século XX"],
    infobox: [
      { label: "Localização", value: "Ourém, Santarém" },
      { label: "Aparições", value: "13 de Maio a 13 de Outubro de 1917" },
      { label: "Videntes", value: "Lúcia, Francisco e Jacinta" },
      { label: "Peregrinação maior", value: "13 de Maio e 13 de Outubro" },
    ],
    sources: [{ label: "Memórias da Irmã Lúcia", url: null }],
    body: `
<p>Fátima é o maior santuário mariano portuguez e um dos centros de peregrinação mais visitados do mundo. Numa terra pobre do centro do país, em 1917, três crianças pastoras disseram ter visto a Virgem Maria — e mudaram para sempre a geografia religiosa de Portugal.</p>
<h2>As aparições de 1917</h2>
<p>Entre Maio e Outubro de 1917, em plena Grande Guerra, Lúcia de Jesus e os primos Francisco e Jacinta Marto afirmaram que uma "Senhora vestida de branco" lhes aparecia na Cova da Iria, no dia 13 de cada mês. A 13 de Outubro, perante uma multidão de dezenas de milhares, deu-se o episódio que ficou conhecido como o "milagre do Sol".</p>
<h2>O santuário</h2>
<p>No local ergueu-se um dos maiores espaços de culto do mundo: a Basílica de Nossa Senhora do Rosário, a imensa praça de oração e, mais tarde, a moderna Basílica da Santíssima Trindade. A 13 de Maio e a 13 de Outubro, centenas de milhares de peregrinos convergem a pé de todo o país.</p>
<h2>Porque importa</h2>
<p>Fátima projectou o nome de Portugal no imaginário católico mundial e tornou-se um traço fundo da identidade popular portugueza. Para crentes ou não, é o lugar onde a fé de um povo se faz multidão e caminho.</p>
`.trim(),
  },
  {
    slug: "pastel-de-nata",
    title: "Pastel de Nata",
    category: "Gastronomia",
    summary:
      "O doce que nasceu num mosteiro e conquistou o mundo — a mais famosa receita da doçaria portugueza.",
    tags: ["gastronomia", "doçaria", "Belém"],
    infobox: [
      { label: "Origem", value: "Mosteiro dos Jerónimos, Belém" },
      { label: "Primeira venda", value: "1837, Pastéis de Belém" },
      { label: "Tipo", value: "Doce de massa folhada e creme de ovos" },
    ],
    sources: [{ label: "Fábrica dos Pastéis de Belém — história", url: null }],
    body: `
<p>O pastel de nata é o mais célebre doce portuguez: um cesto de massa folhada estaladiça com um creme de ovos queimado no forno. Simples na aparência, é uma obra de equilíbrio entre o doce, a baunilha e a casca tostada.</p>
<h2>Do convento à rua</h2>
<p>A sua origem está na doçaria conventual, onde se usavam claras para engomar os hábitos e gemas para os doces. Junto ao ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")}, em Belém, os monges faziam estes pastéis. Com a extinção das ordens religiosas, a receita passou em 1837 para uma loja vizinha — a Fábrica dos Pastéis de Belém —, que ainda hoje guarda a fórmula original em segredo.</p>
<h2>Um doce mundial</h2>
<p>Saído de Belém com o nome genérico de "pastel de nata", tornou-se um fenómeno global: vende-se hoje de Lisboa a Tóquio e é, para muitos estrangeiros, o primeiro contacto com Portugal. A sua presença na diáspora é uma das marcas mais doces da ${lk("lusofonia", "lusofonia")}.</p>
<h2>Porque importa</h2>
<p>O pastel de nata mostra como um pequeno gesto — o aproveitamento das gemas num convento de ${lk("lisboa", "Lisboa")} — pode tornar-se embaixador de uma cultura. É a gastronomia feita identidade, levada ao mundo num guardanapo de papel.</p>
`.trim(),
  },
  {
    slug: "jose-saramago",
    title: "José Saramago",
    category: "Pessoas",
    summary:
      "O único Prémio Nobel da Literatura em língua portugueza nascido em Portugal.",
    tags: ["literatura", "Nobel", "século XX"],
    infobox: [
      { label: "Nascimento", value: "16 de Novembro de 1922, Azinhaga" },
      { label: "Morte", value: "18 de Junho de 2010, Lanzarote" },
      { label: "Nobel", value: "Literatura, 1998" },
      {
        label: "Obras",
        value: "Memorial do Convento, Ensaio sobre a Cegueira",
      },
    ],
    sources: [{ label: "Discurso Nobel de José Saramago, 1998", url: null }],
    body: `
<p>José Saramago (1922–2010) é o único escritor de língua portugueza nascido em Portugal a receber o Prémio Nobel da Literatura, em 1998. Filho de camponeses sem terra do Ribatejo, fez-se escritor tarde e tornou-se uma das vozes mais universais da ${lk("lingua-portugueza", "língua portugueza")}.</p>
<h2>Uma voz própria</h2>
<p>A sua prosa é inconfundível: frases longas e torrenciais, diálogos sem travessões, uma pontuação que obriga a ler como quem ouve. Em <em>Memorial do Convento</em>, <em>O Ano da Morte de Ricardo Reis</em> — diálogo com ${lk("fernando-pessoa", "Fernando Pessoa")} — ou <em>Ensaio sobre a Cegueira</em>, juntou imaginação e crítica social como poucos.</p>
<h2>O homem e a polémica</h2>
<p>Comunista convicto e ateu, foi figura controversa. <em>O Evangelho Segundo Jesus Cristo</em> levou-o, em protesto contra a censura política da obra, a exilar-se na ilha de Lanzarote, onde viveu até à morte. Nunca deixou de incomodar — era esse, dizia, o ofício do escritor.</p>
<h2>Porque importa</h2>
<p>Saramago provou ao mundo que a ${lk("lingua-portugueza", "língua portugueza")} podia ganhar o maior prémio das letras. Levou o nome de Portugal ao topo da literatura mundial e deixou uma obra que continua a interrogar a consciência dos leitores.</p>
`.trim(),
  },
  {
    slug: "madeira",
    title: "Madeira",
    category: "Lugares",
    summary:
      "A ilha atlântica descoberta no início dos Descobrimentos — pérola de clima ameno e vinho célebre.",
    tags: ["arquipélago", "Atlântico", "descobrimentos"],
    infobox: [
      { label: "Descoberta", value: "1419, por João Gonçalves Zarco" },
      { label: "Capital", value: "Funchal" },
      { label: "Património", value: "Floresta Laurissilva (UNESCO)" },
    ],
    sources: [{ label: "Crónica do Descobrimento da Madeira", url: null }],
    body: `
<p>O arquipélago da Madeira, no Atlântico a sudoeste de Portugal continental, foi uma das primeiras conquistas da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Descoberto por volta de 1419, foi o laboratório onde Portugal aprendeu a povoar e cultivar ilhas atlânticas.</p>
<h2>A primeira ilha</h2>
<p>Sob o impulso do ${lk("infante-dom-henrique", "Infante D. Henrique")}, os capitães João Gonçalves Zarco e Tristão Vaz Teixeira aportaram a uma ilha coberta de mata densa — daí o nome "Madeira". O povoamento, a cana-de-açúcar e, mais tarde, a vinha fizeram a sua riqueza.</p>
<h2>Vinho, levadas e laurissilva</h2>
<p>O vinho da Madeira tornou-se um produto de luxo nas cortes da Europa e da América. No interior, as <em>levadas</em> — canais de água escavados na rocha — irrigam socalcos e hoje percorrem-se a pé. A Floresta Laurissilva, relíquia de uma vegetação que cobria a Europa há milhões de anos, é Património Mundial.</p>
<h2>Porque importa</h2>
<p>A Madeira foi o primeiro ensaio do génio insular portuguez — o de transformar uma rocha no meio do oceano em jardim habitado. É também o berço de figuras que o mundo conhece, e um cartão de visita atlântico de Portugal.</p>
`.trim(),
  },
  {
    slug: "acores",
    title: "Açores",
    category: "Lugares",
    summary:
      "O arquipélago de nove ilhas vulcânicas no meio do Atlântico — a fronteira ocidental da Europa.",
    tags: ["arquipélago", "Atlântico", "vulcões"],
    infobox: [
      { label: "Ilhas", value: "Nove, em três grupos" },
      { label: "Descoberta", value: "Século XV" },
      { label: "Ponto mais alto", value: "Montanha do Pico (2 351 m)" },
    ],
    sources: [{ label: "Saudades da Terra, Gaspar Frutuoso", url: null }],
    body: `
<p>Os Açores são um arquipélago de nove ilhas vulcânicas a meio caminho entre a Europa e a América. Constituem o ponto mais ocidental de Portugal e da Europa, e foram durante séculos a escala obrigatória das frotas que cruzavam o Atlântico.</p>
<h2>Ilhas do meio do mar</h2>
<p>Descobertos e povoados ao longo do século XV, no âmbito da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}, os Açores eram a última paragem das naus da Índia e do Brasil antes de chegarem a ${lk("lisboa", "Lisboa")}. Pela sua posição, tornaram-se peça estratégica das rotas atlânticas.</p>
<h2>Fogo e mar</h2>
<p>Lagoas de cratera como a das Sete Cidades, fumarolas, a imponente Montanha do Pico e um oceano cheio de baleias e cachalotes desenham uma paisagem única. A antiga caça à baleia deu lugar, hoje, à sua observação.</p>
<h2>Porque importa</h2>
<p>Os Açores são a sentinela atlântica de Portugal — fronteira da Europa virada para o Novo Mundo. A sua história é a da própria vocação oceânica portugueza, feita de isolamento, resistência e mar sem fim.</p>
`.trim(),
  },
  {
    slug: "aristides-de-sousa-mendes",
    title: "Aristides de Sousa Mendes",
    category: "Pessoas",
    summary:
      "O cônsul que desobedeceu para salvar milhares de refugiados da perseguição nazi.",
    tags: ["século XX", "Justo entre as Nações", "II Guerra Mundial"],
    infobox: [
      { label: "Nascimento", value: "19 de Julho de 1885, Cabanas de Viriato" },
      { label: "Morte", value: "3 de Abril de 1954, Lisboa" },
      { label: "Acto", value: "Vistos em Bordéus, 1940" },
      { label: "Reconhecimento", value: "Justo entre as Nações (Yad Vashem)" },
    ],
    sources: [
      { label: "Arquivos do Ministério dos Negócios Estrangeiros", url: null },
    ],
    body: `
<p>Aristides de Sousa Mendes (1885–1954) foi um diplomata portuguez que, em Junho de 1940, desobedeceu às ordens do seu governo para salvar milhares de pessoas em fuga do avanço nazi. Pagou caro o gesto — e só décadas depois foi reconhecido como herói.</p>
<h2>A decisão de Bordéus</h2>
<p>Cônsul de Portugal em Bordéus quando a França caiu, viu-se rodeado por multidões de refugiados, muitos deles judeus, desesperados por um visto que lhes permitisse atravessar Portugal rumo à liberdade. Contra as instruções expressas de Salazar, decidiu assiná-los a todos: "Não posso deixar morrer tanta gente."</p>
<h2>O preço e a glória</h2>
<p>Durante dias, assinou vistos sem descanso. O regime puniu-o: foi expulso da diplomacia e morreu na pobreza e no esquecimento. Só muito mais tarde a sua coragem foi reconhecida — em Israel, como <em>Justo entre as Nações</em>, e em Portugal, com honras nacionais.</p>
<h2>Porque importa</h2>
<p>Sousa Mendes encarna a mais alta virtude cívica: a coragem de desobedecer a uma ordem injusta. Numa hora de medo, escolheu a consciência — e a sua acção salvou um número de vidas que poucos homens alguma vez salvaram.</p>
`.trim(),
  },
  {
    slug: "almeida-garrett",
    title: "Almeida Garrett",
    category: "Pessoas",
    summary:
      "O pai do Romantismo portuguez e do teatro nacional — escritor e político liberal.",
    tags: ["literatura", "romantismo", "século XIX"],
    infobox: [
      { label: "Nascimento", value: "4 de Fevereiro de 1799, Porto" },
      { label: "Morte", value: "9 de Dezembro de 1854, Lisboa" },
      { label: "Obras", value: "Frei Luís de Sousa, Viagens na Minha Terra" },
    ],
    sources: [{ label: "Viagens na Minha Terra, Almeida Garrett", url: null }],
    body: `
<p>João Baptista da Silva Leitão de Almeida Garrett (1799–1854) foi o introdutor do Romantismo em Portugal e o fundador do teatro nacional moderno. Escritor e político, juntou a pena à acção na luta pelo liberalismo.</p>
<h2>O escritor</h2>
<p>Exilado por causa das suas ideias liberais, regressou para renovar a literatura portugueza. Em <em>Viagens na Minha Terra</em> inventou uma prosa moderna, irónica e digressiva; em <em>Frei Luís de Sousa</em> deu ao teatro a sua maior tragédia; e em <em>Folhas Caídas</em> escreveu alguns dos versos de amor mais belos da ${lk("lingua-portugueza", "língua portugueza")}.</p>
<h2>O político</h2>
<p>Combateu pela causa liberal, foi deputado e ministro, e fundou o Conservatório e o Teatro Nacional, em ${lk("lisboa", "Lisboa")}. Acreditava que uma nação se constrói também pela cultura e pela educação do gosto.</p>
<h2>Porque importa</h2>
<p>Garrett deu a Portugal uma literatura moderna e um teatro próprio, virando a sua arte para a alma e a história do povo. É a ponte entre o classicismo e o Portugal contemporâneo das letras.</p>
`.trim(),
  },
  {
    slug: "bandeira-de-portugal",
    title: "Bandeira de Portugal",
    category: "Símbolos",
    summary:
      "Verde e vermelho, com a esfera armilar e o escudo — o emblema da nação portugueza.",
    tags: ["símbolos", "heráldica", "república"],
    infobox: [
      { label: "Adoptada", value: "30 de Junho de 1911" },
      { label: "Cores", value: "Verde e vermelho" },
      { label: "Elementos", value: "Esfera armilar e escudo nacional" },
    ],
    sources: [{ label: "Diário do Governo, 1911", url: null }],
    body: `
<p>A bandeira de Portugal, adoptada em 1911 após a implantação da República, é uma das mais carregadas de símbolos do mundo. Dois campos — verde e vermelho — sustentam, no centro, a esfera armilar e o escudo nacional.</p>
<h2>Um escudo com séculos</h2>
<p>O escudo branco com as cinco quinas azuis remonta aos primeiros reis e à fundação do reino por ${lk("dom-afonso-henriques", "D. Afonso Henriques")}; os sete castelos da bordadura recordam as praças conquistadas. É a memória mais antiga da nação, gravada no pano.</p>
<h2>A esfera dos mares</h2>
<p>Sobre o escudo pousa a esfera armilar — instrumento de navegação que foi divisa de ${lk("d-manuel-i", "D. Manuel I")} e símbolo maior da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Lembra que Portugal foi o país que ensinou o mundo a medir os céus e os mares.</p>
<h2>Porque importa</h2>
<p>Poucas bandeiras contam tanta história num só olhar: a fundação, a fé, a expansão e a República. Hasteá-la é desfraldar oito séculos de memória portugueza.</p>
`.trim(),
  },
  {
    slug: "a-portuguesa",
    title: "A Portuguesa",
    category: "Símbolos",
    summary:
      "O hino nacional — canção de revolta nascida do Ultimato inglês de 1890.",
    tags: ["símbolos", "hino", "século XIX"],
    infobox: [
      { label: "Letra", value: "Henrique Lopes de Mendonça" },
      { label: "Música", value: "Alfredo Keil" },
      { label: "Composição", value: "1890" },
      { label: "Hino oficial", value: "Desde 1911" },
    ],
    sources: [{ label: "Partitura original de Alfredo Keil, 1890", url: null }],
    body: `
<p><em>A Portuguesa</em> é o hino nacional de Portugal. Nasceu como canção de protesto, em 1890, da indignação de um país humilhado — e tornou-se o canto de afirmação de toda a nação.</p>
<h2>Do Ultimato à revolta</h2>
<p>Em 1890, a Inglaterra impôs a Portugal o chamado Ultimato, obrigando-o a recuar nas suas pretensões em África. A onda de indignação patriótica inspirou Henrique Lopes de Mendonça a escrever a letra e Alfredo Keil a compor a música. O refrão — "Às armas, às armas!" — fez da canção um grito.</p>
<h2>De canção a hino</h2>
<p>Adoptada pelos republicanos, <em>A Portuguesa</em> tornou-se hino oficial com a Implantação da República, em 1911. O verso inicial — "Heróis do mar, nobre povo" — invoca a memória da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} para chamar o presente à grandeza.</p>
<h2>Porque importa</h2>
<p>Mais do que uma melodia oficial, <em>A Portuguesa</em> guarda a memória de um povo que respondeu à humilhação com orgulho. Cantá-la é convocar os "heróis do mar" para cada hora difícil da nação.</p>
`.trim(),
  },
  {
    slug: "mosteiro-da-batalha",
    title: "Mosteiro da Batalha",
    category: "Lugares",
    summary:
      "O monumento gótico erguido em cumprimento de um voto pela vitória de Aljubarrota.",
    tags: ["património", "gótico", "manuelino"],
    infobox: [
      { label: "Fundação", value: "1386, por D. João I" },
      { label: "Motivo", value: "Voto pela vitória de Aljubarrota" },
      { label: "Estilo", value: "Gótico e manuelino" },
      { label: "Património", value: "Mundial (UNESCO)" },
    ],
    sources: [{ label: "Crónica de D. João I, Fernão Lopes", url: null }],
    body: `
<p>O Mosteiro de Santa Maria da Vitória, dito da Batalha, é uma das obras-primas do gótico europeu. Foi erguido em cumprimento de um voto: o de D. João I, que prometera um templo a Nossa Senhora se vencesse Castela.</p>
<h2>Um voto cumprido</h2>
<p>A vitória chegou na ${lk("batalha-de-aljubarrota", "Batalha de Aljubarrota")}, em 1385, com a Coroa de Portugal salva da união com Castela e o génio militar de ${lk("nuno-alvares-pereira", "Nuno Álvares Pereira")}. Em agradecimento, o rei mandou erguer, ali perto, o grande mosteiro, obra de mais de um século.</p>
<h2>Pedra rendilhada</h2>
<p>Na Capela do Fundador repousam D. João I e a rainha Filipa de Lença, e, junto deles, os seus filhos — a "Ínclita Geração" que lançou os ${lk("era-dos-descobrimentos", "Descobrimentos")}. As Capelas Imperfeitas, deixadas sem tecto, são um dos mais belos inacabados da arquitectura portugueza.</p>
<h2>Porque importa</h2>
<p>A Batalha é a pedra onde Portugal celebrou a sua independência reconquistada. Cada arco rendilhado é memória de uma nação que, salva em campo de guerra, agradeceu construindo beleza.</p>
`.trim(),
  },
];

/**
 * Seed: quarta leva de artigos-âncora da Lusopédia (canon rumo aos ~100).
 * Mesmo molde: voz editorial, "Porque importa", interlinks, capas, grafia
 * Portuguez. Idempotente por slug.
 */
export const seedFoundation4 = internalMutation({
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
