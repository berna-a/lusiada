import { CalendarDays } from "lucide-react";
import { EmBreve } from "@/components/arca/EmBreve";

export default function CalendarioPage() {
  return (
    <EmBreve
      detail="Os grandes dias, as grandes batalhas e as grandes vidas — celebrados ao longo do ano com a gravidade de quem sabe o que deve a quem veio antes."
      icon={CalendarDays}
      intro="As datas e efemérides que marcam o ano português."
      title="Calendário"
    />
  );
}
