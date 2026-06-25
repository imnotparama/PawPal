import { motion } from 'framer-motion';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ParticleConstellation } from '@/components/ParticleConstellation';
import { CAT_SILHOUETTE } from '@/lib/silhouettes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={`min-h-[500px] md:min-h-screen grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-[1200px] mx-auto px-6 pt-16 ${className ?? ''}`}
    >
      {/* Left column: text content + CTA */}
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Typography variant="eyebrow">AI-Powered Pet Health Companion</Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="display" className="text-[48px] md:text-[78px]">
            Your Pet's Health, Reimagined
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="body" className="max-w-[480px]">
            Harness the power of AI to monitor your pet's health, track
            vaccinations, and get real-time insights — all in one place.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button variant="primary" size="lg">
            GET STARTED
          </Button>
        </motion.div>
      </motion.div>

      {/* Right column: particle constellation */}
      <div className="h-[500px] min-h-[400px]">
        <ParticleConstellation silhouette={CAT_SILHOUETTE} className="w-full h-full" />
      </div>
    </section>
  );
}
