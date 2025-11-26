import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react';
import { compressImage } from '@/lib/fileUtils';

export interface UseImagePickerProps {
  initialPreview?: string | null;
  onImageChange?: (file: File | null, preview: string | null) => void;
}

export interface UseImagePickerReturn {
  imagePreview: string | null;
  isMenuOpen: boolean;
  isMobile: boolean;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  galleryInputRef: React.RefObject<HTMLInputElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  handleCameraCapture: (e: ChangeEvent<HTMLInputElement>) => void;
  handleGallerySelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  triggerCamera: () => void;
  triggerGallery: () => void;
  resetImage: () => void;
}

/**
 * Detects if the current device is a mobile device
 */
const detectMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    'ontouchstart' in window
  );
};

/**
 * useImagePicker Hook
 * Manages image selection from camera or gallery with device-aware options
 */
export const useImagePicker = ({
  initialPreview = null,
  onImageChange,
}: UseImagePickerProps = {}): UseImagePickerReturn => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile] = useState(() => detectMobile());

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Sync initialPreview when it changes externally
  useEffect(() => {
    setImagePreview(initialPreview);
  }, [initialPreview]);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, closeMenu]);

  const processFile = useCallback(
    async (file: File) => {
      const compressedBase64 = await compressImage(file, 600, 600, 0.6);
      setImagePreview(compressedBase64);

      const response = await fetch(compressedBase64);
      const blob = await response.blob();
      const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });

      onImageChange?.(compressedFile, compressedBase64);
    },
    [onImageChange]
  );

  const handleCameraCapture = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile]
  );

  const handleGallerySelect = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile]
  );

  const resetInputs = useCallback(() => {
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    resetInputs();
    onImageChange?.(null, null);
  }, [resetInputs, onImageChange]);

  const triggerCamera = useCallback(() => {
    cameraInputRef.current?.click();
    closeMenu();
  }, [closeMenu]);

  const triggerGallery = useCallback(() => {
    galleryInputRef.current?.click();
    closeMenu();
  }, [closeMenu]);

  const resetImage = useCallback(() => {
    setImagePreview(initialPreview);
    resetInputs();
  }, [initialPreview, resetInputs]);

  return {
    imagePreview,
    isMenuOpen,
    isMobile,
    cameraInputRef,
    galleryInputRef,
    menuRef,
    handleCameraCapture,
    handleGallerySelect,
    handleRemoveImage,
    openMenu,
    closeMenu,
    triggerCamera,
    triggerGallery,
    resetImage,
  };
};
