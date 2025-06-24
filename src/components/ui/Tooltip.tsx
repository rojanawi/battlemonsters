import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  wide?: boolean;
  imagePreview?: string;
}

export function Tooltip({ 
  content, 
  children, 
  position = 'top', 
  className = '', 
  wide = false,
  imagePreview 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Adjust for viewport boundaries
      if (x < 8) x = 8;
      if (x + tooltipRect.width > viewportWidth - 8) x = viewportWidth - tooltipRect.width - 8;
      if (y < 8) y = 8;
      if (y + tooltipRect.height > viewportHeight - 8) y = viewportHeight - tooltipRect.height - 8;

      setTooltipPosition({ x, y });
    }
  }, [isVisible, position]);

  const getTooltipWidth = () => {
    if (imagePreview) return 'w-80'; // Large for image previews
    if (wide) return 'max-w-md'; // Wider for detailed text
    return 'max-w-xs'; // Default width
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={className}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-4 py-3 text-sm text-white bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-xl pointer-events-none ${getTooltipWidth()}`}
          style={{
            left: '50%',
            bottom: '100%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
          }}
        >
          {imagePreview ? (
            <div className="space-y-3">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-800/50">
                <img
                  src={imagePreview}
                  alt="Action preview"
                  className="w-full h-full object-cover"
                />
              </div>
              {typeof content === 'string' ? (
                <p className="text-center text-gray-200">{content}</p>
              ) : (
                content
              )}
            </div>
          ) : (
            <div className="leading-relaxed">
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900/95 border-gray-600/50 rotate-45 border-r border-b" />
        </div>
      )}
    </div>
  );
}