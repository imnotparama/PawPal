import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DogSection } from '@/components/DogSection';
import { BotCatSection } from '@/components/BotCatSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-void">
      <Navigation />
      <HeroSection />
      <DogSection />
      <BotCatSection />
    </div>
  );
}
