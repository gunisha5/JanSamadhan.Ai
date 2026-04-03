import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <img
        src="logo\logo1.png"
        alt=""
        className="h-16 w-auto"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          if (!t.src.endsWith('logo.svg')) {
            t.src = '/logo/logo.svg';
            t.onerror = null;
          } else {
            t.style.display = 'none';
            t.nextElementSibling?.classList.remove('hidden');
          }
        }}
      />
      <div
        className="hidden h-12 w-12 shrink-0 rounded-lg bg-gov-primary flex items-center justify-center text-white font-bold text-lg"
        aria-hidden
      >
        JS
      </div>
      {showText && (
        <span className="font-semibold text-gov-primary">
          JanSamadhan<span className="text-gov-accent">.ai</span>
        </span>
      )}
    </motion.div>
  );
}
