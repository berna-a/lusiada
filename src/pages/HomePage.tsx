import { AdesaoSection } from "@/components/home/AdesaoSection";
import { CalcadaFooter } from "@/components/home/CalcadaFooter";
import { EmFocoSection } from "@/components/home/EmFocoSection";
import { HeroFullscreen } from "@/components/home/HeroFullscreen";
import { MemoriaVivaSection } from "@/components/home/MemoriaVivaSection";
import { SobreSection } from "@/components/home/SobreSection";

export default function HomePage() {
  return (
    <div>
      <HeroFullscreen />
      <main>
        <MemoriaVivaSection />
        <SobreSection />
        <EmFocoSection />
        <AdesaoSection />
      </main>
      <CalcadaFooter />
    </div>
  );
}
