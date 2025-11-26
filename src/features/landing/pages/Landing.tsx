import type React from 'react';
import { cn } from '@/lib/cn';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';

export interface LandingProps {
  className?: string;
}

export const Landing: React.FC<LandingProps> = ({ className = '' }) => {
  return (
    <div className={cn('container-page', className)}>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};
