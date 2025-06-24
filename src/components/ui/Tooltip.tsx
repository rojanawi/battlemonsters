import React, { useState } from 'react';

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

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 px-4 py-3 text-sm text-white bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-xl pointer-events-none transition-opacity duration-200";
    
    let positionClasses = "";
    let arrowClasses = "";
    
    switch (position) {
      case 'top':
        positionClasses = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
        arrowClasses = "after:absolute after:top-full after:left-1/2 after:transform after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900/95";
        break;
      case 'bottom':
        positionClasses = "top-full left-1/2 transform -translate-x-1/2 mt-2";
        arrowClasses = "before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900/95";
        break;
      case 'left':
        positionClasses = "right-full top-1/2 transform -translate-y-1/2 mr-2";
        arrowClasses = "after:absolute after:left-full after:top-1/2 after:transform after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-gray-900/95";
        break;
      case 'right':
        positionClasses = "left-full top-1/2 transform -translate-y-1/2 ml-2";
        arrowClasses = "before:absolute before:right-full before:top-1/2 before:transform before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-900/95";
        break;
    }

    const widthClasses = imagePreview ? "w-80" : wide ? "w-80" : "w-80";
    const visibilityClasses = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";
    
    return `${baseClasses} ${positionClasses} ${arrowClasses} ${widthClasses} ${visibilityClasses}`;
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <div className={getTooltipClasses()}>
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
    </div>
  );
}