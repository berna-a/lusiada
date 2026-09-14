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
        interesse:
          "mailto:bernardo@alusiada.pt?subject=Torneio%20de%20Xadrez%20%E2%80%94%2024%20de%20Outubro%20de%202026",
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
      }}
    />
  );
}
