import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ParticleConstellation } from '@/components/ParticleConstellation';
import { BOT_CAT_SILHOUETTE } from '@/lib/silhouettes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

interface BotCatSectionProps {
  className?: string;
}

export function BotCatSection({ className }: BotCatSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/app/dashboard');
  };

  return (
    <section
      ref={ref}
      className={`max-w-[1200px] mx-auto py-[60px] px-6 ${className ?? ''}`}
    >
      <motion.div
        className="flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Bot + Cat particle constellation */}
        <motion.div variants={itemVariants} className="max-w-[700px] h-[400px] w-full mx-auto mb-10">
          <ParticleConstellation silhouette={BOT_CAT_SILHOUETTE} className="w-full h-full" />
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants}>
          <Typography variant="display" className="mb-4">
            AI Meets Pet Care
          </Typography>
        </motion.div>

        {/* Body text */}
        <motion.div variants={itemVariants}>
          <Typography variant="body" className="max-w-[560px] mb-8">
            Experience how artificial intelligence transforms pet health monitoring.
            From predictive diagnostics to personalized care plans, PawPal AI keeps
            your furry companion one step ahead.
          </Typography>
        </motion.div>

        {/* CTA Buttons - stack vertically on mobile */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-4">
          <Button variant="outline" onClick={handleNavigate}>
            LOG IN
          </Button>
          <Button variant="primary" onClick={handleNavigate}>
            SIGN UP
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
