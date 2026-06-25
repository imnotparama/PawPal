import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Typography } from '@/components/ui/Typography';
import { ParticleConstellation } from '@/components/ParticleConstellation';
import { DOG_SILHOUETTE } from '@/lib/silhouettes';

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

interface DogSectionProps {
  className?: string;
}

export function DogSection({ className }: DogSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
        {/* Dog particle constellation */}
        <motion.div variants={itemVariants} className="max-w-[600px] h-[450px] w-full mx-auto mb-10">
          <ParticleConstellation silhouette={DOG_SILHOUETTE} className="w-full h-full" />
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants}>
          <Typography variant="display" className="mb-4">
            Smart Care for Every Breed
          </Typography>
        </motion.div>

        {/* Body text */}
        <motion.div variants={itemVariants}>
          <Typography variant="body" className="max-w-[560px]">
            Our AI-powered symptom detection analyzes your dog's behavior and health
            signals in real time, helping you catch issues early and keep your
            companion happy and healthy.
          </Typography>
        </motion.div>
      </motion.div>
    </section>
  );
}
