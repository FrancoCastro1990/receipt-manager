import { useState, useCallback, useMemo } from 'react';

export type ReceiptsTabId = 'receipts' | 'statistics';

export interface UseTabsNavigationReturn {
  activeTab: ReceiptsTabId;
  setActiveTab: (tab: ReceiptsTabId) => void;
  isReceiptsTab: boolean;
  isStatisticsTab: boolean;
}

/**
 * useTabsNavigation Hook
 * Manages tab navigation state for the receipts page
 */
export const useTabsNavigation = (
  initialTab: ReceiptsTabId = 'receipts'
): UseTabsNavigationReturn => {
  const [activeTab, setActiveTabState] = useState<ReceiptsTabId>(initialTab);

  const setActiveTab = useCallback((tab: ReceiptsTabId) => {
    setActiveTabState(tab);
  }, []);

  const { isReceiptsTab, isStatisticsTab } = useMemo(
    () => ({
      isReceiptsTab: activeTab === 'receipts',
      isStatisticsTab: activeTab === 'statistics',
    }),
    [activeTab]
  );

  return {
    activeTab,
    setActiveTab,
    isReceiptsTab,
    isStatisticsTab,
  };
};
