/**
 * Os episódios mais estudados d'Os Lusíadas — factos: onde estão no poema,
 * o que acontece, quem são as figuras e o que a história documenta.
 * A interpretação continua a ser da comunidade, nos feeds de anotação.
 *
 * Limites de estrofe verificados no texto do próprio repositório.
 */
export type Episodio = {
  slug: string;
  nome: string;
  canto: number;
  cantoRomano: string;
  /** Intervalo de estrofes, como o poema o delimita. */
  estrofes: string;
  /** Estrofe a que os links de leitura apontam. */
  estrofeInicial: number;
  /** Uma frase — usada na listagem e na meta description. */
  sinopse: string;
  /** O que acontece, por ordem. */
  enredo: string[];
  /** Verso de abertura mais conhecido, citado do texto. */
  citacao: { versos: string[]; ref: string };
  /** Factos de contexto — histórico, mitológico ou de composição. */
  contexto: { titulo: string; texto: string }[];
};

export const EPISODIOS: Episodio[] = [
  {
    slug: "ines-de-castro",
    nome: "Inês de Castro",
    canto: 3,
    cantoRomano: "III",
    estrofes: "118 a 135",
    estrofeInicial: 118,
    sinopse:
      "A morte de Inês de Castro por ordem de D. Afonso IV, contada por Vasco da Gama ao rei de Melinde.",
    enredo: [
      "O episódio surge dentro da narrativa que Vasco da Gama faz da história de Portugal ao rei de Melinde, logo depois de contar a vitória do Salado.",
      "Inês de Castro vive nos campos do Mondego, amada pelo príncipe D. Pedro, que por ela recusa outros casamentos.",
      "D. Afonso IV, pai de D. Pedro, pressionado pelo povo e pelos conselheiros, decide matá-la para separar o filho dela.",
      "Inês é levada perante o rei e suplica pela vida, invocando os filhos que teria de deixar órfãos. O rei comove-se e quer perdoá-la.",
      "Os executores insistem e matam-na. O episódio termina com as lágrimas das ninfas do Mondego transformadas na fonte que passou a chamar-se dos Amores.",
      "Na estrofe seguinte à do fim do episódio, o poema conta que D. Pedro, ao subir ao trono, se vingou dos homicidas.",
    ],
    citacao: {
      versos: [
        "Estavas, linda Inês, posta em sossego,",
        "De teus anos colhendo doce fruto,",
        "Naquele engano da alma, ledo e cego,",
        "Que a fortuna não deixa durar muito,",
      ],
      ref: "Canto III, estrofe 120",
    },
    contexto: [
      {
        titulo: "O facto histórico",
        texto:
          "Inês de Castro, dama galega da corte, foi morta em Coimbra em 1355, por decisão de D. Afonso IV. D. Pedro I subiu ao trono em 1357 e mandou executar dois dos responsáveis. A tradição de que Inês teria sido coroada depois de morta não está documentada nas fontes contemporâneas — Camões chama-lhe «a que depois de ser morta foi Rainha».",
      },
      {
        titulo: "Onde está no poema",
        texto:
          "É o episódio mais longo da narrativa histórica do Canto III e o que lhe dá o remate. Não interrompe a viagem: é Gama quem o conta, em discurso directo, ao rei de Melinde.",
      },
    ],
  },
  {
    slug: "velho-do-restelo",
    nome: "O Velho do Restelo",
    canto: 4,
    cantoRomano: "IV",
    estrofes: "94 a 104",
    estrofeInicial: 94,
    sinopse:
      "Na praia do Restelo, no momento da partida da armada, um velho ergue a voz contra a aventura marítima.",
    enredo: [
      "A armada está prestes a partir de Lisboa para a Índia. A praia do Restelo enche-se de gente a despedir-se.",
      "Entre a multidão, um velho de aspecto venerável levanta a voz, abanando a cabeça.",
      "O seu discurso abre com a invectiva contra a glória e a fama, e prossegue contra a ambição que leva os homens ao mar.",
      "Enumera os perigos e as mortes que a navegação já causou, e pergunta por que razão não se combate antes o inimigo que está perto, em África.",
      "Termina amaldiçoando o primeiro que se fez ao mar, invocando os exemplos mitológicos de Prometeu e de Faetonte.",
      "O canto acaba com estas palavras: o discurso do velho é a última coisa que se ouve antes de a frota partir.",
    ],
    citacao: {
      versos: [
        "— «Ó glória de mandar! Ó vã cobiça",
        "Desta vaidade, a quem chamamos Fama!",
        "Ó fraudulento gosto, que se atiça",
        "C'uma aura popular, que honra se chama!",
      ],
      ref: "Canto IV, estrofe 95",
    },
    contexto: [
      {
        titulo: "Quem é o Velho",
        texto:
          "O poema não lhe dá nome nem identidade — é apenas «um velho d'aspeito venerando», surgido do meio da multidão. Não volta a aparecer.",
      },
      {
        titulo: "Onde está no poema",
        texto:
          "Fecha o Canto IV. A narração do Canto V retoma no ponto em que a frota já partiu, deixando o discurso sem resposta dentro da acção.",
      },
    ],
  },
  {
    slug: "adamastor",
    nome: "O Adamastor",
    canto: 5,
    cantoRomano: "V",
    estrofes: "37 a 60",
    estrofeInicial: 37,
    sinopse:
      "No Cabo das Tormentas, um gigante ergue-se do mar e profetiza desgraças aos que ali passarem.",
    enredo: [
      "A armada navega junto ao Cabo das Tormentas quando o céu escurece com uma nuvem negra e pesada.",
      "Da nuvem forma-se uma figura gigantesca, de aspecto disforme e voz medonha, que se levanta sobre os navios.",
      "O gigante repreende a ousadia dos navegadores por quebrarem os limites que ninguém tinha ultrapassado.",
      "Profetiza os naufrágios e as desgraças que hão-de atingir as futuras armadas portuguesas naquelas águas.",
      "Vasco da Gama pergunta-lhe quem é. O gigante identifica-se como um dos Titãs, transformado em rochedo por amar a ninfa Tétis, que o enganou.",
      "Acabada a história, desfaz-se com um grande choro e desaparece.",
    ],
    citacao: {
      versos: [
        "— «Ó gente ousada, mais que quantas",
        "No mundo cometeram grandes cousas,",
        "Tu, que por guerras cruas, tais e tantas,",
        "E por trabalhos vãos nunca repousas,",
      ],
      ref: "Canto V, estrofe 41",
    },
    contexto: [
      {
        titulo: "O Cabo",
        texto:
          "O Cabo das Tormentas foi dobrado por Bartolomeu Dias em 1488 e rebaptizado Cabo da Boa Esperança. Vasco da Gama passou-o em Novembro de 1497, na viagem que o poema narra.",
      },
      {
        titulo: "Uma figura inventada por Camões",
        texto:
          "O Adamastor não vem da mitologia clássica herdada: é uma criação de Camões, construída com materiais da tradição greco-latina — a raça dos Titãs, o amor não correspondido, a metamorfose em pedra.",
      },
    ],
  },
  {
    slug: "ilha-dos-amores",
    nome: "A Ilha dos Amores",
    canto: 9,
    cantoRomano: "IX",
    estrofes: "a partir da 52, continuando no Canto X",
    estrofeInicial: 52,
    sinopse:
      "Vénus prepara uma ilha no meio do oceano para receber os navegadores no regresso da Índia.",
    enredo: [
      "Concluída a missão em Calecute, a frota faz-se ao mar de regresso a Portugal.",
      "Vénus, para recompensar os navegadores, faz mover uma ilha pelo oceano até ao caminho das naus, e depois fixa-a quando os marinheiros a avistam.",
      "Os portugueses desembarcam e encontram as Ninfas, que Vénus ali colocou.",
      "Segue-se o encontro entre os navegadores e as Ninfas; a Tétis cabe Vasco da Gama.",
      "No Canto X, já na ilha, Tétis mostra a Gama, em visão, os feitos futuros dos portugueses no Oriente, e depois a «Máquina do Mundo» — o universo segundo o saber da época.",
      "Terminada a visão, a frota parte da ilha e regressa a Portugal. O poema fecha com o poeta a dirigir-se a D. Sebastião.",
    ],
    citacao: {
      versos: [
        "De longe a Ilha viram fresca e bela,",
        "Que Vénus pelas ondas lha levava",
        "(Bem como o vento leva branca vela)",
        "Para onde a forte armada se enxergava;",
      ],
      ref: "Canto IX, estrofe 52",
    },
    contexto: [
      {
        titulo: "Onde está no poema",
        texto:
          "É o último grande episódio d'Os Lusíadas: começa na segunda metade do Canto IX e ocupa boa parte do Canto X, incluindo as profecias de Tétis e a visão da Máquina do Mundo.",
      },
      {
        titulo: "Não corresponde a nenhum facto da viagem",
        texto:
          "Ao contrário dos outros episódios, a Ilha dos Amores não tem correspondência na viagem histórica de Vasco da Gama — é matéria inteiramente do plano mitológico do poema.",
      },
    ],
  },
];

export const EPISODIO_POR_SLUG = new Map(EPISODIOS.map((e) => [e.slug, e]));
