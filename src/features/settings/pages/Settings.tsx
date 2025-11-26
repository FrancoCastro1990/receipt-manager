import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/features/shared';
import { useSettings } from '../hooks';
import { SettingsForm } from '../components';

export interface SettingsPageProps {
  className?: string;
}

/**
 * Settings Page
 * Main page for the settings feature - displays the settings form
 */
export const Settings: React.FC<SettingsPageProps> = ({ className }) => {
  const { t } = useTranslation();
  const { settings, isLoading, error, updateSettings, isUpdating } = useSettings();

  if (isLoading) {
    return (
      <div className={cn('container-page', className)}>
        <div className="flex items-center justify-center py-20">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"
            role="status"
            aria-label={t('common.loading')}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('container-page', className)}>
        <div className="bg-error-50 border border-error-200 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-error-700 mb-2">
            {t('settings.error.loading')}
          </h2>
          <p className="text-error-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('container-page', className)}>
      <PageHeader
        icon={<SettingsIcon className="h-8 w-8" />}
        title={t('settings.title')}
        description={t('settings.description')}
      />

      {/* Settings Form */}
      <div className="max-w-2xl mx-auto">
        <SettingsForm
          settings={settings}
          onSubmit={updateSettings}
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
};
