import React, { useState, useRef } from 'react';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update mouse position relative to viewport
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsVisible(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getTooltipStyles = () => {
    // Position tooltip directly below the mouse cursor
    const baseStyles = {
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y + 10}px`, // Just 10px below cursor
      transform: 'translateX(-50%)', // Center horizontally on cursor
    };

    if (imagePreview) {
      return {
        ...baseStyles,
        width: '320px',
        maxWidth: 'none'
      };
    }
    if (wide) {
      return {
        ...baseStyles,
        width: '300px',
        maxWidth: 'none'
      };
    }
    return {
      ...baseStyles,
      width: '300px',
      maxWidth: 'none'
    };
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={className}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className="fixed z-50 px-4 py-3 text-sm text-white bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-xl pointer-events-none"
          style={getTooltipStyles()}
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
        </div>
      )}
    </div>
  );
}