import { HeroSection } from "@/components/home/HeroSection";
import { EventsCarousel } from "@/components/home/EventsCarousel";
import { AboutSection } from "@/components/home/AboutSection";
import { JoinSection } from "@/components/home/JoinSection";
import { SupportSection } from "@/components/home/SupportSection";
import { ExploreArcaSection } from "@/components/home/ExploreArcaSection";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <div className="-m-6 md:-m-10">
      <HeroSection />
      <EventsCarousel />
      <AboutSection />
      <JoinSection />
      <SupportSection />
      <ExploreArcaSection />
      <StatsSection />
    </div>
  );
}
