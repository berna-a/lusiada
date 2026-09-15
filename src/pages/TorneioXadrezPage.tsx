import InscricaoXadrez from "@/pages/InscricaoXadrez";
import TorneioEventPage from "@/pages/TorneioEventPage";

export default function TorneioXadrezPage() {
  return (
    <TorneioEventPage
      event={{
        caminho: "/xadrez",
        descricao:
          "Torneio Aberto de Xadrez da Associação Memória Lusíada: 24 de Outubro de 2026, na Biblioteca de Marvila.",
        imagemCartaz: "/eventos-marvila/xadrez-qtrack.jpg",
        imagemSocial: "/eventos-marvila/xadrez-story.jpg",
        interesse: "#inscricao",
        modalidade: "Xadrez",
        nome: "Torneio Aberto de Xadrez",
        preço: "3 EUR · ingresso",
        programa: [
          { hora: "10h–14h", titulo: "Convívio" },
          { hora: "14h–15h30", titulo: "Torneio suíço" },
          { hora: "15h30", titulo: "Medalhas" },
        ],
        subtitulo: "Uma manhã para jogar, pensar e conviver.",
        tituloSeo: "Torneio Aberto de Xadrez — LUSÍADA",
        textoInteresse: "Inscrever-me",
      }}
    >
      <InscricaoXadrez />
    </TorneioEventPage>
  );
}
