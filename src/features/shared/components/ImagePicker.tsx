import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useImagePicker } from '../hooks/useImagePicker';

export interface ImagePickerProps {
  imagePreview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
  initialPreview?: string | null;
  className?: string;
}

/**
 * ImagePreviewSection - Displays the selected image with remove button
 */
const ImagePreviewSection: React.FC<{
  preview: string;
  onRemove: () => void;
}> = ({ preview, onRemove }) => {
  const { t } = useTranslation();

  return (
    <div className="relative inline-block">
      <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
      <button
        type="button"
        onClick={onRemove}
        aria-label={t('imagePicker.removeImage')}
        className="absolute -top-2 -right-2 p-1 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

/**
 * ImagePickerButton - Button to open the image source menu
 */
const ImagePickerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg text-primary-500 hover:border-primary-500 hover:bg-primary-50 transition-all"
    >
      <ImageIcon className="h-5 w-5" />
      <span>{t('receipts.form.addImage')}</span>
    </button>
  );
};

/**
 * ImagePickerMenu - Dropdown menu with image source options
 */
const ImagePickerMenu = forwardRef<
  HTMLDivElement,
  {
    isMobile: boolean;
    onCameraClick: () => void;
    onGalleryClick: () => void;
  }
>(({ isMobile, onCameraClick, onGalleryClick }, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="image-picker-menu" role="menu">
      {isMobile && (
        <button
          type="button"
          onClick={onCameraClick}
          className="image-picker-menu-item"
          role="menuitem"
        >
          <Camera className="h-5 w-5" />
          <span>{t('imagePicker.takePhoto')}</span>
        </button>
      )}
      <button
        type="button"
        onClick={onGalleryClick}
        className="image-picker-menu-item"
        role="menuitem"
      >
        <ImageIcon className="h-5 w-5" />
        <span>{isMobile ? t('imagePicker.selectFromGallery') : t('imagePicker.selectFile')}</span>
      </button>
    </div>
  );
});

ImagePickerMenu.displayName = 'ImagePickerMenu';

/**
 * ImagePicker Component
 * Allows users to select images from camera (mobile) or file system
 */
export const ImagePicker: React.FC<ImagePickerProps> = ({
  imagePreview: externalPreview,
  onImageChange,
  initialPreview,
  className,
}) => {
  const {
    isMenuOpen,
    isMobile,
    cameraInputRef,
    galleryInputRef,
    menuRef,
    handleCameraCapture,
    handleGallerySelect,
    handleRemoveImage,
    openMenu,
    triggerCamera,
    triggerGallery,
  } = useImagePicker({ initialPreview, onImageChange });

  return (
    <div className={cn('relative', className)}>
      {/* Hidden camera input (with capture for mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />

      {/* Hidden gallery input (without capture) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleGallerySelect}
        className="hidden"
      />

      {externalPreview ? (
        <ImagePreviewSection preview={externalPreview} onRemove={handleRemoveImage} />
      ) : (
        <ImagePickerButton onClick={openMenu} />
      )}

      {isMenuOpen && (
        <ImagePickerMenu
          ref={menuRef}
          isMobile={isMobile}
          onCameraClick={triggerCamera}
          onGalleryClick={triggerGallery}
        />
      )}
    </div>
  );
};
