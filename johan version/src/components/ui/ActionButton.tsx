import React from 'react';
import { Sword, Zap, Shield, RefreshCw } from 'lucide-react';

interface ActionButtonProps {
  action: {
    label: string;
    description: string;
  };
  onClick: () => void;
  onRefresh: () => void;
  disabled: boolean;
}

export function ActionButton({ action, onClick, onRefresh, disabled }: ActionButtonProps) {
  // Get icon based on action type
  const getActionIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('strike') || lowerLabel.includes('slash') || lowerLabel.includes('punch')) {
      return <Sword className="w-4 h-4" />;
    }
    if (lowerLabel.includes('shield') || lowerLabel.includes('barrier') || lowerLabel.includes('defense')) {
      return <Shield className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRefresh();
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
          disabled 
            ? 'bg-gray-800/30 border-gray-600/30 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/40 hover:border-purple-400/60 text-white hover:shadow-lg hover:shadow-purple-500/25'
        }`}
      >
        {/* Background glow effect */}
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        
        <div className="relative text-left">
          {/* Icon and Title Row */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-full ${
              disabled 
                ? 'bg-gray-700/50' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500'
            }`}>
              {getActionIcon(action.label)}
            </div>
            <h5 className="font-bold text-base">{action.label}</h5>
          </div>
          
          {/* Description */}
          <p className="text-sm opacity-80 leading-relaxed">{action.description}</p>
        </div>
      </button>

      {/* Refresh Button */}
      {!disabled && (
        <button
          onClick={handleRefresh}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-purple-300 hover:text-purple-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="Get new action"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}