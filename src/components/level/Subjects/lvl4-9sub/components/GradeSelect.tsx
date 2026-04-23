import { motion } from 'motion/react';

type Props = {
    level: 'upper_primary' | 'junior_secondary';
    onSelect: (grade: number) => void;
    onBack: () => void;
};

export default function GradeSelect({ level, onSelect}: Props) {
    const grades = level === 'upper_primary' ? [4, 5, 6] : [7, 8, 9];

    return (
        <div className="mlearn-selection-bg flex-col">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative sm:absolute sm:top-12 sm:left-1/2 sm:-translate-x-1/2 z-20 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight whitespace-nowrap mb-12 sm:mb-0"
            >
                Select Your Grade
            </motion.h1>

            <div className="relative z-10 flex flex-col justify-center w-full max-w-5xl">
                <div className="flex flex-col gap-10 sm:gap-12 md:gap-16 w-fit mx-auto items-start">
                    {grades.map((grade, index) => {
                        let alignClass = 'self-start';
                        if (index === 1) alignClass = 'self-start ml-12 sm:ml-24 md:ml-32';
                        if (index === 2) alignClass = 'self-start ml-24 sm:ml-48 md:ml-64';

                        return (
                            <motion.button
                                key={grade}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                                onClick={() => onSelect(grade)}
                                className={`mlearn-outline-btn text-[11vw] sm:text-7xl md:text-8xl lg:text-[110px] ${alignClass}`}
                            >
                                {grade}th Grade
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
