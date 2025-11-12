import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  startIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, startIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleFocusTrap);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, currentIndex, images.length, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    if (currentIndex > 0) {
      preloadImage(images[currentIndex - 1]);
    }
    if (currentIndex < images.length - 1) {
      preloadImage(images[currentIndex + 1]);
    }
  }, [currentIndex, images, isOpen]);

  if (!isOpen || images.length === 0) return null;

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100]"
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-95"
        onClick={handleBackdropClick}
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 transition-all shadow-lg hover:shadow-xl"
        >
          <X className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
        </button>

        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-base font-medium pointer-events-none">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        <div
          className="relative flex items-center justify-center p-4 md:p-8 max-w-full max-h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            className="max-w-full max-h-full object-contain select-none"
            style={{ maxWidth: '100vw', maxHeight: '100vh' }}
            draggable={false}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                aria-label="Previous image"
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-gray-900" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-gray-900" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
