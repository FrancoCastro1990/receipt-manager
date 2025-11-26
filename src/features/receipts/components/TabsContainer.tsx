import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

export type ReceiptsTabId = 'receipts' | 'statistics';

export interface TabsContainerProps {
  activeTab: ReceiptsTabId;
  onTabChange: (tab: ReceiptsTabId) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * TabsContainer Component
 * Navigation container for switching between receipts and statistics tabs
 */
export const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  onTabChange,
  children,
  className,
}) => {
  const { t } = useTranslation();

  const tabs: { id: ReceiptsTabId; label: string }[] = [
    { id: 'receipts', label: t('receipts.tabs.receipts') },
    { id: 'statistics', label: t('receipts.tabs.statistics') },
  ];

  return (
    <div className={cn(className)}>
      {/* Tab buttons */}
      <div className="tabs-nav" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'tab-button',
              activeTab === tab.id && 'tab-button-active'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="mt-6" role="tabpanel" id={`${activeTab}-panel`}>
        {children}
      </div>
    </div>
  );
};
