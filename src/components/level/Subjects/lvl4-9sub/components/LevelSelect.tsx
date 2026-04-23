import { motion } from 'motion/react';

type Props = {
  onSelect: (level: 'upper_primary' | 'junior_secondary') => void;
};

export default function LevelSelect({ onSelect }: Props) {
  const levels = [
    { id: 'upper_primary', label: 'Upper Primary' },
    { id: 'junior_secondary', label: 'Junior Secondary' }
  ] as const;

  return (
      <div className="mlearn-selection-bg flex-col">
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative sm:absolute sm:top-12 sm:left-1/2 sm:-translate-x-1/2 z-20 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight whitespace-nowrap mb-12 sm:mb-0"
        >
          Select Your Level
        </motion.h1>

        <div className="relative z-10 flex flex-col justify-center w-full max-w-5xl">
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-24 w-fit mx-auto items-start">
            {levels.map((level, index) => {
              let alignClass = 'self-start';
              if (index === 1) alignClass = 'self-start ml-8 sm:ml-16 md:ml-32';

              return (
                  <motion.button
                      key={level.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                      onClick={() => onSelect(level.id)}
                      className={`mlearn-outline-btn text-[9vw] sm:text-6xl md:text-7xl lg:text-[90px] ${alignClass}`}
                  >
                    {level.label}
                  </motion.button>
              );
            })}
          </div>
        </div>
      </div>
  );
}
