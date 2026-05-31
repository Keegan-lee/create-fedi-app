import { CliDemoSection } from '../../components/landing/CliDemoSection';
import { FeaturesSection } from '../../components/landing/FeaturesSection';
import { FediExplainerSection } from '../../components/landing/FediExplainerSection';
import { HeroSection } from '../../components/landing/HeroSection';
import { ModulesSection } from '../../components/landing/ModulesSection';
import { SiteFooter } from '../../components/landing/SiteFooter';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <CliDemoSection />
        <ModulesSection />
        <FediExplainerSection />
      </main>
      <SiteFooter />
    </>
  );
}
