import { v } from "convex/values";
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
    slug: "dom-afonso-henriques",
    title: "D. Afonso Henriques",
    category: "Pessoas",
    summary:
      "O Conquistador — primeiro Rei de Portugal e fundador da nação.",
    tags: ["fundação", "reis", "independência"],
    infobox: [
      { label: "Nascimento", value: "c. 1109, Guimarães" },
      { label: "Morte", value: "6 de Dezembro de 1185, Coimbra" },
      { label: "Reinado", value: "1139–1185" },
      { label: "Título", value: "Primeiro Rei de Portugal" },
    ],
    sources: [
      { label: "Crónica de Portugal de 1419", url: null },
      { label: "Tratado de Zamora (1143)", url: null },
    ],
    body: `
<p>Afonso Henriques (c. 1109–1185), dito <em>o Conquistador</em>, foi o primeiro Rei de Portugal e o fundador da nação. Filho do conde D. Henrique de Borgonha e de D. Teresa de Leão, transformou o Condado Portucalense num reino independente.</p>
<h2>A independência</h2>
<p>Em 1128, na Batalha de São Mamede, venceu as forças da mãe e firmou o seu poder. A vitória sobre os mouros na Batalha de Ourique, em 1139, deu-lhe o título de rei. Pelo Tratado de Zamora, em 1143, o reino de Leão reconheceu Portugal, e em 1179 a Santa Sé confirmou a sua soberania.</p>
<h2>Legado</h2>
<p>A conquista de Lisboa, em 1147, com o auxílio de cruzados, alargou o reino para sul e abriu o caminho que, séculos depois, levaria à ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Afonso Henriques é, na memória portugueza, o pai da pátria.</p>
`.trim(),
  },
  {
    slug: "infante-dom-henrique",
    title: "Infante D. Henrique",
    category: "Pessoas",
    summary:
      "O Navegador — o príncipe que lançou Portugal ao mar e iniciou a expansão.",
    tags: ["descobrimentos", "navegação", "Sagres"],
    infobox: [
      { label: "Nascimento", value: "4 de Março de 1394, Porto" },
      { label: "Morte", value: "13 de Novembro de 1460, Sagres" },
      { label: "Epíteto", value: "O Navegador" },
      { label: "Época", value: "Século XV" },
    ],
    sources: [
      { label: "Crónica de Guiné, Gomes Eanes de Zurara", url: null },
    ],
    body: `
<p>O Infante D. Henrique (1394–1460), filho do rei D. João I, é a figura tutelar do início da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Em torno da sua corte, em Sagres, reuniu pilotos, cartógrafos e construtores que aperfeiçoaram a arte de navegar.</p>
<h2>A conquista de Ceuta</h2>
<p>A tomada de Ceuta, em 1415, marcou o primeiro passo da expansão portugueza em África. A partir daí, o Infante patrocinou viagens sucessivas pela costa africana.</p>
<h2>O impulso atlântico</h2>
<p>Sob o seu patrocínio, os portuguezes povoaram a Madeira e os Açores e dobraram o Cabo Bojador (1434), vencendo o medo do "mar tenebroso". Abriu assim a rota que ${lk("vasco-da-gama", "Vasco da Gama")} havia de completar até à Índia.</p>
`.trim(),
  },
  {
    slug: "vasco-da-gama",
    title: "Vasco da Gama",
    category: "Pessoas",
    summary:
      "O navegador que abriu o caminho marítimo para a Índia em 1498.",
    tags: ["descobrimentos", "Índia", "navegação"],
    infobox: [
      { label: "Nascimento", value: "c. 1469, Sines" },
      { label: "Morte", value: "24 de Dezembro de 1524, Cochim (Índia)" },
      { label: "Feito", value: "Caminho marítimo para a Índia (1498)" },
      { label: "Título", value: "1.º Conde da Vidigueira" },
    ],
    sources: [
      { label: "Roteiro da Primeira Viagem de Vasco da Gama", url: null },
    ],
    body: `
<p>Vasco da Gama (c. 1469–1524) comandou a primeira armada a chegar à Índia por mar, unindo a Europa ao Oriente sem passar pelo Mediterrâneo. Foi o coroar de décadas de esforço iniciadas pelo ${lk("infante-dom-henrique", "Infante D. Henrique")}.</p>
<h2>A viagem</h2>
<p>Partiu de Lisboa em Julho de 1497, dobrou o Cabo da Boa Esperança e chegou a Calecute em Maio de 1498. O regresso confirmou que Portugal abrira uma nova rota do comércio mundial.</p>
<h2>Memória</h2>
<p>A sua gesta tornou-se o fio condutor de ${lk("os-lusiadas", "Os Lusíadas")}, a epopeia de ${lk("luiz-vaz-de-camoes", "Luiz Vaz de Camões")}. Está sepultado no ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")}, em Lisboa.</p>
`.trim(),
  },
  {
    slug: "fernando-pessoa",
    title: "Fernando Pessoa",
    category: "Pessoas",
    summary:
      "O maior poeta portuguez do século XX, criador dos heterónimos e autor de Mensagem.",
    tags: ["poesia", "modernismo", "heterónimos"],
    infobox: [
      { label: "Nascimento", value: "13 de Junho de 1888, Lisboa" },
      { label: "Morte", value: "30 de Novembro de 1935, Lisboa" },
      { label: "Obra maior", value: "Mensagem (1934)" },
      { label: "Heterónimos", value: "Caeiro, Reis, Campos" },
    ],
    sources: [
      { label: "Mensagem (1934)", url: null },
      { label: "Livro do Desassossego", url: null },
    ],
    body: `
<p>Fernando Pessoa (1888–1935) é o maior poeta portuguez do século XX. A sua obra desdobra-se em heterónimos — Alberto Caeiro, Ricardo Reis e Álvaro de Campos —, poetas imaginários com vida e estilo próprios.</p>
<h2>Mensagem</h2>
<p>O único livro que publicou em vida, <em>Mensagem</em> (1934), relê a história de Portugal em chave simbólica e profética, prolongando o imaginário de ${lk("os-lusiadas", "Os Lusíadas")}.</p>
<h2>A pátria é a língua</h2>
<p>A ele se deve a frase que resume uma identidade: "A minha pátria é a ${lk("lingua-portugueza", "língua portugueza")}." A sua poesia deu voz moderna à ${lk("saudade", "saudade")} e ao desassossego do homem contemporâneo.</p>
`.trim(),
  },
  {
    slug: "saudade",
    title: "Saudade",
    category: "Conceitos",
    summary:
      "O sentimento portuguez por excelência — a presença da ausência, tida por intraduzível.",
    tags: ["identidade", "sentimento", "cultura"],
    infobox: [
      { label: "Natureza", value: "Sentimento, conceito cultural" },
      { label: "Primeiro registo", value: "Poesia medieval galego-portugueza" },
      { label: "Dia da Saudade", value: "30 de Janeiro" },
    ],
    sources: [
      { label: "Teixeira de Pascoaes, A Saudade e o Saudosismo", url: null },
    ],
    body: `
<p>A saudade é o sentimento tido por mais portuguez de todos: a presença viva daquilo que está ausente — uma pessoa, um tempo, um lugar. Fica entre a memória feliz e a dor da distância, e é frequentemente apontada como intraduzível.</p>
<h2>Origem</h2>
<p>Encontra-se já nas cantigas galego-portuguezas da Idade Média e atravessa toda a literatura, da ${lk("lingua-portugueza", "língua portugueza")} aos versos de ${lk("fernando-pessoa", "Fernando Pessoa")}.</p>
<h2>Expressão</h2>
<p>É no ${lk("fado", "fado")} que a saudade encontra a sua forma musical mais pura — a voz que canta o que se perdeu sem deixar de o amar.</p>
`.trim(),
  },
  {
    slug: "fado",
    title: "Fado",
    category: "Conceitos",
    summary:
      "A canção urbana de Lisboa e Coimbra, Património Imaterial da Humanidade.",
    tags: ["música", "Lisboa", "UNESCO"],
    infobox: [
      { label: "Origem", value: "Lisboa, século XIX" },
      { label: "Instrumento", value: "Guitarra portugueza" },
      { label: "UNESCO", value: "Património Imaterial (2011)" },
      { label: "Maior voz", value: "Amália Rodrigues" },
    ],
    sources: [
      { label: "UNESCO — Lista do Património Cultural Imaterial", url: null },
    ],
    body: `
<p>O fado é a canção urbana nascida em Lisboa no século XIX, acompanhada pela guitarra portugueza. Em 2011 foi inscrito pela UNESCO na lista do Património Cultural Imaterial da Humanidade.</p>
<h2>A alma do fado</h2>
<p>O fado canta o destino, o amor e, sobretudo, a ${lk("saudade", "saudade")}. Amália Rodrigues levou-o ao mundo, tornando-se a sua voz maior.</p>
<h2>Lisboa e Coimbra</h2>
<p>Distinguem-se o fado de Lisboa, popular e dos bairros, e o fado de Coimbra, ligado à tradição académica e cantado por homens.</p>
`.trim(),
  },
  {
    slug: "lingua-portugueza",
    title: "Língua Portugueza",
    category: "Língua",
    summary:
      "A língua de cerca de 260 milhões de pessoas em quatro continentes.",
    tags: ["língua", "lusofonia", "CPLP"],
    infobox: [
      { label: "Falantes", value: "~260 milhões" },
      { label: "Origem", value: "Latim · galego-portuguez" },
      { label: "Países oficiais", value: "9 (CPLP)" },
      { label: "Posição", value: "Entre as mais faladas do mundo" },
    ],
    sources: [
      { label: "Comunidade dos Países de Língua Portuguesa (CPLP)", url: null },
    ],
    body: `
<p>A língua portugueza é falada por cerca de 260 milhões de pessoas e é oficial em nove países de quatro continentes. Nascida do latim trazido à Península Ibérica, firmou-se como galego-portuguez na poesia medieval.</p>
<h2>Da fundação ao mundo</h2>
<p>Com a fundação do reino por ${lk("dom-afonso-henriques", "D. Afonso Henriques")} ganhou território; com a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} espalhou-se pelo globo. ${lk("os-lusiadas", "Os Lusíadas")} fixaram-lhe a forma literária.</p>
<h2>Língua e identidade</h2>
<p>"A minha pátria é a língua portugueza", escreveu ${lk("fernando-pessoa", "Fernando Pessoa")}. Hoje, a CPLP une os povos que nela se reconhecem.</p>
`.trim(),
  },
  {
    slug: "os-lusiadas",
    title: "Os Lusíadas",
    category: "Obras",
    summary:
      "A epopeia da nação portugueza, escrita por Camões e publicada em 1572.",
    tags: ["épica", "Camões", "literatura"],
    infobox: [
      { label: "Autor", value: "Luiz Vaz de Camões" },
      { label: "Publicação", value: "1572" },
      { label: "Forma", value: "Epopeia em 10 cantos" },
      { label: "Tema", value: "A viagem de Vasco da Gama" },
    ],
    sources: [{ label: "Os Lusíadas (1572)", url: null }],
    body: `
<p><em>Os Lusíadas</em> é a epopeia nacional portugueza, escrita por ${lk("luiz-vaz-de-camoes", "Luiz Vaz de Camões")} e publicada em 1572. Em dez cantos e oitavas, canta os feitos do povo portuguez.</p>
<h2>A acção</h2>
<p>O fio condutor é a viagem de ${lk("vasco-da-gama", "Vasco da Gama")} à Índia, mas, através dela, desfila toda a história de Portugal e o ímpeto da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>Grandeza</h2>
<p>Nela convivem a mitologia clássica e a fé cristã. Deu forma definitiva à ${lk("lingua-portugueza", "língua portugueza")} e um lugar a Portugal entre as grandes literaturas do mundo.</p>
`.trim(),
  },
  {
    slug: "mosteiro-dos-jeronimos",
    title: "Mosteiro dos Jerónimos",
    category: "Lugares",
    summary:
      "A obra-prima do manuelino, em Belém, panteão dos heróis da expansão.",
    tags: ["manuelino", "Belém", "UNESCO"],
    infobox: [
      { label: "Local", value: "Belém, Lisboa" },
      { label: "Início", value: "1501" },
      { label: "Estilo", value: "Manuelino" },
      { label: "UNESCO", value: "Património Mundial (1983)" },
    ],
    sources: [
      { label: "UNESCO — Património Mundial", url: null },
    ],
    body: `
<p>O Mosteiro dos Jerónimos, em Belém, é a obra-prima do estilo manuelino e um dos grandes monumentos de Portugal. A sua construção começou em 1501, por ordem de D. Manuel I.</p>
<h2>Memória da expansão</h2>
<p>Foi erguido junto ao local de onde partiu ${lk("vasco-da-gama", "Vasco da Gama")} para a Índia, celebrando a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. A pedra ostenta cordas, esferas armilares e motivos do mar.</p>
<h2>Panteão</h2>
<p>Guarda os túmulos de Vasco da Gama e de ${lk("luiz-vaz-de-camoes", "Luiz Vaz de Camões")}, reunindo na mesma casa o herói e o poeta da nação.</p>
`.trim(),
  },
  {
    slug: "padrao-dos-descobrimentos",
    title: "Padrão dos Descobrimentos",
    category: "Lugares",
    summary:
      "O monumento de Belém que celebra os protagonistas da expansão portugueza.",
    tags: ["monumento", "Belém", "descobrimentos"],
    infobox: [
      { label: "Local", value: "Belém, Lisboa" },
      { label: "Inauguração", value: "1960" },
      { label: "Forma", value: "Caravela com 33 figuras" },
      { label: "Figura na proa", value: "Infante D. Henrique" },
    ],
    sources: [{ label: "Câmara Municipal de Lisboa", url: null }],
    body: `
<p>O Padrão dos Descobrimentos ergue-se na margem do Tejo, em Belém, em forma de caravela. Foi inaugurado em 1960, nas comemorações dos 500 anos da morte do ${lk("infante-dom-henrique", "Infante D. Henrique")}.</p>
<h2>As figuras</h2>
<p>Na proa, o Infante segura uma caravela; atrás dele desfilam 33 figuras maiores da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} — navegadores, reis, cartógrafos e poetas.</p>
<h2>A rosa-dos-ventos</h2>
<p>Diante do monumento, no chão, uma vasta rosa-dos-ventos com um mapa-múndi assinala as rotas e as datas da expansão portugueza pelo mundo.</p>
`.trim(),
  },
  {
    slug: "era-dos-descobrimentos",
    title: "Era dos Descobrimentos",
    category: "Eventos",
    summary:
      "A epopeia marítima que, nos séculos XV e XVI, ligou os continentes.",
    tags: ["descobrimentos", "expansão", "história"],
    infobox: [
      { label: "Período", value: "Séculos XV–XVI" },
      { label: "Início", value: "Conquista de Ceuta (1415)" },
      { label: "Marco", value: "Caminho marítimo para a Índia (1498)" },
      { label: "Brasil", value: "Chegada de Cabral (1500)" },
    ],
    sources: [
      { label: "Crónica de Guiné, Gomes Eanes de Zurara", url: null },
    ],
    body: `
<p>A Era dos Descobrimentos foi o período em que Portugal, e depois a Europa, se lançou ao mar e ligou pela primeira vez os continentes. Começou com a conquista de Ceuta, em 1415.</p>
<h2>O avanço</h2>
<p>Sob o impulso do ${lk("infante-dom-henrique", "Infante D. Henrique")}, os navegadores desceram a costa de África; ${lk("vasco-da-gama", "Vasco da Gama")} chegou à Índia em 1498 e Pedro Álvares Cabral ao Brasil em 1500.</p>
<h2>Um mundo novo</h2>
<p>A partilha do globo foi acordada no ${lk("tratado-de-tordesilhas", "Tratado de Tordesilhas")}. Esta gesta inspirou ${lk("os-lusiadas", "Os Lusíadas")} e fez da ${lk("lingua-portugueza", "língua portugueza")} uma língua mundial.</p>
`.trim(),
  },
  {
    slug: "tratado-de-tordesilhas",
    title: "Tratado de Tordesilhas",
    category: "Eventos",
    summary:
      "O acordo de 1494 que dividiu o mundo entre Portugal e Castela.",
    tags: ["diplomacia", "1494", "descobrimentos"],
    infobox: [
      { label: "Data", value: "7 de Junho de 1494" },
      { label: "Local", value: "Tordesilhas (Castela)" },
      { label: "Partes", value: "Portugal e Castela" },
      { label: "Linha", value: "370 léguas a oeste de Cabo Verde" },
    ],
    sources: [{ label: "Tratado de Tordesilhas (1494)", url: null }],
    body: `
<p>O Tratado de Tordesilhas, assinado em 1494, dividiu o mundo por descobrir entre Portugal e a Coroa de Castela, traçando um meridiano a 370 léguas a oeste das ilhas de Cabo Verde.</p>
<h2>A partilha do globo</h2>
<p>As terras a oriente da linha caberiam a Portugal; as a ocidente, a Castela. O tratado, mediado pelo Papa, foi um dos primeiros grandes acordos diplomáticos à escala planetária.</p>
<h2>Consequências</h2>
<p>Foi com base nesta linha que Portugal assegurou, anos depois, a posse do Brasil, no quadro da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
`.trim(),
  },
];

/**
 * Seed: primeira leva de artigos-âncora da Lusopédia (publicados e
 * interligados). Idempotente — atualiza pelo slug se já existir.
 */
export const seedFoundation = internalMutation({
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

/** Apaga um artigo por slug. Usado para remover slugs descontinuados (ex.: renomeações). */
export const deleteBySlug = internalMutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!article) {
      return { deleted: false };
    }
    await ctx.db.delete(article._id);
    return { deleted: true };
  },
});
