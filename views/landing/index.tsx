import Nav from "@/widgets/nav";
import Ticker from "@/widgets/ticker";
import Hero from "@/widgets/hero";
import StatsStrip from "@/widgets/stats-strip";
import Manifesto from "@/widgets/manifesto";
import FeaturesGrid from "@/widgets/features-grid";
import SkillsLeaderboard from "@/widgets/skills-leaderboard";
import DemandTrend from "@/widgets/demand-trend";
import Personas from "@/widgets/personas";
import FaqSection from "@/widgets/faq-section";
import FinalCta from "@/widgets/final-cta";
import SiteFooter from "@/widgets/site-footer";

export default function LandingView() {
  return (
    <main className="relative text-[color:var(--text)] grain">
      <Ticker />
      <Nav />
      <Hero />
      <StatsStrip />
      <Manifesto />
      <FeaturesGrid />
      <SkillsLeaderboard />
      <DemandTrend />
      <Personas />
      <FaqSection />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
