import { ArrowRight, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";

type Metodo = "mbway" | "transferencia";

const CONTACTO = "bernardo@alusiada.pt";

// Os dados oficiais são adicionados aqui depois de confirmação pela Associação.
const MBWAY: string | null = null;
const IBAN: string | null = null;

export default function InscricaoXadrez() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("mbway");
  const [mensagem, setMensagem] = useState("");

  function prepararMensagem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const assunto = "Pedido de inscrição — Torneio de Xadrez · 24 Outubro 2026";
    const corpo = [
      "Olá,",
      "",
      "Quero pedir a inscrição no Torneio Aberto de Xadrez de 24 de Outubro de 2026.",
      `Nome: ${nome.trim()}`,
      `Email: ${email.trim()}`,
      `Método de pagamento pretendido: ${metodo === "mbway" ? "MB WAY" : "Transferência bancária"}`,
      "Valor: 3 €",
      ...(mensagem.trim() ? [`Mensagem: ${mensagem.trim()}`] : []),
      "",
      "Aguardo as instruções de pagamento e a confirmação da inscrição.",
    ].join("\n");

    window.location.href = `mailto:${CONTACTO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  }

  return (
    <section
      className="bg-[#073c78] px-6 py-24 text-[#f7edd6] lg:px-12 lg:py-32"
      id="inscricao"
    >
      <div className="mx-auto max-w-[1120px]">
        <p className="font-black font-body text-[#ef4b2d] text-sm uppercase tracking-[0.22em]">
          Xadrez · 3 € de ingresso
        </p>
        <h2 className="mt-5 max-w-[820px] font-black font-body text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
          Inscrição e pagamento
        </h2>
        <p className="mt-6 max-w-[760px] font-body text-[#f7edd6]/80 text-lg leading-relaxed">
          Escolhe MB WAY ou transferência bancária e prepara uma mensagem com os
          teus dados. Receberás as instruções de pagamento por resposta da
          Associação; o pedido não é uma inscrição confirmada.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="border border-[#f7edd6]/30 bg-[#f7edd6]/10 p-6">
              <h3 className="font-black font-body text-2xl">MB WAY</h3>
              <p className="mt-2 font-body text-[#f7edd6]/75 leading-relaxed">
                {MBWAY ?? "Número enviado por resposta ao pedido de inscrição."}
              </p>
            </div>
            <div className="border border-[#f7edd6]/30 bg-[#f7edd6]/10 p-6">
              <h3 className="font-black font-body text-2xl">
                Transferência bancária
              </h3>
              <p className="mt-2 font-body text-[#f7edd6]/75 leading-relaxed">
                {IBAN ?? "IBAN enviado por resposta ao pedido de inscrição."}
              </p>
            </div>
            <p className="font-body text-[#f7edd6]/65 text-sm leading-relaxed">
              Se precisas de outra forma de pagamento, escreve para{" "}
              <a
                className="underline underline-offset-4"
                href={`mailto:${CONTACTO}`}
              >
                {CONTACTO}
              </a>
              .
            </p>
          </div>

          <form
            className="border-2 border-[#f7edd6] bg-[#f7edd6] p-6 text-[#081f42] sm:p-8"
            onSubmit={prepararMensagem}
          >
            <h3 className="font-black font-body text-2xl uppercase">
              Pedir inscrição
            </h3>
            <label
              className="mt-7 block font-body font-bold text-sm"
              htmlFor="xadrez-nome"
            >
              Nome
            </label>
            <input
              autoComplete="name"
              className="mt-2 w-full border-2 border-[#073c78] bg-white px-4 py-3 font-body text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-2"
              id="xadrez-nome"
              onChange={(event) => setNome(event.target.value)}
              required
              type="text"
              value={nome}
            />
            <label
              className="mt-5 block font-body font-bold text-sm"
              htmlFor="xadrez-email"
            >
              Email
            </label>
            <input
              autoComplete="email"
              className="mt-2 w-full border-2 border-[#073c78] bg-white px-4 py-3 font-body text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-2"
              id="xadrez-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            <fieldset className="mt-6">
              <legend className="font-body font-bold text-sm">
                Método de pagamento pretendido
              </legend>
              <div className="mt-3 flex flex-wrap gap-6 font-body">
                <label className="flex items-center gap-2">
                  <input
                    checked={metodo === "mbway"}
                    name="xadrez-metodo"
                    onChange={() => setMetodo("mbway")}
                    type="radio"
                    value="mbway"
                  />
                  MB WAY
                </label>
                <label className="flex items-center gap-2">
                  <input
                    checked={metodo === "transferencia"}
                    name="xadrez-metodo"
                    onChange={() => setMetodo("transferencia")}
                    type="radio"
                    value="transferencia"
                  />
                  Transferência
                </label>
              </div>
            </fieldset>
            <label
              className="mt-6 block font-body font-bold text-sm"
              htmlFor="xadrez-mensagem"
            >
              Mensagem (opcional)
            </label>
            <textarea
              className="mt-2 min-h-24 w-full border-2 border-[#073c78] bg-white px-4 py-3 font-body text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-2"
              id="xadrez-mensagem"
              onChange={(event) => setMensagem(event.target.value)}
              value={mensagem}
            />
            <button
              className="mt-6 inline-flex items-center gap-2 bg-[#c73216] px-6 py-4 font-black font-body text-sm text-white uppercase tracking-[0.1em] hover:bg-[#a82712] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#073c78] focus-visible:outline-offset-3"
              type="submit"
            >
              <Mail aria-hidden="true" size={18} />
              Abrir e-mail de inscrição
              <ArrowRight aria-hidden="true" size={18} />
            </button>
            <p className="mt-4 font-body text-[#081f42]/70 text-sm leading-relaxed">
              Revê e envia a mensagem na tua aplicação de e-mail. A Associação
              responderá com os dados de pagamento; aguarda confirmação antes de
              considerar a inscrição concluída.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
