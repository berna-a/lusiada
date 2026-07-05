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
    slug: "d-dinis",
    title: "D. Dinis",
    category: "Pessoas",
    summary:
      "O Rei Lavrador e Trovador — deu a Portugal a sua língua e a sua universidade.",
    tags: ["reis", "língua", "poesia"],
    infobox: [
      { label: "Nascimento", value: "9 de Outubro de 1261, Lisboa" },
      { label: "Morte", value: "7 de Janeiro de 1325, Santarém" },
      { label: "Reinado", value: "1279–1325" },
      { label: "Epíteto", value: "O Rei Lavrador" },
    ],
    sources: [{ label: "Cancioneiro da Biblioteca Nacional", url: null }],
    body: `
<p>D. Dinis (1261–1325), sexto Rei de Portugal, foi o <em>Rei Lavrador</em> e <em>Rei Trovador</em>: governou quase meio século de paz e prosperidade, e foi ele próprio um dos maiores poetas da sua era.</p>
<h2>O Rei Lavrador</h2>
<p>Incentivou a actividade agrícola, mandou plantar o Pinhal de Leiria para travar as areias e abastecer os estaleiros, e fundou feiras e vilas por todo o reino. Organizou a defesa com uma rede de castelos na fronteira.</p>
<h2>A língua e o saber</h2>
<p>Fundou em 1290 o Estudo Geral, primeira universidade portugueza, que viria a fixar-se em ${lk("coimbra", "Coimbra")}. Tornou o portuguez — e não o latim — a língua oficial da chancelaria, dando dignidade de Estado à ${lk("lingua-portugueza", "língua portugueza")}.</p>
<h2>Porque importa</h2>
<p>Poeta e rei, D. Dinis deu a Portugal a sua língua escrita, a sua universidade e um século de paz. As suas cantigas — "Ai flores, ai flores do verde pino" — estão na origem da ${lk("saudade", "saudade")} feita poesia.</p>
`.trim(),
  },
  {
    slug: "d-manuel-i",
    title: "D. Manuel I",
    category: "Pessoas",
    summary:
      "O Venturoso — o rei do auge dos Descobrimentos e do estilo manuelino.",
    tags: ["reis", "descobrimentos", "manuelino"],
    infobox: [
      { label: "Nascimento", value: "31 de Maio de 1469, Alcochete" },
      { label: "Morte", value: "13 de Dezembro de 1521, Lisboa" },
      { label: "Reinado", value: "1495–1521" },
      { label: "Epíteto", value: "O Venturoso" },
    ],
    sources: [{ label: "Crónica de D. Manuel, Damião de Góis", url: null }],
    body: `
<p>D. Manuel I (1469–1521), dito <em>o Venturoso</em>, reinou no auge da ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}. No seu reinado, ${lk("vasco-da-gama", "Vasco da Gama")} chegou à Índia e ${lk("pedro-alvares-cabral", "Pedro Álvares Cabral")} ao Brasil — e Portugal tornou-se o império mais rico da Europa.</p>
<h2>O império das especiarias</h2>
<p>O ouro e as especiarias do Oriente encheram os cofres da Coroa. Manuel fez de Lisboa o centro do comércio mundial, com a Casa da Índia a gerir as riquezas que chegavam pelo mar.</p>
<h2>O estilo manuelino</h2>
<p>Da sua riqueza nasceu uma arquitectura única — o <em>manuelino</em> —, que cobriu de cordas, esferas e seres do mar o ${lk("mosteiro-dos-jeronimos", "Mosteiro dos Jerónimos")} e a ${lk("torre-de-belem", "Torre de Belém")}.</p>
<h2>Porque importa</h2>
<p>Sob D. Manuel, Portugal viveu o seu momento mais alto. Mas o reinado tem uma sombra: a expulsão e conversão forçada dos judeus, em 1496-97, que empobreceu o país de um dos seus povos. O Venturoso é a face dourada — e o reverso — da glória.</p>
`.trim(),
  },
  {
    slug: "d-sebastiao",
    title: "D. Sebastião",
    category: "Pessoas",
    summary:
      "O Desejado — o rei-menino cuja morte abriu o sonho do sebastianismo.",
    tags: ["reis", "sebastianismo", "século XVI"],
    infobox: [
      { label: "Nascimento", value: "20 de Janeiro de 1554, Lisboa" },
      {
        label: "Desaparecimento",
        value: "4 de Agosto de 1578, Alcácer-Quibir",
      },
      { label: "Reinado", value: "1557–1578" },
      { label: "Epíteto", value: "O Desejado" },
    ],
    sources: [{ label: "Crónica de D. Sebastião", url: null }],
    body: `
<p>D. Sebastião (1554–1578), <em>o Desejado</em>, subiu ao trono ainda criança e foi educado no sonho de uma cruzada contra os mouros. A sua morte, aos 24 anos, mudou o destino de Portugal.</p>
<h2>O sonho de África</h2>
<p>Movido pela fé e pela ânsia de glória, lançou uma expedição a Marrocos contra todos os conselhos. A sua acção precipitada culminou no desastre da ${lk("batalha-de-alcacer-quibir", "Batalha de Alcácer-Quibir")}, em 1578, onde desapareceu sem deixar corpo nem herdeiro.</p>
<h2>O Encoberto</h2>
<p>Sem rei, Portugal caiu sob a coroa de Castela em 1580. Mas o povo não aceitou a morte do Desejado: nasceu a lenda de que voltaria, numa manhã de nevoeiro, para restaurar o reino — o ${lk("sebastianismo", "sebastianismo")}.</p>
<h2>Porque importa</h2>
<p>Sebastião é o rei que perdeu a independência e, paradoxalmente, o símbolo da esperança portugueza. O seu mito atravessa séculos e chega a ${lk("fernando-pessoa", "Fernando Pessoa")}, que dele fez um dos corações d'${lk("mensagem", "<em>Mensagem</em>")}.</p>
`.trim(),
  },
  {
    slug: "bartolomeu-dias",
    title: "Bartolomeu Dias",
    category: "Pessoas",
    summary: "O navegador que dobrou o Cabo da Boa Esperança em 1488.",
    tags: ["descobrimentos", "navegação", "África"],
    infobox: [
      { label: "Nascimento", value: "c. 1450" },
      { label: "Morte", value: "29 de Maio de 1500, ao largo do Cabo" },
      { label: "Feito", value: "Cabo da Boa Esperança (1488)" },
    ],
    sources: [{ label: "Décadas da Ásia, João de Barros", url: null }],
    body: `
<p>Bartolomeu Dias (c. 1450–1500) foi o navegador que, em 1488, dobrou pela primeira vez o extremo sul de África, provando que o Atlântico e o Índico se uniam — e que o caminho marítimo para a Índia era possível.</p>
<h2>O Cabo das Tormentas</h2>
<p>Ao serviço de ${lk("dom-joao-ii", "D. João II")}, enfrentou tempestades terríveis no cabo a que chamou <em>das Tormentas</em>. O rei, vendo nele uma promessa, rebaptizou-o <em>Cabo da Boa Esperança</em> — o objectivo, agora, era a Índia.</p>
<h2>Destino</h2>
<p>Coube a ${lk("vasco-da-gama", "Vasco da Gama")} completar, dez anos depois, a viagem que Dias abrira. O próprio Dias morreria em 1500, no mar, perto do cabo que tornara célebre, na armada de ${lk("pedro-alvares-cabral", "Pedro Álvares Cabral")}.</p>
<h2>Porque importa</h2>
<p>Dias é o homem que abriu a porta do Índico. Sem a sua coragem no fim do mundo conhecido, a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")} não teria chegado ao Oriente.</p>
`.trim(),
  },
  {
    slug: "fernao-de-magalhaes",
    title: "Fernão de Magalhães",
    category: "Pessoas",
    summary: "O comandante da primeira viagem de circum-navegação do globo.",
    tags: ["descobrimentos", "navegação", "Pacífico"],
    infobox: [
      { label: "Nascimento", value: "c. 1480" },
      { label: "Morte", value: "27 de Abril de 1521, Mactan (Filipinas)" },
      { label: "Feito", value: "1.ª circum-navegação (1519–1522)" },
    ],
    sources: [{ label: "Diário de Antonio Pigafetta", url: null }],
    body: `
<p>Fernão de Magalhães (c. 1480–1521) foi o navegador portuguez que comandou a primeira viagem de circum-navegação do globo — a maior façanha náutica de sempre —, ainda que ao serviço da coroa de Espanha.</p>
<h2>A volta ao mundo</h2>
<p>Recusado por Portugal, partiu de Sevilha em 1519 com cinco naus. Descobriu o estreito que hoje tem o seu nome, no extremo sul da América, e atravessou um oceano tão calmo que lhe chamou <em>Pacífico</em>.</p>
<h2>O fim e a glória</h2>
<p>Morreu em 1521 nas Filipinas, antes de fechar o círculo. Mas uma das suas naus, comandada por Elcano, regressou a Espanha em 1522: a Terra fora dada à volta, e provou-se, de vez, que era redonda.</p>
<h2>Porque importa</h2>
<p>Magalhães mudou para sempre a perspectiva do mundo: provou que todos os mares se ligam. É, com ${lk("vasco-da-gama", "Vasco da Gama")}, um dos maiores nomes da navegação — e a prova de que o génio portuguez não conhecia fronteiras.</p>
`.trim(),
  },
  {
    slug: "eca-de-queiroz",
    title: "Eça de Queiroz",
    category: "Pessoas",
    summary: "O maior romancista da língua portugueza, mestre do realismo.",
    tags: ["literatura", "realismo", "século XIX"],
    aliases: ["Eça de Queirós"],
    infobox: [
      { label: "Nascimento", value: "25 de Novembro de 1845, Póvoa de Varzim" },
      { label: "Morte", value: "16 de Agosto de 1900, Paris" },
      { label: "Obra-prima", value: "Os Maias (1888)" },
      { label: "Geração", value: "Geração de 70" },
    ],
    sources: [{ label: "Os Maias (1888)", url: null }],
    body: `
<p>José Maria de Eça de Queiroz (1845–1900) é o maior romancista da ${lk("lingua-portugueza", "língua portugueza")} e a figura central da Geração de 70, que quis modernizar Portugal pela crítica e pela arte.</p>
<h2>O realismo</h2>
<p>Cônsul em Havana, Inglaterra e França, observou o país de fora e retratou-o com ironia mordaz e uma perspectiva crítica da sociedade, da Igreja e da política. <em>O Crime do Padre Amaro</em> e <em>O Primo Basílio</em> escandalizaram e renovaram o romance portuguez.</p>
<h2>Os Maias</h2>
<p>A sua obra-prima, <em>Os Maias</em> (1888), é o grande romance da ${lk("lisboa", "Lisboa")} oitocentista e da decadência de uma família — e, com ela, de todo um país.</p>
<h2>Porque importa</h2>
<p>Eça deu à prosa portugueza uma elegância e uma graça que ninguém igualou. Rir de Portugal para o amar melhor: é essa a sua lição, e a razão por que continua a ser lido e citado.</p>
`.trim(),
  },
  {
    slug: "guimaraes",
    title: "Guimarães",
    category: "Lugares",
    summary: 'A Cidade Berço — "Aqui nasceu Portugal".',
    tags: ["cidades", "fundação", "UNESCO"],
    infobox: [
      { label: "Região", value: "Minho" },
      { label: "Alcunha", value: "Cidade Berço" },
      { label: "Património", value: "Centro histórico (UNESCO, 2001)" },
    ],
    sources: [{ label: "Câmara Municipal de Guimarães", url: null }],
    body: `
<p>Guimarães, no Minho, é a <em>Cidade Berço</em>: foi aqui que Portugal nasceu. Na muralha do seu castelo lê-se a frase que a nação fez sua — "Aqui nasceu Portugal".</p>
<h2>O berço da nação</h2>
<p>Foi nesta cidade que ${lk("dom-afonso-henriques", "Afonso Henriques")} terá nascido e sido criado, e nas suas imediações, na Batalha de São Mamede (1128), que ele firmou o poder que faria do condado um reino.</p>
<h2>A cidade-museu</h2>
<p>O seu centro histórico, de ruas medievais e arquitectura preservada, é Património Mundial da UNESCO desde 2001 — um dos mais belos conjuntos urbanos da Europa.</p>
<h2>Porque importa</h2>
<p>Guimarães é o lugar das origens, a certidão de nascimento de uma nação com quase nove séculos. Visitá-la é tocar o princípio da história portugueza.</p>
`.trim(),
  },
  {
    slug: "sintra",
    title: "Sintra",
    category: "Lugares",
    summary:
      'A serra de palácios e nevoeiros que Byron chamou "glorioso Éden".',
    tags: ["paisagem", "romantismo", "UNESCO"],
    infobox: [
      { label: "Região", value: "Grande Lisboa" },
      { label: "Ex-líbris", value: "Palácio da Pena" },
      { label: "Património", value: "Paisagem Cultural (UNESCO, 1995)" },
    ],
    sources: [{ label: "Parques de Sintra — Monte da Lua", url: null }],
    body: `
<p>Sintra, a poucos quilómetros de ${lk("lisboa", "Lisboa")}, é uma serra de palácios, quintas e nevoeiros onde a natureza e a arte se confundem. Lorde Byron chamou-lhe um "glorioso Éden".</p>
<h2>Paisagem romântica</h2>
<p>Reis e nobres fizeram dela o seu retiro, deixando uma colecção de palácios de sonho: o Palácio da Pena, multicolor no alto da serra; o Palácio Nacional, das duas chaminés; o Castelo dos Mouros; e a misteriosa Quinta da Regaleira.</p>
<h2>Património</h2>
<p>A sua paisagem cultural, onde o Romantismo do século XIX se casou com a serra, é Património Mundial da UNESCO desde 1995.</p>
<h2>Porque importa</h2>
<p>Sintra é o lugar onde Portugal sonhou. Nenhum outro sítio reúne tanta beleza, mistério e arte — a prova de que a imaginação também faz parte da alma de um povo.</p>
`.trim(),
  },
  {
    slug: "evora",
    title: "Évora",
    category: "Lugares",
    summary:
      "A cidade-museu do Alentejo, de raízes romanas e brancas muralhas.",
    tags: ["cidades", "Alentejo", "UNESCO"],
    infobox: [
      { label: "Região", value: "Alentejo" },
      { label: "Ex-líbris", value: "Templo Romano" },
      { label: "Património", value: "Centro histórico (UNESCO, 1986)" },
    ],
    sources: [{ label: "Câmara Municipal de Évora", url: null }],
    body: `
<p>Évora, capital do Alentejo, é uma cidade-museu de muralhas brancas e história milenar. No seu coração ergue-se ainda o Templo Romano, dito "de Diana", com quase dois mil anos.</p>
<h2>Dois mil anos de história</h2>
<p>Romana, depois árabe, depois cristã, Évora guarda uma colecção rara de monumentos: o templo, a Sé gótica, o aqueduto, a universidade fundada pelos Jesuítas em 1559 e a célebre Capela dos Ossos.</p>
<h2>Coração do Alentejo</h2>
<p>Foi muitas vezes residência dos reis e centro do saber. O seu centro histórico é Património Mundial da UNESCO desde 1986.</p>
<h2>Porque importa</h2>
<p>Évora é a memória viva de todos os povos que fizeram Portugal — romanos, árabes e cristãos —, conservada em pedra sob o sol do Alentejo. É a história nacional ao alcance dos olhos.</p>
`.trim(),
  },
  {
    slug: "sagres",
    title: "Sagres",
    category: "Lugares",
    summary: 'O "fim do mundo", no Algarve, onde começaram os Descobrimentos.',
    tags: ["descobrimentos", "Algarve", "mar"],
    infobox: [
      { label: "Região", value: "Algarve" },
      { label: "Cabo", value: "São Vicente — o ponto mais sudoeste da Europa" },
      { label: "Figura", value: "Infante D. Henrique" },
    ],
    sources: [{ label: "Crónica de Guiné, Gomes Eanes de Zurara", url: null }],
    body: `
<p>No extremo sudoeste da Europa, onde a terra acaba e o oceano começa, ergue-se o Cabo de São Vicente e a vila de Sagres. Os antigos chamavam-lhe o <em>fim do mundo</em>.</p>
<h2>Onde nasceram os Descobrimentos</h2>
<p>Foi nesta paisagem de falésias e ventos que o ${lk("infante-dom-henrique", "Infante D. Henrique")} fixou a sua corte e fez de Sagres o centro da actividade dos navegadores que iniciaram a ${lk("era-dos-descobrimentos", "Era dos Descobrimentos")}.</p>
<h2>O cabo sagrado</h2>
<p>Outrora consagrado a um santo cujo corpo, diz a lenda, ali aportou guardado por corvos, o cabo tem hoje o farol mais potente da Europa, a velar sobre uma das rotas marítimas mais movimentadas do mundo.</p>
<h2>Porque importa</h2>
<p>Sagres é o ponto de partida simbólico da aventura que ligou o mundo. Aqui, virado para o Atlântico, Portugal deixou de ver o mar como um limite e passou a vê-lo como um caminho.</p>
`.trim(),
  },
  {
    slug: "batalha-de-alcacer-quibir",
    title: "Batalha de Alcácer-Quibir",
    category: "Eventos",
    summary:
      "O desastre de 1578 que custou a vida ao rei e a independência ao reino.",
    tags: ["batalhas", "1578", "Marrocos"],
    infobox: [
      { label: "Data", value: "4 de Agosto de 1578" },
      { label: "Local", value: "Alcácer-Quibir (Marrocos)" },
      { label: "Também dita", value: "Batalha dos Três Reis" },
      { label: "Consequência", value: "União Ibérica (1580)" },
    ],
    sources: [{ label: "Crónicas do reinado de D. Sebastião", url: null }],
    body: `
<p>A Batalha de Alcácer-Quibir, travada a 4 de Agosto de 1578 em Marrocos, foi um dos maiores desastres da história de Portugal. Nela morreu o rei ${lk("d-sebastiao", "D. Sebastião")} e com ele a flor da nobreza do reino.</p>
<h2>O desastre</h2>
<p>Mal preparada e mal aconselhada, a expedição sebástica enfrentou um exército muito superior. A acção terminou em massacre: três reis morreram nesse dia — por isso é também chamada a "Batalha dos Três Reis".</p>
<h2>Consequências</h2>
<p>Sem rei nem herdeiro, e com a nobreza dizimada ou cativa, Portugal não resistiu: em 1580, Filipe II de Castela tomou a coroa, iniciando sessenta anos de domínio espanhol que só a ${lk("restauracao-da-independencia", "Restauração de 1640")} havia de quebrar.</p>
<h2>Porque importa</h2>
<p>Alcácer-Quibir é a ferida que pôs fim à independência e abriu o ${lk("sebastianismo", "sebastianismo")} — o sonho de que o rei perdido voltaria. Foi o fim de uma era e o início de um mito.</p>
`.trim(),
  },
  {
    slug: "restauracao-da-independencia",
    title: "Restauração da Independência",
    category: "Eventos",
    summary: "O golpe de 1640 que devolveu a Portugal a soberania perdida.",
    tags: ["independência", "1640", "Bragança"],
    infobox: [
      { label: "Data", value: "1 de Dezembro de 1640" },
      { label: "Novo rei", value: "D. João IV (Bragança)" },
      { label: "Fim do domínio", value: "União Ibérica (1580–1640)" },
      { label: "Feriado", value: "Dia da Restauração" },
    ],
    sources: [
      { label: "História de Portugal Restaurado, Luís de Meneses", url: null },
    ],
    body: `
<p>A Restauração da Independência, a 1 de Dezembro de 1640, pôs fim a sessenta anos de domínio espanhol e devolveu a Portugal a sua soberania. É hoje feriado nacional.</p>
<h2>O golpe</h2>
<p>Numa acção decidida, um grupo de nobres — os "Conjurados" — assaltou o Paço da Ribeira, em ${lk("lisboa", "Lisboa")}, derrubou o governo espanhol e aclamou rei o Duque de Bragança, que subiu ao trono como D. João IV.</p>
<h2>A guerra</h2>
<p>A independência teve de ser defendida durante 28 anos de guerra, até que Espanha a reconheceu, em 1668. Portugal voltava a ser senhor do seu destino — e do seu império.</p>
<h2>Porque importa</h2>
<p>A Restauração reparou a perda aberta em ${lk("batalha-de-alcacer-quibir", "Alcácer-Quibir")} e provou a tenacidade de um povo que não aceita deixar de ser nação. É a segunda fundação de Portugal.</p>
`.trim(),
  },
  {
    slug: "sebastianismo",
    title: "Sebastianismo",
    category: "Conceitos",
    summary:
      "O mito do regresso de D. Sebastião — a esperança portugueza num futuro de glória.",
    tags: ["mito", "identidade", "Quinto Império"],
    infobox: [
      { label: "Origem", value: "Após Alcácer-Quibir (1578)" },
      { label: "Figura", value: "D. Sebastião, o Encoberto" },
      { label: "Profetas", value: "Bandarra, Padre António Vieira" },
    ],
    sources: [{ label: "História do Futuro, Padre António Vieira", url: null }],
    body: `
<p>O sebastianismo é o mito messiânico, nascido depois de ${lk("batalha-de-alcacer-quibir", "Alcácer-Quibir")} (1578), de que o rei ${lk("d-sebastiao", "D. Sebastião")} não morreu e voltará, numa manhã de nevoeiro, para restaurar a grandeza de Portugal.</p>
<h2>A esperança do Encoberto</h2>
<p>Privado do rei e da independência, o povo agarrou-se à promessa do "Encoberto". As <em>Trovas</em> do sapateiro Bandarra e os sermões do Padre António Vieira deram-lhe forma de profecia: Portugal seria a sede de um <em>Quinto Império</em> universal.</p>
<h2>Do mito à poesia</h2>
<p>O sebastianismo deixou de ser crença e tornou-se modo de sentir. ${lk("fernando-pessoa", "Fernando Pessoa")} reinventou-o n'${lk("mensagem", "<em>Mensagem</em>")}, fazendo do regresso do rei a metáfora de um futuro espiritual para a pátria.</p>
<h2>Porque importa</h2>
<p>O sebastianismo é a forma portugueza de não desistir: a perspectiva de que, por pior que esteja o presente, o melhor está sempre por vir. É a ${lk("saudade", "saudade")} virada para o futuro.</p>
`.trim(),
  },
  {
    slug: "bacalhau",
    title: "Bacalhau",
    category: "Conceitos",
    summary:
      'O "fiel amigo" — o peixe que se tornou prato nacional de Portugal.',
    tags: ["gastronomia", "mar", "tradição"],
    infobox: [
      { label: "Natureza", value: "Peixe seco e salgado" },
      { label: "Alcunha", value: "Fiel amigo" },
      { label: "Tradição", value: "Mil e uma receitas" },
    ],
    sources: [{ label: "Cozinha tradicional portugueza", url: null }],
    body: `
<p>O bacalhau é o peixe mais portuguez de todos — embora venha de mares distantes. Seco e salgado, é o <em>fiel amigo</em> da mesa nacional, com fama de ter mil e uma maneiras de se cozinhar.</p>
<h2>O fiel amigo</h2>
<p>Já no século XVI, os pescadores portuguezes demandavam os bancos da Terra Nova, ao largo do Canadá, em busca do bacalhau. A actividade da pesca à linha, nos navios da "frota branca", foi durante séculos uma escola de coragem e sacrifício.</p>
<h2>À mesa</h2>
<p>Do Bacalhau à Brás ao Bacalhau com Natas, do Gomes de Sá à consoada de Natal, nenhum alimento une tanto os portuguezes. É comida do dia-a-dia e prato de festa.</p>
<h2>Porque importa</h2>
<p>O bacalhau é identidade feita sabor: liga o mar dos ${lk("era-dos-descobrimentos", "Descobrimentos")} à mesa de cada família. É a prova de que a alma de um povo também se mede pelo que se come em conjunto.</p>
`.trim(),
  },
  {
    slug: "vinho-do-porto",
    title: "Vinho do Porto",
    category: "Conceitos",
    summary: "O vinho licoroso do Douro que leva o nome de Portugal ao mundo.",
    tags: ["gastronomia", "Douro", "vinho"],
    infobox: [
      { label: "Região", value: "Vale do Douro" },
      { label: "Tipo", value: "Vinho generoso (licoroso)" },
      { label: "Demarcação", value: "1756 (Marquês de Pombal)" },
    ],
    sources: [{ label: "Instituto dos Vinhos do Douro e do Porto", url: null }],
    body: `
<p>O Vinho do Porto é um vinho licoroso, doce e encorpado, nascido nas encostas íngremes do Vale do Douro e envelhecido nas caves de Vila Nova de Gaia, frente à cidade do ${lk("porto", "Porto")}, de onde recebeu o nome e por onde foi exportado para o mundo.</p>
<h2>A região mais antiga</h2>
<p>Em 1756, o ${lk("marques-de-pombal", "Marquês de Pombal")} demarcou a Região do Douro para proteger a qualidade e o comércio do vinho — fazendo dela a mais antiga região vinícola demarcada e regulamentada do mundo.</p>
<h2>Do Douro ao mundo</h2>
<p>A actividade vinícola moldou a paisagem de socalcos do Alto Douro, hoje Património Mundial. Apreciado sobretudo por ingleses, o Porto tornou-se um dos grandes embaixadores de Portugal nas mesas de todo o mundo.</p>
<h2>Porque importa</h2>
<p>O Vinho do Porto é trabalho, paisagem e história numa só taça. Do esforço de gerações no Douro nasceu um néctar que leva o nome de Portugal aonde quer que se brinde.</p>
`.trim(),
  },
];

/**
 * Seed: terceira leva de artigos-âncora da Lusopédia (já no molde completo —
 * voz editorial, "Porque importa", interlinks, capas). Idempotente por slug.
 */
export const seedFoundation3 = internalMutation({
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
