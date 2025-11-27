import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/features/shared';
import { useReceiptsPage } from '../hooks';
import {
  TabsContainer,
  ReceiptsTab,
  StatisticsTab,
  FloatingAddButton,
  AddReceiptModal,
} from '../components';

export interface ReceiptsPageProps {
  className?: string;
}

/**
 * Receipts Page
 * Main page for the receipts feature with tabs for receipts list and statistics
 */
export const Receipts: React.FC<ReceiptsPageProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  const {
    // Data
    stats,
    isLoading,
    error,

    // Tabs
    activeTab,
    setActiveTab,

    // Filtered receipts (Tab Boletas)
    filteredReceipts,
    filteredCount,
    filteredAmount,
    filterPreset,
    filterCustomRange,
    handleFilterChange,

    // Analytics (Tab Statistics)
    analyticsPreset,
    analyticsCustomRange,
    dateRangeStats,
    totalProfit,
    todayProfit,
    profitPercentage,
    handleAnalyticsChange,

    // Modal
    isModalOpen,
    modalState,
    modalMode,
    editingReceipt,
    modalErrorMessage,
    isModalSubmitting,
    openModal,
    openEditModal,
    closeModal,
    handleModalSubmit,
    handleAddAnother,
    handleFinish,
    handleRetry,
    resetFormRef,

    // Mutations
    deleteReceipt,
  } = useReceiptsPage();

  if (isLoading) {
    return (
      <div className={cn('container-page', className)}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('container-page', className)}>
        <div className="bg-error-50 border border-error-200 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-error-700 mb-2">
            {t('receipts.error.loading')}
          </h2>
          <p className="text-error-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('container-page', className)}>
      <PageHeader
        icon={<Receipt className="h-8 w-8" />}
        title={t('receipts.title')}
        description={t('receipts.description')}
      />

      <TabsContainer activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'receipts' ? (
          <ReceiptsTab
            receipts={filteredReceipts}
            filteredCount={filteredCount}
            filteredAmount={filteredAmount}
            selectedPreset={filterPreset}
            customRange={filterCustomRange}
            onPresetChange={handleFilterChange}
            onEditReceipt={openEditModal}
            onDeleteReceipt={deleteReceipt}
          />
        ) : (
          <StatisticsTab
            stats={stats}
            dateRangeStats={dateRangeStats}
            totalProfit={totalProfit}
            todayProfit={todayProfit}
            profitPercentage={profitPercentage}
            selectedPreset={analyticsPreset}
            customRange={analyticsCustomRange}
            onPresetChange={handleAnalyticsChange}
          />
        )}
      </TabsContainer>

      {/* FAB gradient backdrop for visual separation */}
      <div className="fab-backdrop" aria-hidden="true" />

      {/* FAB for adding receipts */}
      <FloatingAddButton
        onClick={openModal}
        ariaLabel={t('receipts.fab.ariaLabel')}
      />

      {/* Add/Edit receipt modal */}
      <AddReceiptModal
        isOpen={isModalOpen}
        modalState={modalState}
        modalMode={modalMode}
        editingReceipt={editingReceipt}
        errorMessage={modalErrorMessage}
        isSubmitting={isModalSubmitting}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onAddAnother={handleAddAnother}
        onFinish={handleFinish}
        onRetry={handleRetry}
        resetFormRef={resetFormRef}
      />
    </div>
  );
};
