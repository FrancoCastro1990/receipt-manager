import React from 'react';
import { Plus } from 'lucide-react';

export interface FloatingAddButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

/**
 * FloatingAddButton Component
 * A floating action button (FAB) that triggers the add receipt modal
 */
export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onClick,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="fab-button"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
};
