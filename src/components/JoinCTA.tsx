import { Link } from "react-router-dom";

type JoinCTAProps = {
  lead?: string;
  label?: string;
  to?: string;
};

/** Botão de chamada à acção "Junta-te" (carmim), com texto opcional por cima. */
export function JoinCTA({
  lead,
  label = "Junta-te",
  to = "/aderir",
}: JoinCTAProps) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {lead && (
        <p className="font-display text-[22px] text-primary leading-[1.3] sm:text-[26px]">
          {lead}
        </p>
      )}
      <Link
        className="inline-flex items-center justify-center rounded-full px-10 py-4 font-display text-[15px] text-white uppercase tracking-[0.2em] transition-all hover:brightness-110"
        style={{
          backgroundColor: "hsl(351 62% 34%)",
          boxShadow:
            "0 6px 20px hsl(351 62% 20% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
        }}
        to={to}
      >
        {label}
      </Link>
    </div>
  );
}
