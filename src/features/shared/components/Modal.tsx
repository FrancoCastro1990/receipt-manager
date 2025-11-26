import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal Component
 * A reusable modal dialog that renders in a portal with backdrop,
 * accessibility features, and body scroll prevention.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const titleId = useId();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="modal-overlay" onClick={onClose} aria-hidden="true" />

      {/* Container */}
      <div
        className="modal-container"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Panel */}
        <div className={cn('modal-panel', className)}>
          {/* Header */}
          <div className="modal-header">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
};
