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
};

/** Liga interna a outro artigo da Lusopédia. */
function lk(slug: string, text: string) {
  return `<a href="/arca/lusopedia/${slug}">${text}</a>`;
}

const SEEDS: Seed[] = [
  {
    slug: "pedro-alvares-cabral",
    title: "Pedro Álvares Cabral",
    category: "Pessoas",
    summary: "O navegador que aportou ao Brasil em 1500.",
    tags: ["descobrimentos", "navegação", "Brasil"],
    infobox: [
      { label: "Nascimento", value: "c. 1467, Belmonte" },
      { label: "Morte", value: "c. 1520, Santarém" },
      { label: "Feito", value: "Chegada ao Brasil (1500)" },
      { label: "Época", value: "Século XVI" },
    ],
    sources: [
      { label: "Carta de Pero Vaz de Caminha (1500)", url: null },
    ],
    body: `
<p>Pedro Álvares Cabral (c. 1467–1520) comandou a segunda armada portuguesa à Índia e, a 22 de Abril de 1500, aportou às terras a que chamou Vera Cruz — o Brasil. Foi um dos momentos maiores da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>A viagem</h2>
<p>Seguindo a rota aberta por ${lk("vasco-da-gama", "Vasco da Gama")}, a sua frota desviou-se para ocidente e encontrou a costa brasileira, dentro do hemisfério que cabia a Portugal pelo ${lk("tratado-de-tordesilhas", "Tratado de Tordesilhas")}.</p>
<h2>Memória</h2>
<p>A carta de Pero Vaz de Caminha, escrivão da armada, é a "certidão de nascimento" do Brasil e um dos primeiros retratos da nova terra.</p>
`.trim(),
  },
  {
    slug: "dom-joao-ii",
    title: "D. João II",
    category: "Pessoas",
    summary: "O Príncipe Perfeito — o rei que centralizou o poder e impulsionou a expansão.",
    tags: ["descobrimentos", "reis", "expansão"],
    infobox: [
      { label: "Nascimento", value: "3 de Março de 1455, Lisboa" },
      { label: "Morte", value: "25 de Outubro de 1495, Alvor" },
      { label: "Reinado", value: "1481–1495" },
      { label: "Epíteto", value: "O Príncipe Perfeito" },
    ],
    sources: [{ label: "Crónica de D. João II, Rui de Pina", url: null }],
    body: `
<p>D. João II (1455–1495), dito <em>o Príncipe Perfeito</em>, foi um dos maiores reis de Portugal. Quebrou o poder da alta nobreza e devolveu à Coroa a força necessária para conduzir a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>O plano da Índia</h2>
<p>No seu reinado, Bartolomeu Dias dobrou o Cabo da Boa Esperança (1488), abrindo a porta que ${lk("vasco-da-gama", "Vasco da Gama")} viria a atravessar. Foi também ele quem negociou com Castela o ${lk("tratado-de-tordesilhas", "Tratado de Tordesilhas")}.</p>
<h2>Legado</h2>
<p>Visionário e implacável, deixou o país preparado para a era áurea que se seguiria sob D. Manuel I.</p>
`.trim(),
  },
  {
    slug: "nuno-alvares-pereira",
    title: "Nuno Álvares Pereira",
    category: "Pessoas",
    summary: "O Santo Condestável — herói de Aljubarrota e garante da independência.",
    tags: ["batalhas", "independência", "santos"],
    infobox: [
      { label: "Nascimento", value: "24 de Junho de 1360" },
      { label: "Morte", value: "1 de Novembro de 1431, Lisboa" },
      { label: "Título", value: "Condestável do Reino" },
      { label: "Canonização", value: "2009 (São Nuno de Santa Maria)" },
    ],
    sources: [{ label: "Crónica do Condestável", url: null }],
    body: `
<p>Nuno Álvares Pereira (1360–1431) foi o grande general da crise de 1383-1385 e o herói da ${lk("batalha-de-aljubarrota", "Batalha de Aljubarrota")}, que assegurou a ${lk("dom-afonso-henriques", "independência")} de Portugal face a Castela.</p>
<h2>O Condestável</h2>
<p>Estratega genial e homem de fé, comandou as armas de D. João I e nunca perdeu uma batalha. Retirou-se depois para o Carmo, como frade.</p>
<h2>Santo</h2>
<p>Venerado durante séculos, foi canonizado em 2009 como São Nuno de Santa Maria — santo e soldado, raro exemplo de ambas as glórias.</p>
`.trim(),
  },
  {
    slug: "amalia-rodrigues",
    title: "Amália Rodrigues",
    category: "Pessoas",
    summary: "A Rainha do Fado — a voz que levou Portugal ao mundo.",
    tags: ["fado", "música", "século XX"],
    infobox: [
      { label: "Nascimento", value: "1 de Julho de 1920, Lisboa" },
      { label: "Morte", value: "6 de Outubro de 1999, Lisboa" },
      { label: "Arte", value: "Fado" },
      { label: "Repouso", value: "Panteão Nacional" },
    ],
    sources: [{ label: "Arquivo Amália Rodrigues", url: null }],
    body: `
<p>Amália Rodrigues (1920–1999) é a maior intérprete da história do ${lk("fado", "fado")} e uma das vozes portuguesas mais conhecidas no mundo. Deu ao fado dignidade de arte maior.</p>
<h2>A voz da saudade</h2>
<p>Em palcos de todo o mundo, cantou a ${lk("saudade", "saudade")} e o destino, levando a alma portuguesa a línguas e públicos que nunca a tinham ouvido.</p>
<h2>Memória nacional</h2>
<p>À sua morte, em 1999, Portugal decretou luto nacional. Repousa no Panteão Nacional, entre os maiores da pátria.</p>
`.trim(),
  },
  {
    slug: "marques-de-pombal",
    title: "Marquês de Pombal",
    category: "Pessoas",
    summary: "O estadista que reconstruiu Lisboa após o terramoto de 1755.",
    tags: ["Lisboa", "reformas", "século XVIII"],
    infobox: [
      { label: "Nome", value: "Sebastião José de Carvalho e Melo" },
      { label: "Nascimento", value: "13 de Maio de 1699, Lisboa" },
      { label: "Morte", value: "8 de Maio de 1782, Pombal" },
      { label: "Cargo", value: "Secretário de Estado de D. José I" },
    ],
    sources: [{ label: "Arquivo Histórico — Reformas Pombalinas", url: null }],
    body: `
<p>Sebastião José de Carvalho e Melo, Marquês de Pombal (1699–1782), foi o homem forte do reinado de D. José I e o rosto do Iluminismo em Portugal.</p>
<h2>Reconstruir Lisboa</h2>
<p>Após o ${lk("terramoto-de-1755", "Terramoto de 1755")}, dirigiu a reconstrução de ${lk("lisboa", "Lisboa")} com um plano racional e à prova de sismos — a célebre Baixa Pombalina. "Enterrar os mortos e cuidar dos vivos", terá dito.</p>
<h2>Reformas</h2>
<p>Modernizou o ensino, o comércio e o Estado, e expulsou os Jesuítas. Figura controversa, mas decisiva na história moderna do país.</p>
`.trim(),
  },
  {
    slug: "lisboa",
    title: "Lisboa",
    category: "Lugares",
    summary: "A capital de Portugal, cidade do Tejo e das sete colinas.",
    tags: ["cidades", "Lisboa", "capital"],
    infobox: [
      { label: "Estatuto", value: "Capital de Portugal" },
      { label: "Rio", value: "Tejo" },
      { label: "Tradição", value: "Cidade das sete colinas" },
      { label: "Antiguidade", value: "Das mais antigas da Europa" },
    ],
    sources: [{ label: "Câmara Municipal de Lisboa", url: null }],
    body: `
<p>Lisboa, capital de Portugal, ergue-se sobre sete colinas junto à foz do Tejo. É uma das cidades mais antigas da Europa Ocidental, com mais de vinte séculos de história.</p>
<h2>Cidade do mar</h2>
<p>Foi daqui que partiram as naus da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Em Belém guarda dois símbolos maiores: o ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")} e a ${lk("torre-de-belem", "Torre de Belém")}.</p>
<h2>Alma</h2>
<p>Nos seus bairros nasceu o ${lk("fado", "fado")}. Reconstruída após o ${lk("terramoto-de-1755", "terramoto de 1755")}, é hoje uma capital de luz, azulejo e memória.</p>
`.trim(),
  },
  {
    slug: "porto",
    title: "Porto",
    category: "Lugares",
    summary: "A cidade Invicta, no Douro, que deu o nome a Portugal.",
    tags: ["cidades", "Douro", "vinho"],
    infobox: [
      { label: "Rio", value: "Douro" },
      { label: "Alcunha", value: "Cidade Invicta" },
      { label: "Património", value: "Centro histórico (UNESCO, 1996)" },
      { label: "Ex-líbris", value: "Vinho do Porto" },
    ],
    sources: [{ label: "UNESCO — Património Mundial", url: null }],
    body: `
<p>O Porto, segunda cidade de Portugal, debruça-se sobre o Douro. Do antigo <em>Portus Cale</em> veio o próprio nome do país. O seu centro histórico, a Ribeira, é Património Mundial.</p>
<h2>Cidade Invicta</h2>
<p>Ganhou a alcunha de "Invicta" pela resistência no Cerco de 1832. Trabalhadora e orgulhosa, é tida como a cidade que "trabalha" no imaginário nacional.</p>
<h2>O vinho</h2>
<p>Nas caves de Gaia repousa o Vinho do Porto, néctar exportado há séculos e um dos grandes embaixadores da ${lk("lingua-portuguesa", "cultura portuguesa")} no mundo.</p>
`.trim(),
  },
  {
    slug: "coimbra",
    title: "Coimbra",
    category: "Lugares",
    summary: "A cidade do saber, com a mais antiga universidade portuguesa.",
    tags: ["cidades", "universidade", "fado"],
    infobox: [
      { label: "Rio", value: "Mondego" },
      { label: "Universidade", value: "Fundada em 1290" },
      { label: "Património", value: "Universidade (UNESCO, 2013)" },
      { label: "Tradição", value: "Fado de Coimbra" },
    ],
    sources: [{ label: "Universidade de Coimbra", url: null }],
    body: `
<p>Coimbra, à beira do Mondego, foi primeira capital do reino e é, há mais de sete séculos, a cidade do saber. A sua Universidade, fundada em 1290, é das mais antigas do mundo.</p>
<h2>A Alta e a tradição</h2>
<p>A Universidade, com a sua Biblioteca Joanina, é Património Mundial. Das suas repúblicas e capas negras nasceu o ${lk("fado", "fado de Coimbra")}, cantado por homens, à guitarra.</p>
<h2>Berço de reis</h2>
<p>Aqui nasceram vários reis e firmou-se a ${lk("lingua-portuguesa", "língua portuguesa")} como língua de cultura e de ciência.</p>
`.trim(),
  },
  {
    slug: "torre-de-belem",
    title: "Torre de Belém",
    category: "Lugares",
    summary: "A sentinela manuelina do Tejo, ex-líbris de Lisboa.",
    tags: ["manuelino", "Lisboa", "monumento", "descobrimentos"],
    infobox: [
      { label: "Local", value: "Belém, Lisboa" },
      { label: "Construção", value: "1514–1519" },
      { label: "Arquiteto", value: "Francisco de Arruda" },
      { label: "UNESCO", value: "Património Mundial (1983)" },
    ],
    sources: [{ label: "UNESCO — Património Mundial", url: null }],
    body: `
<p>A Torre de Belém, erguida entre 1514 e 1519, guardava a entrada do Tejo e saudava as naus que partiam para o mundo. É um dos ex-líbris de ${lk("lisboa", "Lisboa")} e de Portugal.</p>
<h2>Joia manuelina</h2>
<p>Obra-prima do estilo manuelino, irmã do ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")}, ostenta cordas, escudos e a esfera armilar — símbolos da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>Símbolo</h2>
<p>Classificada Património Mundial em 1983, é hoje uma das imagens mais reconhecíveis do país.</p>
`.trim(),
  },
  {
    slug: "batalha-de-aljubarrota",
    title: "Batalha de Aljubarrota",
    category: "Eventos",
    summary: "A vitória de 1385 que garantiu a independência de Portugal.",
    tags: ["batalhas", "independência", "1385"],
    infobox: [
      { label: "Data", value: "14 de Agosto de 1385" },
      { label: "Contendores", value: "Portugal vs Castela" },
      { label: "Comando", value: "D. João I e Nuno Álvares Pereira" },
      { label: "Memória", value: "Mosteiro da Batalha" },
    ],
    sources: [{ label: "Crónica de D. João I, Fernão Lopes", url: null }],
    body: `
<p>A Batalha de Aljubarrota, a 14 de Agosto de 1385, opôs Portugal a Castela e selou a crise de sucessão de 1383-85. A vitória portuguesa garantiu a ${lk("dom-afonso-henriques", "independência")} do reino por mais dois séculos.</p>
<h2>O génio do Condestável</h2>
<p>O exército português, em clara inferioridade, venceu graças à táctica de ${lk("nuno-alvares-pereira", "Nuno Álvares Pereira")} e à coragem dos homens de D. João I.</p>
<h2>Memória</h2>
<p>Em agradecimento, ergueu-se o Mosteiro da Batalha, panteão da dinastia de Avis e monumento à liberdade nacional.</p>
`.trim(),
  },
  {
    slug: "terramoto-de-1755",
    title: "Terramoto de 1755",
    category: "Eventos",
    summary: "O grande sismo que destruiu Lisboa e abalou a Europa.",
    tags: ["Lisboa", "catástrofe", "século XVIII"],
    infobox: [
      { label: "Data", value: "1 de Novembro de 1755" },
      { label: "Efeitos", value: "Sismo, maremoto e incêndio" },
      { label: "Cidade", value: "Lisboa" },
      { label: "Reconstrução", value: "Marquês de Pombal" },
    ],
    sources: [{ label: "Relatos do Terramoto de 1755", url: null }],
    body: `
<p>Na manhã de 1 de Novembro de 1755, dia de Todos-os-Santos, um violento terramoto seguido de maremoto e incêndio destruiu ${lk("lisboa", "Lisboa")}. Foi uma das maiores catástrofes da história europeia.</p>
<h2>Abalo do mundo</h2>
<p>A tragédia chocou a Europa e marcou o pensamento iluminista, levando filósofos como Voltaire a interrogar-se sobre o sentido do mal e da Providência.</p>
<h2>Renascer</h2>
<p>A reconstrução, dirigida pelo ${lk("marques-de-pombal", "Marquês de Pombal")}, deu origem à Baixa Pombalina, pioneira da engenharia antissísmica.</p>
`.trim(),
  },
  {
    slug: "25-de-abril-de-1974",
    title: "25 de Abril de 1974",
    category: "Eventos",
    summary: "A Revolução dos Cravos, que devolveu a liberdade a Portugal.",
    tags: ["liberdade", "século XX", "Lisboa"],
    infobox: [
      { label: "Data", value: "25 de Abril de 1974" },
      { label: "Autores", value: "Movimento das Forças Armadas" },
      { label: "Símbolo", value: "Cravo vermelho" },
      { label: "Feriado", value: "Dia da Liberdade" },
    ],
    sources: [{ label: "Arquivo do 25 de Abril", url: null }],
    body: `
<p>A 25 de Abril de 1974, o Movimento das Forças Armadas pôs fim a quase meio século de regime autoritário, numa revolução quase sem sangue que ficou conhecida como a Revolução dos Cravos.</p>
<h2>A madrugada</h2>
<p>A canção "Grândola, Vila Morena" foi o sinal para o avanço. Nas ruas de ${lk("lisboa", "Lisboa")}, o povo recebeu os militares com cravos vermelhos nos canos das espingardas.</p>
<h2>Liberdade</h2>
<p>Abriu caminho à democracia e à descolonização. O 25 de Abril é hoje celebrado como o Dia da Liberdade.</p>
`.trim(),
  },
  {
    slug: "mensagem",
    title: "Mensagem",
    category: "Obras",
    summary: "O único livro que Pessoa publicou em vida — a epopeia do espírito português.",
    tags: ["poesia", "literatura", "Pessoa"],
    infobox: [
      { label: "Autor", value: "Fernando Pessoa" },
      { label: "Publicação", value: "1934" },
      { label: "Estrutura", value: "Três partes, 44 poemas" },
      { label: "Tema", value: "Mito e destino de Portugal" },
    ],
    sources: [{ label: "Mensagem (1934)", url: null }],
    body: `
<p><em>Mensagem</em> (1934) é o único livro que ${lk("fernando-pessoa", "Fernando Pessoa")} publicou em português durante a vida. Em 44 poemas, relê o passado de Portugal como mito e profecia.</p>
<h2>Mar Português</h2>
<p>Onde ${lk("os-lusiadas", "Os Lusíadas")} cantam a gesta concreta da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}, <em>Mensagem</em> canta o seu sentido espiritual — "Valeu a pena? Tudo vale a pena / Se a alma não é pequena."</p>
<h2>O Encoberto</h2>
<p>A obra anuncia um Quinto Império feito de cultura e de espírito, prolongando o sonho português para o futuro.</p>
`.trim(),
  },
  {
    slug: "lusofonia",
    title: "Lusofonia",
    category: "Conceitos",
    summary: "A comunidade dos povos e culturas de língua portuguesa.",
    tags: ["lusofonia", "língua", "CPLP"],
    infobox: [
      { label: "Significado", value: "Mundo de língua portuguesa" },
      { label: "Continentes", value: "Quatro" },
      { label: "Organização", value: "CPLP (fundada em 1996)" },
    ],
    sources: [{ label: "Comunidade dos Países de Língua Portuguesa", url: null }],
    body: `
<p>Lusofonia é o nome dado ao conjunto dos povos, países e culturas que partilham a ${lk("lingua-portuguesa", "língua portuguesa")}. Liga, num mesmo idioma, gentes de quatro continentes.</p>
<h2>Uma comunidade</h2>
<p>A Comunidade dos Países de Língua Portuguesa (CPLP), fundada em 1996, reúne nações da Europa, África, América e Ásia em torno de uma herança comum.</p>
<h2>Raiz histórica</h2>
<p>É fruto da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}, que levou a língua e a cultura portuguesas pelo mundo, e mantém-se viva na criação literária, musical e humana de todos esses povos.</p>
`.trim(),
  },
  {
    slug: "azulejo",
    title: "Azulejo",
    category: "Conceitos",
    summary: "A arte da cerâmica vidrada que reveste a memória de Portugal.",
    tags: ["arte", "Lisboa", "manuelino"],
    infobox: [
      { label: "Origem do nome", value: "Árabe az-zulayj" },
      { label: "Material", value: "Cerâmica vidrada" },
      { label: "Apogeu", value: "Séculos XVII–XVIII" },
    ],
    sources: [{ label: "Museu Nacional do Azulejo", url: null }],
    body: `
<p>O azulejo é uma das expressões mais originais da arte portuguesa: placas de cerâmica vidrada que revestem igrejas, palácios, estações e fachadas. O nome vem do árabe <em>az-zulayj</em>.</p>
<h2>Uma arte nacional</h2>
<p>De herança mourisca, ganhou em Portugal vida própria. Nos painéis azuis e brancos contam-se batalhas, santos e cenas do quotidiano — uma autêntica narrativa em parede.</p>
<h2>Cidade revestida</h2>
<p>Em ${lk("lisboa", "Lisboa")} e por todo o país, o azulejo dá cor e luz às ruas, sendo hoje um dos traços mais reconhecíveis da paisagem portuguesa.</p>
`.trim(),
  },
];

/**
 * Seed: segunda leva de artigos-âncora da Lusopédia (publicados e
 * interligados com a primeira leva). Idempotente — atualiza pelo slug.
 */
export const seedFoundation2 = internalMutation({
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
