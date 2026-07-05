import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function Reference({
  children,
  title,
  source,
}: {
  children: React.ReactNode;
  title: string;
  source: string;
}) {
  return (
    <HoverCard closeDelay={80} openDelay={120}>
      <HoverCardTrigger asChild>
        <span className="cursor-help underline decoration-accent/40 decoration-dotted underline-offset-4 transition-colors hover:decoration-accent">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        className="w-72 rounded-2xl border border-accent/30 bg-background/95 p-4 shadow-xl backdrop-blur"
        side="top"
      >
        <p className="font-display text-[11px] text-accent uppercase tracking-[0.18em]">
          {title}
        </p>
        <p className="mt-2 font-body text-[13px] text-foreground leading-relaxed">
          {source}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[17px] text-foreground/90 leading-[1.85]">
      {children}
    </p>
  );
}

export default function ManifestoPage() {
  return (
    <article
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <header className="text-center">
        <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.25em]">
          Associação Lusíada
        </p>
        <h1 className="mt-4 font-display text-[40px] text-primary leading-[1.1] sm:text-[56px]">
          Manifesto Lusíada
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </header>

      <div className="mt-16 space-y-7">
        <p className="text-center font-display text-[22px] text-primary italic leading-[1.4] sm:text-[26px]">
          <Reference
            source="Primeiro verso do poema épico Os Lusíadas, de Luiz Vaz de Camões (1572)."
            title="Os Lusíadas — Canto I, 1"
          >
            As Armas e os Barões assinalados.
          </Reference>
        </p>

        <P>
          Assim começa o livro maior da nossa língua. Assim começa a história
          que nos fez. Antes de qualquer outra coisa que se diga, é por aqui que
          se começa — e se há um <em>No princípio</em> Portuguez, é este.
        </P>

        <P>
          Os Barões são os nossos antepassados. As Armas são as suas obras. E
          nós, hoje, somos o que eles deixaram.
        </P>

        <P>
          Olha à volta, Portuguez. A terra que te abriga e te alimenta, foi-te
          dada. A língua em que pensas e amas, foi-te dada. A água que bebes
          corre por canais que outros abriram. O ar que respiras é o de uma
          pátria que outros guardaram com a vida. As cidades onde vives foram
          erguidas pedra a pedra por gerações que nunca conheceste. Os costumes
          que herdaste, o conhecimento que te chega, o tempo de paz e de fartura
          em que vives — tudo isto te foi entregue por mãos que já não podes
          apertar.
        </P>

        <P>
          E há ainda aquele fogo que arde sem se ver — a coisa invisível que faz
          com que a terra se chame Portugal e o povo se chame Portuguez. Esse
          fogo não cai do céu. Foi aceso, foi mantido, foi passado de geração em
          geração pelas mãos dos que vieram antes. Aceso por D. Afonso Henriques
          em Ourique. Mantido por Nuno Álvares em Aljubarrota. Imortalizado por
          Camões. Sonhado por Vieira. Reencontrado por Pessoa. E pelos milhões
          de outros, anónimos, cujos nomes ninguém escreveu mas cujas vidas
          seguraram o fio.
        </P>

        <P>
          Tudo isto, Portuguez, é tua herança. Não é cenário. Não é folclore.
          Não é coisa garantida. É a vida que te coube — e que recebeste de
          graça.
        </P>

        <P>Mas há um perigo. E o perigo é antigo, e tem nome.</P>

        <P>
          Chama-se o Abismo do Eterno Esquecimento. É o lugar de onde a memória
          não volta.
        </P>

        <P>
          A memória não cai de uma vez. Desfia-se. Vai-se perdendo aos poucos,
          dia a dia, sem ninguém dar por isso, até que um dia chega o tombo — e
          nesse dia, percebe-se tarde demais o que se perdeu. Aconteceu-nos já.
          Em 1755, ardeu Lisboa e ardeu com ela um arquivo inteiro de séculos.
          Ardeu a Torre do Tombo. Ardeu memória que ninguém pôde recuperar. E o
          que ardeu então, ardeu para sempre.
        </P>

        <P>
          Hoje, sem fogo, sem terramoto, sem catástrofe visível, está a arder
          outra vez.
        </P>

        <P>
          Olha para os teus filhos, Portuguez, e diz-me se reconheces neles a
          tua herança. Os jovens crescem com menos contacto à sua própria
          cultura do que qualquer geração antes deles. A esfera digital ocupou o
          lugar da esfera humana — e na esfera digital, o que é Portuguez quase
          não vive. Crescem desinteressados de uma herança que não lhes foi
          mostrada. Crescem ignorantes de uma riqueza que não lhes foi entregue.
          E o que ninguém recebe, ninguém transmite.
        </P>

        <P>
          Olha para os teus avós, Portuguez. Milhões deles envelhecem e morrem,
          desvanecendo-se sozinhos para o mesmo abismo, levando consigo
          histórias que ninguém escreveu, vidas inteiras que se apagam sem
          deixar rasto. Cada velho que morre sem ser ouvido é uma biblioteca que
          arde em silêncio.
        </P>

        <P>
          Olha para a tua geração. Milhões partem em busca de uma vida melhor.
          Os economistas explicarão isto com salários e oportunidades — e terão
          parte da razão. Mas há uma parte que não explicam: partem mais
          facilmente os que se sentem menos enraizados. Quem não conhece a sua
          herança, não sente que abandona nada. Quem não foi tocado pela sua
          cultura, leva-a por inteiro num bilhete de avião.
        </P>

        <P>
          Um povo que se esquece de si vende o que tem sem saber o que vende. Um
          povo sem memória não tem posteridade.
        </P>

        <P>
          E há ainda algo de mais fundo. Algo que atravessa todas as feridas
          anteriores e as torna mais agudas.
        </P>

        <P>
          O homem contemporâneo está só. As suas casas estão cheias de objectos
          e vazias de gente. Os seus dias são feitos de ecrãs e os seus laços,
          de mensagens. Há uma pandemia silenciosa, e chama-se solidão.
        </P>

        <P>
          O homem contemporâneo está cego. Aprendeu a medir tudo o que se mede,
          e por isso deixou de ver o que não se mede. Os afectos, as raízes, o
          sagrado, o sentido — tudo isto se tornou invisível porque se tornou
          incalculável. Vive entre coisas, e as coisas não bastam.
        </P>

        <P>
          O homem contemporâneo está mutilado. Foi-lhe dito que só a razão é
          digna, e por isso desaprendeu a intuição, a aspiração, o sonho que vê
          longe. A alma que era natureza nele tornou-se suspeita.
        </P>

        <P>
          Estes três males não são ideias. São o retrato de uma vida que muitos
          de nós já vivemos sem reconhecer. E é desta vida que nos pedem para
          nos contentarmos.
        </P>

        <P>Nós não nos contentamos.</P>

        <P>
          A Associação Lusíada existe para isto: para guardar a memória de
          Portugal e garantir a sua posteridade. Para honrar o passado que
          recebemos, cultivar o presente que somos, edificar o futuro que
          deixaremos. Não é nostalgia. É serviço. Não é exaltação. É trabalho.
          Não é o sonho de voltar atrás. É a decisão consciente de não deixar
          arder o que ainda pode ser salvo.
        </P>

        <P>
          Vamos construir uma Arca onde qualquer Portuguez possa depositar a
          memória da sua família — e tê-la guardada, encriptada, transmitida aos
          seus por gerações. Vamos honrar os Heróis Portuguezes num Panteão que
          os devolva à consciência de quem os esqueceu. Vamos cartografar os
          lugares onde Portugal aconteceu, e ensinar a cada Portuguez a
          geografia da sua própria alma. Vamos celebrar os grandes dias, as
          grandes batalhas, as grandes vidas — não com nostalgia, mas com a
          gravidade de quem sabe o que deve a quem veio antes. Vamos abrir
          centros onde se faça nova arte Portugueza, novos azulejos, novas
          músicas, novas obras — porque um povo que só guarda morre, e um povo
          que só cria sem raiz erra. Vamos juntar académicos, artistas,
          voluntários, jovens e velhos, em sete núcleos por todo o país, em
          torno de uma só coisa: Portugal não acabou.
        </P>

        <p className="text-center font-display text-[22px] text-primary italic leading-[1.4] sm:text-[26px]">
          A Lusíada é o fogo que arde sem se ver.
        </p>

        <P>
          Não é nome. Não é símbolo. É a essência que guiou os nossos
          antepassados nos seus feitos — dos maiores que ainda hoje se cantam
          aos mais pequenos que ninguém escreveu. É o que faz com que um
          pescador da Nazaré, um pastor da Beira, uma costureira do Porto, um
          filósofo de Coimbra e um navegador do Algarve sejam, todos eles, a
          mesma coisa: Portuguezes. Camões deu-lhe forma. Pessoa deu-lhe nome
          novo. Vieira anunciou-lhe o destino. Mas o fogo é mais antigo do que
          eles. E é mais novo, porque arde ainda — em ti, neste momento, mesmo
          que não saibas.
        </P>

        <P>
          Servir a Memória e a Posteridade de Portugal é reacender esse fogo em
          cada Portuguez. É devolver a cada um a sua herança e o orgulho de a
          transmitir. É romper com o esquecimento, com o isolamento, com a
          cegueira, com a mutilação. É lembrar — e lembrar é, etimologicamente,
          trazer de volta ao membro, fazer membro outra vez, religar.
        </P>

        <P>Portuguezes, estamos a tempo. Mas não estamos com tempo a perder.</P>

        <p className="pt-4 text-center font-display text-[28px] text-accent leading-[1.2] sm:text-[36px]">
          <Reference
            source="Último verso do poema A Mensagem, de Fernando Pessoa (1934)."
            title="Mensagem — Nevoeiro"
          >
            É a hora!
          </Reference>
        </p>
      </div>

      <div className="mt-20 flex justify-center">
        <Link
          className="inline-flex items-center justify-center rounded-full px-10 py-4 font-display text-[15px] text-white uppercase tracking-[0.2em] transition-all hover:brightness-110"
          style={{
            backgroundColor: "hsl(351 62% 34%)",
            boxShadow:
              "0 6px 20px hsl(351 62% 20% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
          }}
          to="/aderir"
        >
          Junta-te
        </Link>
      </div>
    </article>
  );
}
