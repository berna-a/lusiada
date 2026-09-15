import { ArrowRight, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";

type MetodoPagamento = "mbway" | "dinheiro";

type InscricaoEventoProps = {
  evento: string;
  modalidade: string;
  pago?: boolean;
};

const CONTACTO = "bernardo@alusiada.pt";

export default function InscricaoEvento({
  evento,
  modalidade,
  pago = false,
}: InscricaoEventoProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telemovel, setTelemovel] = useState("");
  const [metodoPagamento, setMetodoPagamento] =
    useState<MetodoPagamento>("mbway");
  const [erroContacto, setErroContacto] = useState("");

  function prepararInscricao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const telemovelLimpo = telemovel.trim();

    if (!(emailLimpo || telemovelLimpo)) {
      setErroContacto("Indique um número de telemóvel ou um email.");
      return;
    }

    setErroContacto("");

    const assunto = `Inscrição — ${evento} · 24 de Outubro de 2026`;
    const corpo = [
      "Olá,",
      "",
      `Quero inscrever-me no ${evento}, a 24 de Outubro de 2026, na Biblioteca de Marvila.`,
      `Nome: ${nomeLimpo}`,
      ...(telemovelLimpo ? [`Telemóvel: ${telemovelLimpo}`] : []),
      ...(emailLimpo ? [`Email: ${emailLimpo}`] : []),
      ...(pago
        ? [
            `Método de pagamento: ${metodoPagamento === "mbway" ? "MB WAY" : "Dinheiro"}`,
            "Valor: 3 €",
          ]
        : []),
      "",
      ...(pago
        ? [
            "Peço a confirmação da inscrição e, se aplicável, os dados para pagamento por MB WAY.",
          ]
        : ["Peço a confirmação da inscrição."]),
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
          {modalidade} · {pago ? "3 € de ingresso" : "participação gratuita"}
        </p>
        <h2 className="mt-5 max-w-[820px] font-black font-body text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
          Inscrição
        </h2>
        <p className="mt-6 max-w-[760px] font-body text-[#f7edd6]/80 text-lg leading-relaxed">
          Indica o teu nome e pelo menos um contacto. A inscrição é preparada
          por email e só fica confirmada depois da resposta da Associação.
        </p>

        <div
          className={`mt-12 grid gap-10 ${pago ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-[0.72fr_1.28fr]"}`}
        >
          <div className="border border-[#f7edd6]/30 bg-[#f7edd6]/10 p-6 sm:p-8">
            <h3 className="font-black font-body text-2xl">
              {pago ? "Pagamento" : "Participação"}
            </h3>
            {pago ? (
              <div className="mt-4 space-y-5 font-body text-[#f7edd6]/80 leading-relaxed">
                <p>
                  O ingresso custa{" "}
                  <strong className="text-[#f7edd6]">3 €</strong>.
                </p>
                <p>
                  Pode pagar por{" "}
                  <strong className="text-[#f7edd6]">MB WAY</strong> — o
                  contacto de pagamento é enviado por resposta à inscrição — ou
                  em <strong className="text-[#f7edd6]">dinheiro</strong> até ao
                  dia do evento.
                </p>
                <p className="border-[#ef4b2d] border-l-4 pl-4 font-bold text-[#f7edd6]">
                  A inscrição só fica confirmada após o pagamento.
                </p>
              </div>
            ) : (
              <p className="mt-4 font-body text-[#f7edd6]/80 leading-relaxed">
                A participação no Evento de Go é gratuita. Não é necessário
                qualquer pagamento.
              </p>
            )}
          </div>

          <form
            className="border-2 border-[#f7edd6] bg-[#f7edd6] p-6 text-[#081f42] sm:p-8"
            onSubmit={prepararInscricao}
          >
            <h3 className="font-black font-body text-2xl uppercase">
              Quero inscrever-me
            </h3>
            <label
              className="mt-7 block font-body font-bold text-sm"
              htmlFor="evento-nome"
            >
              Nome
            </label>
            <input
              autoComplete="name"
              className="mt-2 w-full border-2 border-[#073c78] bg-white px-4 py-3 font-body text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-2"
              id="evento-nome"
              onChange={(event) => setNome(event.target.value)}
              required
              type="text"
              value={nome}
            />
            <p className="mt-6 font-body font-bold text-sm">
              Contacto{" "}
              <span className="font-normal">(indique pelo menos um)</span>
            </p>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="font-body font-bold text-sm"
                  htmlFor="evento-telemovel"
                >
                  Telemóvel
                </label>
                <input
                  autoComplete="tel"
                  className="mt-2 w-full border-2 border-[#073c78] bg-white px-4 py-3 font-body text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-2"
                  id="evento-telemovel"
                  inputMode="tel"
                  onChange={(event) => setTelemovel(event.target.value)}
                  type="tel"
                  value={telemovel}
                />
              </div>
              <div>
                <label
                  className="font-body font-bold text-sm"
                  htmlFor="evento-email"
                >
                  Email
                </label>
                <input
                  autoComplete="email"
                  className="mt-2 w-full border-2 border-[#073c78] bg-white px-4 py-3 font-body text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-2"
                  id="evento-email"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </div>
            </div>
            {erroContacto ? (
              <p
                className="mt-3 font-body font-bold text-[#a82712] text-sm"
                role="alert"
              >
                {erroContacto}
              </p>
            ) : null}

            {pago ? (
              <fieldset className="mt-6">
                <legend className="font-body font-bold text-sm">
                  Como pretende pagar?
                </legend>
                <div className="mt-3 flex flex-wrap gap-6 font-body">
                  <label className="flex items-center gap-2">
                    <input
                      checked={metodoPagamento === "mbway"}
                      name="evento-metodo-pagamento"
                      onChange={() => setMetodoPagamento("mbway")}
                      type="radio"
                      value="mbway"
                    />
                    MB WAY
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      checked={metodoPagamento === "dinheiro"}
                      name="evento-metodo-pagamento"
                      onChange={() => setMetodoPagamento("dinheiro")}
                      type="radio"
                      value="dinheiro"
                    />
                    Dinheiro
                  </label>
                </div>
              </fieldset>
            ) : null}

            <button
              className="mt-7 inline-flex items-center gap-2 bg-[#c73216] px-6 py-4 font-black font-body text-sm text-white uppercase tracking-[0.1em] hover:bg-[#a82712] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#073c78] focus-visible:outline-offset-3"
              type="submit"
            >
              <Mail aria-hidden="true" size={18} />
              Preparar inscrição por email
              <ArrowRight aria-hidden="true" size={18} />
            </button>
            <p className="mt-4 font-body text-[#081f42]/70 text-sm leading-relaxed">
              Revê e envia a mensagem na tua aplicação de email. Os dados não
              são guardados no site antes desse envio.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
