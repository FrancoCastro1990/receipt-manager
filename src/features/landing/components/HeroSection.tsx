import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        'bg-gradient-primary rounded-3xl p-8 sm:p-12 text-white text-center',
        className
      )}
    >
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {t('landing.hero.title')}
      </h1>
      <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        {t('landing.hero.subtitle')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/receipts"
          className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
        >
          {t('landing.hero.cta.start')}
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          to="/calendar"
          className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
        >
          <Calendar className="h-5 w-5" />
          {t('landing.hero.cta.calendar')}
        </Link>
      </div>
    </section>
  );
};
