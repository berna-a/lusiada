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
    slug: "egas-moniz",
    title: "Egas Moniz",
    category: "Pessoas",
    summary:
      "O primeiro Prémio Nobel português — neurologista e inventor da angiografia cerebral.",
    tags: ["ciência", "medicina", "Nobel"],
    infobox: [
      { label: "Nascimento", value: "29 de Novembro de 1874, Avanca" },
      { label: "Morte", value: "13 de Dezembro de 1955, Lisboa" },
      { label: "Nobel", value: "Medicina, 1949" },
      { label: "Contributo", value: "Angiografia cerebral" },
    ],
    sources: [{ label: "Comité Nobel — biografia, 1949", url: null }],
    body: `
<p>António Egas Moniz (1874–1955) foi o primeiro português a ganhar um Prémio Nobel. Neurologista, professor e político, deixou um contributo duradouro à medicina — e um legado também marcado pela controvérsia.</p>
<h2>Ver o cérebro</h2>
<p>O seu feito maior foi a <em>angiografia cerebral</em>: uma técnica que, injectando um contraste, permitiu pela primeira vez ver os vasos sanguíneos do cérebro numa radiografia. Revolucionou o diagnóstico neurológico e ainda hoje é fundamental.</p>
<h2>O Nobel e a sombra</h2>
<p>O Nobel de 1949 foi-lhe atribuído pela leucotomia pré-frontal, uma cirurgia então vista como tratamento para doenças mentais graves. O tempo revelou-a um procedimento drástico e hoje abandonado — e a distinção é, por isso, discutida. A angiografia, essa, permanece como a sua grande herança.</p>
<h2>Porque importa</h2>
<p>Egas Moniz pôs Portugal no mapa da ciência mundial e formou-se em ${lk("coimbra", "Coimbra")}. A sua história lembra que o progresso médico é feito de avanços geniais — e também de erros que cabe à ciência corrigir.</p>
`.trim(),
  },
  {
    slug: "nazare",
    title: "Nazaré",
    category: "Lugares",
    summary:
      "A vila piscatória das sete saias — hoje capital mundial das ondas gigantes.",
    tags: ["mar", "surf", "tradição"],
    infobox: [
      { label: "Distrito", value: "Leiria" },
      { label: "Fenómeno", value: "Canhão submarino da Nazaré" },
      { label: "Recorde", value: "Maiores ondas surfadas do mundo" },
    ],
    sources: [{ label: "Tradições marítimas da Nazaré", url: null }],
    body: `
<p>A Nazaré é uma vila de pescadores da costa atlântica, célebre pelas suas tradições — as mulheres das <em>sete saias</em>, o peixe a secar ao sol — e, hoje, conhecida no mundo inteiro pelas suas ondas colossais.</p>
<h2>O canhão e as ondas</h2>
<p>Ao largo da praia do Norte, um profundo canhão submarino concentra a energia do oceano e gera, no inverno, ondas que podem ultrapassar os 25 metros. Desde 2011, surfistas de todo o mundo vêm aqui partir, vezes sem conta, o recorde da maior onda alguma vez surfada.</p>
<h2>Fé e mar</h2>
<p>No alto do Sítio, a lenda de Nossa Senhora da Nazaré — que terá salvo um cavaleiro de cair da falésia — fez do lugar um santuário antigo. Em baixo, a vida sempre foi a pesca, dura e perigosa, que moldou o carácter da sua gente.</p>
<h2>Porque importa</h2>
<p>A Nazaré une o Portugal antigo dos pescadores ao Portugal que hoje desafia o oceano. É o lugar onde o mar, que sempre deu e tirou à vila, se tornou também palco de uma proeza mundial.</p>
`.trim(),
  },
  {
    slug: "braga",
    title: "Braga",
    category: "Lugares",
    summary:
      "A cidade dos arcebispos — uma das mais antigas do país, capital do Minho.",
    tags: ["cidade", "religião", "Minho"],
    infobox: [
      { label: "Origem", value: "Bracara Augusta (romana)" },
      { label: "Ex-líbris", value: "Santuário do Bom Jesus do Monte" },
      { label: "Título", value: "Sé Primaz das Espanhas" },
    ],
    sources: [{ label: "História eclesiástica de Braga", url: null }],
    body: `
<p>Braga é uma das cidades mais antigas de Portugal, fundada pelos romanos como <em>Bracara Augusta</em>. Centro religioso do país desde os primórdios, ganhou o cognome de "Roma portugueza" pela densidade das suas igrejas.</p>
<h2>A cidade dos arcebispos</h2>
<p>A sua Sé Catedral é a mais antiga do país, e o arcebispo de Braga ostenta o título de Primaz. Foi daqui que se organizou boa parte da vida da Igreja na península, e a sua Semana Santa é das mais imponentes de Portugal.</p>
<h2>O escadório do Bom Jesus</h2>
<p>Nos arredores, o Santuário do Bom Jesus do Monte ergue-se no topo de um espectacular escadório barroco, com fontes e capelas — uma obra-prima Património Mundial, símbolo da devoção e da arte do Norte.</p>
<h2>Porque importa</h2>
<p>Braga guarda dois mil anos de história, do fórum romano à fé barroca. É a alma religiosa e histórica do Minho — e, hoje, também uma das cidades mais jovens e dinâmicas do país.</p>
`.trim(),
  },
  {
    slug: "bocage",
    title: "Bocage",
    category: "Pessoas",
    summary:
      "O poeta da sátira e do improviso — génio boémio do fim do século XVIII.",
    tags: ["literatura", "poesia", "século XVIII"],
    infobox: [
      { label: "Nascimento", value: "15 de Setembro de 1765, Setúbal" },
      { label: "Morte", value: "21 de Dezembro de 1805, Lisboa" },
      { label: "Obra", value: "Sonetos; sátiras" },
    ],
    sources: [{ label: "Rimas, Bocage", url: null }],
    body: `
<p>Manuel Maria Barbosa du Bocage (1765–1805) é um dos poetas mais populares de Portugal — tanto pelos seus sonetos perfeitos como pela lenda da sua boémia e da sua língua afiada.</p>
<h2>O génio do soneto</h2>
<p>Mestre absoluto do soneto, Bocage escreveu versos de grande beleza lírica sobre o amor, a desilusão e a morte, anunciando já o Romantismo. O seu próprio epitáfio — "Aqui jaz o moço Elmano" — é célebre.</p>
<h2>A sátira e a lenda</h2>
<p>Mas foi a sátira mordaz que o fez famoso entre o povo: dele se contam mil histórias de improvisos cortantes contra poderosos e tolos. A sua irreverência valeu-lhe a prisão da Inquisição. Vida curta e intensa, morreu aos 40 anos.</p>
<h2>Porque importa</h2>
<p>Bocage é a voz mais livre da poesia portugueza do seu tempo — capaz da maior ternura e da maior insolência. Continua vivo na memória popular como o poeta do engenho rápido e da palavra sem medo.</p>
`.trim(),
  },
  {
    slug: "guerra-colonial",
    title: "Guerra Colonial",
    category: "Eventos",
    summary:
      "Os treze anos de guerra em África que abalaram o império e o regime (1961–1974).",
    tags: ["século XX", "guerra", "império"],
    infobox: [
      { label: "Período", value: "1961–1974" },
      { label: "Frentes", value: "Angola, Guiné, Moçambique" },
      { label: "Fim", value: "Revolução de 25 de Abril de 1974" },
    ],
    sources: [{ label: "Arquivos da Defesa Nacional", url: null }],
    body: `
<p>A Guerra Colonial — ou Guerra do Ultramar — foi o conflito que opôs Portugal aos movimentos de independência das suas colónias africanas, entre 1961 e 1974. Foi a guerra mais longa e custosa da história recente do país.</p>
<h2>Três frentes em África</h2>
<p>Travou-se em três territórios — Angola, Guiné e Moçambique —, onde o Estado Novo recusava reconhecer a inevitável descolonização que o resto da Europa fazia. Centenas de milhares de jovens portugueses foram mobilizados, e muitos não voltaram.</p>
<h2>O peso que rompeu o regime</h2>
<p>A guerra consumia recursos, isolava Portugal no mundo e desgastava o exército. Foi entre os capitães que dela regressavam que nasceu o descontentamento que conduziu ao ${lk("25-de-abril-de-1974", "25 de Abril de 1974")} — e à independência das colónias.</p>
<h2>Porque importa</h2>
<p>A Guerra Colonial marcou uma geração e fechou cinco séculos de império. Da sua ferida nasceram a democracia portuguesa e novos países de língua portugueza — e laços que hoje a ${lk("lusofonia", "lusofonia")} procura honrar.</p>
`.trim(),
  },
  {
    slug: "cante-alentejano",
    title: "Cante Alentejano",
    category: "Arte",
    summary:
      "O canto coral do Alentejo, sem instrumentos — Património Imaterial da Humanidade.",
    tags: ["música", "Alentejo", "tradição"],
    infobox: [
      { label: "Região", value: "Alentejo" },
      { label: "Forma", value: "Canto coral a duas vozes, sem instrumentos" },
      { label: "Reconhecimento", value: "Património Imaterial (UNESCO, 2014)" },
    ],
    sources: [{ label: "Cancioneiro popular alentejano", url: null }],
    body: `
<p>O Cante Alentejano é uma forma de canto coral única no mundo: grupos de homens (e, hoje, também de mulheres) cantam em conjunto, sem qualquer instrumento, melodias lentas e graves nascidas da imensa planície do Alentejo.</p>
<h2>A voz da planície</h2>
<p>O cante organiza-se em vozes próprias — o <em>ponto</em>, que inicia, o <em>alto</em>, que sobe, e o coro que sustenta. Das suas letras falam o trabalho do campo, o amor, a saudade e a terra. É uma música feita de paciência e de horizonte.</p>
<h2>Património da Humanidade</h2>
<p>Em 2014, a UNESCO inscreveu o Cante Alentejano na lista do Património Cultural Imaterial da Humanidade, reconhecendo-o como expressão maior da identidade de uma região e de um povo.</p>
<h2>Porque importa</h2>
<p>O Cante é a alma sonora do Alentejo — uma forma de estar e de resistir, cantada em coro nas tabernas e nas festas. Prova que a mais profunda das artes pode nascer apenas de vozes humanas reunidas.</p>
`.trim(),
  },
  {
    slug: "vieira-da-silva",
    title: "Vieira da Silva",
    category: "Pessoas",
    summary:
      "A maior pintora portuguesa do século XX — mestra dos labirintos e da luz.",
    tags: ["arte", "pintura", "século XX"],
    infobox: [
      { label: "Nascimento", value: "13 de Junho de 1908, Lisboa" },
      { label: "Morte", value: "6 de Março de 1992, Paris" },
      { label: "Estilo", value: "Abstracção; espaços e labirintos" },
    ],
    sources: [{ label: "Catálogo da Fundação Arpad Szenes-Vieira da Silva", url: null }],
    body: `
<p>Maria Helena Vieira da Silva (1908–1992) é a mais célebre pintora portuguesa e uma das grandes figuras da arte europeia do século XX. A partir de Paris, conquistou um lugar entre os maiores da pintura moderna.</p>
<h2>Os labirintos da luz</h2>
<p>A sua obra é inconfundível: telas onde linhas, planos e pequenos quadrados se multiplicam em labirintos vertiginosos, cidades imaginárias e espaços que parecem ao mesmo tempo abrir-se e fechar-se. É uma abstracção feita de profundidade e de luz.</p>
<h2>De Lisboa ao mundo</h2>
<p>Nascida em ${lk("lisboa", "Lisboa")}, viveu grande parte da vida em França, com o pintor Arpad Szenes. Foi a primeira mulher a receber o Grande Prémio Nacional das Artes francês. A sua fundação, em Lisboa, guarda hoje a sua obra.</p>
<h2>Porque importa</h2>
<p>Vieira da Silva levou o nome de Portugal ao centro da arte mundial. As suas telas, que tantos reconhecem sem saber o nome, são das mais originais visões do espaço alguma vez pintadas.</p>
`.trim(),
  },
  {
    slug: "salgueiro-maia",
    title: "Salgueiro Maia",
    category: "Pessoas",
    summary:
      "O capitão de Abril — o rosto sereno e corajoso da Revolução de 1974.",
    tags: ["século XX", "democracia", "25 de Abril"],
    infobox: [
      { label: "Nascimento", value: "1 de Julho de 1944, Castelo de Vide" },
      { label: "Morte", value: "4 de Abril de 1992, Santarém" },
      { label: "Feito", value: "Liderou a coluna sobre Lisboa em 25/4/1974" },
    ],
    sources: [{ label: "Relatos do 25 de Abril", url: null }],
    body: `
<p>Fernando José Salgueiro Maia (1944–1992) é um dos heróis do ${lk("25-de-abril-de-1974", "25 de Abril")}. Capitão de Abril, foi o militar que conduziu a coluna decisiva sobre ${lk("lisboa", "Lisboa")} e tornou a Revolução possível sem banho de sangue.</p>
<h2>A madrugada de Abril</h2>
<p>Na noite de 24 para 25 de Abril de 1974, partiu de Santarém à frente de uma coluna da Escola Prática de Cavalaria. Ocupou o Terreiro do Paço e cercou o Quartel do Carmo, onde se refugiava o governo. Sereno e firme, evitou que a tensão se tornasse derramamento de sangue.</p>
<h2>O herói sem ambição</h2>
<p>Recusou cargos e privilégios, regressou à vida discreta de oficial e morreu cedo, doente e modesto. Tornou-se, por isso, o símbolo mais puro da Revolução: a coragem ao serviço da liberdade, sem sede de poder.</p>
<h2>Porque importa</h2>
<p>Salgueiro Maia é a face ética do 25 de Abril — a prova de que a democracia portuguesa nasceu da coragem de homens que arriscaram tudo e nada pediram em troca.</p>
`.trim(),
  },
  {
    slug: "adesao-de-portugal-a-cee",
    title: "Adesão de Portugal à CEE",
    category: "Eventos",
    summary:
      "A entrada na Europa, em 1986 — a grande viragem do Portugal democrático.",
    tags: ["século XX", "Europa", "democracia"],
    infobox: [
      { label: "Assinatura", value: "12 de Junho de 1985, Lisboa" },
      { label: "Entrada em vigor", value: "1 de Janeiro de 1986" },
      { label: "Significado", value: "Integração na Comunidade Europeia" },
    ],
    sources: [{ label: "Tratado de Adesão, 1985", url: null }],
    body: `
<p>A adesão de Portugal à Comunidade Económica Europeia, em 1986, foi uma das mais decisivas viragens da sua história contemporânea. Depois de séculos virado para o mar e para o império, o país escolheu, em democracia, o seu lugar na Europa.</p>
<h2>Da revolução à Europa</h2>
<p>Doze anos após o ${lk("25-de-abril-de-1974", "25 de Abril")}, e sob o impulso do governo de ${lk("mario-soares", "Mário Soares")}, o tratado foi assinado no Mosteiro dos Jerónimos. Era a consolidação da jovem democracia e a aposta na modernização do país.</p>
<h2>Transformar o país</h2>
<p>A integração trouxe fundos para estradas, escolas e indústria, abriu mercados e ancorou Portugal nas instituições europeias. Mudou profundamente a economia, as cidades e o modo de vida de uma geração.</p>
<h2>Porque importa</h2>
<p>A adesão à Europa fechou o ciclo aberto pela Revolução: Portugal tornava-se, de pleno direito, uma democracia europeia moderna. Foi a escolha que mais transformou o país nas últimas décadas.</p>
`.trim(),
  },
  {
    slug: "ponte-25-de-abril",
    title: "Ponte 25 de Abril",
    category: "Lugares",
    summary:
      "A grande ponte vermelha sobre o Tejo — ex-líbris moderno de Lisboa.",
    tags: ["Lisboa", "engenharia", "símbolos"],
    infobox: [
      { label: "Inauguração", value: "6 de Agosto de 1966" },
      { label: "Sobre", value: "O rio Tejo, em Lisboa" },
      { label: "Nome original", value: "Ponte Salazar (até 1974)" },
    ],
    sources: [{ label: "Memória descritiva da obra, 1966", url: null }],
    body: `
<p>A Ponte 25 de Abril é a grande ponte suspensa que liga ${lk("lisboa", "Lisboa")} à margem sul do Tejo. Pela cor e pela forma, é muitas vezes comparada à Golden Gate de São Francisco, e tornou-se um dos símbolos modernos da capital.</p>
<h2>Atravessar o Tejo</h2>
<p>Inaugurada em 1966, foi uma proeza de engenharia: durante anos, a maior ponte suspensa da Europa. Veio substituir os barcos que durante séculos faziam a travessia do rio, unindo enfim as duas margens.</p>
<h2>De um nome a outro</h2>
<p>Chamava-se então Ponte Salazar, em honra do ditador. Na noite do ${lk("25-de-abril-de-1974", "25 de Abril")}, populares arrancaram as letras do nome do regime e, em pouco tempo, a ponte passou a ostentar a data da liberdade.</p>
<h2>Porque importa</h2>
<p>A ponte é, ao mesmo tempo, obra de engenharia e símbolo político: o seu próprio nome conta a passagem da ditadura à democracia. Atravessá-la é cruzar, todos os dias, um pedaço da história de Portugal.</p>
`.trim(),
  },
];

/**
 * Seed: oitava leva de artigos-âncora da Lusopédia (canon rumo aos ~100).
 * Mesmo molde: voz editorial, "Porque importa", interlinks, capas, grafia
 * Portuguez. Idempotente por slug.
 */
export const seedFoundation8 = internalMutation({
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
