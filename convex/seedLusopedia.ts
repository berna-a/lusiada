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
  aliases?: string[];
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
<p>Afonso Henriques (c. 1109–1185), dito <em>o Conquistador</em>, foi o primeiro Rei de Portugal e o fundador da nação. Filho do conde D. Henrique de Borgonha e de D. Teresa de Leão, herdou um condado e legou um reino.</p>
<h2>A independência</h2>
<p>Em 1128, na Batalha de São Mamede, venceu as forças da própria mãe e tomou as rédeas do governo. A vitória sobre os mouros na Batalha de Ourique (1139) — onde a tradição diz ter-lhe aparecido Cristo — deu-lhe o título de rei. Pelo Tratado de Zamora (1143), Leão reconheceu Portugal, e em 1179 a bula <em>Manifestis Probatum</em> selou, em Roma, a soberania do novo reino.</p>
<h2>A conquista de Lisboa</h2>
<p>Em 1147, com o auxílio de cruzados a caminho da Terra Santa, conquistou ${lk("lisboa", "Lisboa")} aos mouros, alargando o reino para sul e firmando a sua capital futura.</p>
<h2>Porque importa</h2>
<p>Toda a sua acção foi a de um guerreiro tenaz que, contra reis e impérios, fez nascer Portugal — um dos mais antigos Estados da Europa com fronteiras quase inalteradas. Por isso é, na memória portugueza, o <em>pai da pátria</em>, e dele parte a estrada que séculos depois levaria à ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
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
<p>O Infante D. Henrique (1394–1460), filho do rei D. João I, é a figura tutelar do início da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Em torno de si, no Algarve, reuniu pilotos, cartógrafos e construtores que aperfeiçoaram a arte de navegar e o navio que a tornou possível: a caravela.</p>
<h2>A conquista de Ceuta</h2>
<p>A tomada de Ceuta, em 1415 — onde o jovem Infante foi armado cavaleiro —, marcou o primeiro passo da expansão portugueza em África e despertou nele o objectivo de uma vida: ir mais além.</p>
<h2>O impulso atlântico</h2>
<p>Sob o seu patrocínio, os portuguezes povoaram a Madeira e os Açores e, em 1434, Gil Eanes dobrou o temido Cabo Bojador, vencendo o medo do "mar tenebroso" que detinha a Europa havia séculos.</p>
<h2>Porque importa</h2>
<p>Sem fama de grandes batalhas, o Infante mudou o mundo com uma ideia: a de que o mar não era um fim, mas um caminho. Abriu a rota que ${lk("vasco-da-gama", "Vasco da Gama")} havia de completar até à Índia, e fez de um reino da periferia o pioneiro da era global.</p>
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
<p>Vasco da Gama (c. 1469–1524) comandou a primeira armada a chegar à Índia por mar, unindo a Europa ao Oriente sem passar pelo Mediterrâneo nem pelas mãos de venezianos e turcos. Foi o coroar de décadas de esforço iniciadas pelo ${lk("infante-dom-henrique", "Infante D. Henrique")}.</p>
<h2>A viagem</h2>
<p>Partiu de Belém em Julho de 1497 com quatro navios, dobrou o Cabo da Boa Esperança e, após meses de mar aberto, chegou a Calecute em Maio de 1498. À chegada, ao serem interrogados, os portuguezes terão respondido que vinham buscar "cristãos e especiarias" — a fé e o comércio, os dois motores da expansão.</p>
<h2>Memória</h2>
<p>A sua gesta abriu uma nova perspectiva ao comércio mundial e tornou-se o fio condutor d'${lk("os-lusiadas", "Os Lusíadas")}, a epopeia de ${lk("luiz-vaz-de-camoes", "Luiz Vaz de Camões")}. Está sepultado no ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")}, frente ao rio de onde partiu.</p>
<h2>Porque importa</h2>
<p>Com Gama, o mundo deixou de ter limites conhecidos: começou aquilo a que hoje chamamos globalização. Um pequeno reino à beira-mar tornou-se, por uma só viagem, senhor de uma rota que mudou a economia do planeta.</p>
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
<p>Fernando Pessoa (1888–1935) é o maior poeta portuguez do século XX e uma das vozes centrais do modernismo europeu. A sua genialidade fez-se multidão: criou os <em>heterónimos</em> — poetas imaginários com biografia, filosofia e estilo próprios —, como se um só homem contivesse uma literatura inteira.</p>
<h2>Os heterónimos</h2>
<p>Alberto Caeiro, o mestre, é o poeta da natureza e das coisas como são; Ricardo Reis, o classicista estóico; Álvaro de Campos, o futurista da exaltação e do tédio. Cada um abriu uma perspectiva diferente sobre o mesmo mistério, e o próprio Pessoa cantou a ${lk("saudade", "saudade")} e o desassossego do homem contemporâneo.</p>
<h2>Mensagem</h2>
<p>O único livro que publicou em vida, <em>Mensagem</em> (1934), relê a história de Portugal em chave simbólica e profética, prolongando o imaginário d'${lk("os-lusiadas", "Os Lusíadas")} e anunciando um Quinto Império feito de cultura e de espírito:</p>
<blockquote>«Ó mar salgado, quanto do teu sal / São lágrimas de Portugal!»</blockquote>
<h2>Porque importa</h2>
<p>A ele se deve a frase que resume uma identidade: "A minha pátria é a ${lk("lingua-portugueza", "língua portugueza")}." Pessoa provou que a nação não vive só de território, mas de língua, memória e sonho — e é, depois de Camões, o segundo nome da poesia portugueza.</p>
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
<p>A saudade é o sentimento tido por mais portuguez de todos: a presença viva daquilo que está ausente — uma pessoa, um tempo, um lugar. Não é só tristeza nem só memória, mas um afecto que mistura as duas: a alegria de ter tido e a dor de já não ter. É, dizem muitos, intraduzível.</p>
<h2>Origem</h2>
<p>Encontra-se já nas cantigas galego-portuguezas da Idade Média, onde o trovador chora a ausência da amada, e atravessa toda a ${lk("lingua-portugueza", "língua portugueza")}, de D. Dinis aos versos de ${lk("fernando-pessoa", "Fernando Pessoa")}:</p>
<blockquote>«Ai flores, ai flores do verde pino, / se sabedes novas do meu amigo!»<br/>— D. Dinis</blockquote>
<h2>Saudade e saudosismo</h2>
<p>No início do século XX, Teixeira de Pascoaes fez da saudade uma filosofia — o <em>saudosismo</em> —, vendo nela a própria alma da pátria e a chave da sua redenção.</p>
<h2>Porque importa</h2>
<p>A saudade é a forma portugueza de amar o tempo. É no ${lk("fado", "fado")} que encontra a sua voz, e em cada despedida que se renova. Um povo de navegadores, que sempre partiu, fez dela o seu modo de guardar o que deixava para trás.</p>
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
<p>O fado é a canção urbana nascida em ${lk("lisboa", "Lisboa")} no século XIX, cantada à voz e acompanhada pela guitarra portugueza e pela viola. Em 2011 foi inscrito pela UNESCO na lista do Património Cultural Imaterial da Humanidade. O nome vem do latim <em>fatum</em> — o destino.</p>
<h2>A alma do fado</h2>
<p>O fado não é espectáculo: é confissão. Canta o destino, o amor, o ciúme, o mar e, sobretudo, a ${lk("saudade", "saudade")}. ${lk("amalia-rodrigues", "Amália Rodrigues")} deu-lhe dignidade de arte maior e levou-o ao mundo, tornando-se a sua voz eterna.</p>
<h2>Lisboa e Coimbra</h2>
<p>Distinguem-se duas escolas: o fado de ${lk("lisboa", "Lisboa")}, popular, dos bairros e das tabernas, cantado por homens e mulheres; e o fado de ${lk("coimbra", "Coimbra")}, ligado à tradição académica da universidade, cantado por homens, de capa e batina.</p>
<h2>Porque importa</h2>
<p>No fado, um povo inteiro reconhece a sua maneira de sentir. É a saudade feita som — e a prova de que a alma portugueza, mesmo na perda, canta.</p>
`.trim(),
  },
  {
    slug: "lingua-portugueza",
    title: "Língua Portugueza",
    category: "Língua",
    summary:
      "A língua de cerca de 260 milhões de pessoas em quatro continentes.",
    tags: ["língua", "lusofonia", "CPLP"],
    aliases: ["Língua Portuguesa", "português"],
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
<p>A língua portugueza é, na actualidade, falada por cerca de 260 milhões de pessoas e é oficial em nove países de quatro continentes. Nascida do latim trazido à Península Ibérica pelos romanos, firmou-se como galego-portuguez na poesia medieval e tornou-se, com o reino, a língua de uma nação.</p>
<h2>Da fundação ao mundo</h2>
<p>Com a fundação do reino por ${lk("dom-afonso-henriques", "D. Afonso Henriques")} ganhou território e nome; com a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} espalhou-se pelo globo, do Brasil a Goa, de Angola a Timor. ${lk("os-lusiadas", "Os Lusíadas")} fixaram-lhe a forma literária e deram-lhe a glória de uma epopeia.</p>
<h2>Língua e identidade</h2>
<p>"A minha pátria é a língua portugueza", escreveu ${lk("fernando-pessoa", "Fernando Pessoa")}. Hoje, a Comunidade dos Países de Língua Portuguesa une os povos que nela se reconhecem — uma pátria sem fronteiras, feita de palavras.</p>
<h2>Porque importa</h2>
<p>A língua é a maior obra colectiva do Povo Portuguez. Preservá-la, estudá-la e fazê-la crescer — incluindo na grafia <strong>Portugueza</strong> — é a missão primeira da Associação Memória Lusíada.</p>
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
<p><em>Os Lusíadas</em> é a epopeia nacional portugueza, escrita por ${lk("luiz-vaz-de-camoes", "Luiz Vaz de Camões")} e publicada em 1572. Em dez cantos de oitava-rima, canta os feitos do Povo Portuguez, erguendo a história de uma nação pequena à dignidade do mito clássico.</p>
<h2>A acção</h2>
<p>O fio condutor é a viagem de ${lk("vasco-da-gama", "Vasco da Gama")} à Índia; mas, através dela, desfila toda a história de Portugal e o ímpeto da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. Logo na abertura, Camões declara que os feitos portuguezes superam os da Antiguidade:</p>
<blockquote>«Cessem do sábio Grego e do Troiano / As navegações grandes que fizeram; / Cale-se de Alexandro e de Trajano / A fama das vitórias que tiveram.»</blockquote>
<h2>Mito e história</h2>
<p>Nela convivem os deuses do Olimpo — que ora ajudam, ora estorvam os navegadores — e a fé cristã; a geografia dos Descobrimentos e a meditação sobre a glória e a queda dos impérios. Na praia, o Velho do Restelo adverte contra a ambição que arrasta os homens ao mar.</p>
<h2>Porque importa</h2>
<p>Deu forma definitiva à ${lk("lingua-portugueza", "língua portugueza")} e um lugar a Portugal entre as grandes literaturas do mundo. É o livro onde a nação se vê inteira — e a razão por que a língua portugueza é, ainda hoje, "a língua de Camões".</p>
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
<p>O Mosteiro dos Jerónimos, em Belém, é a obra-prima da arquitectura manuelina e um dos maiores monumentos de Portugal. A sua construção começou em 1501, por ordem de D. Manuel I, financiada pelo ouro e pelas especiarias que as naus traziam do Oriente.</p>
<h2>Memória da expansão</h2>
<p>Foi erguido junto ao local de onde partiu ${lk("vasco-da-gama", "Vasco da Gama")} para a Índia, como acção de graças pela viagem e casa de oração dos navegadores. A pedra ostenta cordas, nós, esferas armilares e seres do mar — toda a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} esculpida em calcário.</p>
<h2>Panteão</h2>
<p>Guarda os túmulos de Vasco da Gama e de ${lk("luiz-vaz-de-camoes", "Luiz Vaz de Camões")}, reunindo na mesma casa o herói e o poeta da nação.</p>
<h2>Porque importa</h2>
<p>Classificado Património Mundial pela UNESCO em 1983, é o monumento onde Portugal celebrou, em pedra, o seu momento mais alto. Visitá-lo é entrar na própria memória da expansão.</p>
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
<p>O Padrão dos Descobrimentos ergue-se na margem do Tejo, em Belém, em forma de caravela de velas enfunadas. Foi inaugurado em 1960, nas comemorações dos 500 anos da morte do ${lk("infante-dom-henrique", "Infante D. Henrique")}, segundo projecto do arquitecto Cottinelli Telmo e do escultor Leopoldo de Almeida.</p>
<h2>As figuras</h2>
<p>Na proa, o Infante segura uma caravela; atrás dele desfilam 33 figuras maiores da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} — ${lk("vasco-da-gama", "Vasco da Gama")}, Pedro Álvares Cabral, ${lk("luiz-vaz-de-camoes", "Camões")}, reis, missionários e cartógrafos —, todos voltados para o mar.</p>
<h2>A rosa-dos-ventos</h2>
<p>Diante do monumento, oferecida pela África do Sul, uma vasta rosa-dos-ventos com um mapa-múndi assinala no chão as rotas e as datas da expansão portugueza pelo mundo.</p>
<h2>Porque importa</h2>
<p>É o monumento moderno da memória dos Descobrimentos — o lugar onde Portugal, virado para o Tejo e para o Atlântico, continua a olhar o horizonte que um dia desvendou.</p>
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
<p>A Era dos Descobrimentos foi o período em que Portugal, e depois a Europa, se lançou ao mar e ligou pela primeira vez todos os continentes. Começou com a conquista de Ceuta, em 1415, e fez de um reino pobre da periferia o centro de um império global.</p>
<h2>O avanço</h2>
<p>Sob o impulso do ${lk("infante-dom-henrique", "Infante D. Henrique")}, os navegadores desceram, ano após ano, a costa de África, com o objectivo de chegar à Índia. ${lk("vasco-da-gama", "Vasco da Gama")} alcançou-a em 1498; Pedro Álvares Cabral aportou ao Brasil em 1500; e, em poucas décadas, os portuguezes chegaram à China e ao Japão.</p>
<h2>Um mundo novo</h2>
<p>A partilha do globo foi acordada com Castela no ${lk("tratado-de-tordesilhas", "Tratado de Tordesilhas")}. Nasceram a cartografia moderna, o comércio à escala planetária e o primeiro encontro — nem sempre pacífico — entre todos os povos da Terra.</p>
<h2>Porque importa</h2>
<p>Foi a maior gesta colectiva do Povo Portuguez e um dos princípios do mundo moderno. Inspirou ${lk("os-lusiadas", "Os Lusíadas")} e levou a ${lk("lingua-portugueza", "língua portugueza")} aos quatro cantos do mundo.</p>
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
<p>O Tratado de Tordesilhas, assinado em 1494, dividiu o mundo por descobrir entre Portugal e a Coroa de Castela, traçando um meridiano a 370 léguas a oeste das ilhas de Cabo Verde. Tinha por objectivo evitar a guerra entre as duas potências da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>A partilha do globo</h2>
<p>As terras a oriente da linha caberiam a Portugal; as a ocidente, a Castela. Foi um dos primeiros grandes acordos diplomáticos à escala planetária — dois reinos ibéricos a repartir, no papel, um mundo que ainda mal conheciam.</p>
<h2>Consequências</h2>
<p>Foi graças a esta linha que Portugal assegurou, seis anos depois, a posse do Brasil, quando a armada de ${lk("pedro-alvares-cabral", "Pedro Álvares Cabral")} lá aportou. O tratado moldou para sempre o mapa da América do Sul — e a fronteira da ${lk("lingua-portugueza", "língua portugueza")} no continente.</p>
<h2>Porque importa</h2>
<p>Tordesilhas é a prova de uma audácia sem precedentes: dois pequenos reinos a dividir o planeta entre si. Está na origem do Brasil portuguez e do mundo lusófono que hoje conhecemos.</p>
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
