
import React, { useState, useRef, ReactNode, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    const offset = 8; // Minimal offset

    switch (position) {
      case 'top':
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - offset;
        break;
      case 'right':
        top = rect.right + offset;
        left = rect.left + rect.width + offset;
        break;
    }

    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  const getTransform = () => {
    switch (position) {
      case 'top': return '-translate-x-1/2 -translate-y-full';
      case 'bottom': return '-translate-x-1/2';
      case 'left': return '-translate-x-full -translate-y-1/2';
      case 'right': return '-translate-y-1/2';
      default: return '';
    }
  };

  const handleMouseEnter = () => {
    // Only allow hover behavior on devices that support true hovering (e.g., mouse)
    // This prevents tooltips from appearing and getting stuck on touch devices.
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsVisible(true);
    }
  };

  return (
    <div 
      ref={triggerRef}
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(false)}
    >
      {children}
      {isVisible && createPortal(
        <div 
          style={{ 
            position: 'fixed', 
            top: coords.top, 
            left: coords.left, 
            zIndex: 99999,
            pointerEvents: 'none'
          }}
          className={`transition-opacity duration-150 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${getTransform()}`}
        >
          <div className="bg-black border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded shadow-xl whitespace-nowrap">
            {content}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
