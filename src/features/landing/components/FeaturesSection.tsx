import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt, BarChart3, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { FeatureCard } from './FeatureCard';

export interface FeaturesSectionProps {
  className?: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <section className={cn('py-12', className)}>
      <h2 className="text-2xl font-bold text-primary-900 text-center mb-8">
        {t('landing.features.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Receipt className="h-6 w-6" />}
          title={t('landing.features.receipts.title')}
          description={t('landing.features.receipts.description')}
          bgColor="bg-primary-100"
          iconColor="text-primary-600"
        />
        <FeatureCard
          icon={<BarChart3 className="h-6 w-6" />}
          title={t('landing.features.analytics.title')}
          description={t('landing.features.analytics.description')}
          bgColor="bg-secondary-100"
          iconColor="text-secondary-600"
        />
        <FeatureCard
          icon={<Calendar className="h-6 w-6" />}
          title={t('landing.features.calendar.title')}
          description={t('landing.features.calendar.description')}
          bgColor="bg-accent-100"
          iconColor="text-accent-600"
        />
      </div>
    </section>
  );
};
