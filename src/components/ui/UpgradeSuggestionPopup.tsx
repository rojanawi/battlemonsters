import React, { useEffect, useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { getRandomUpgradeSuggestions } from '../../data/upgradeData';

interface UpgradeSuggestionPopupProps {
  isVisible: boolean;
  currentText: string;
  onSuggestionClick: (suggestion: string) => void;
  onClose: () => void;
}

export function UpgradeSuggestionPopup({ 
  isVisible, 
  currentText, 
  onSuggestionClick, 
  onClose 
}: UpgradeSuggestionPopupProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [regenerationKey, setRegenerationKey] = useState(0);

  // Force regeneration of suggestions when popup becomes visible
  useEffect(() => {
    if (isVisible) {
      setRegenerationKey(prev => prev + 1);
    }
  }, [isVisible]);

  // Generate new suggestions when popup opens or regeneration key changes
  useEffect(() => {
    if (isVisible) {
      const newSuggestions = getRandomUpgradeSuggestions(3);
      setSuggestions(newSuggestions);
    }
  }, [isVisible, regenerationKey]);

  const handleSuggestionClick = (e: React.MouseEvent, suggestion: string) => {
    // Prevent any form submission or event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    let newText = currentText.trim();
    
    // Add upgrade suggestion to existing text
    if (newText) {
      newText = newText + ' ' + suggestion;
    } else {
      newText = suggestion;
    }
    
    onSuggestionClick(newText);
    
    // Force regeneration of suggestions after selection
    setTimeout(() => {
      setRegenerationKey(prev => prev + 1);
    }, 100);
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <h3 className="text-sm font-semibold text-purple-200">
            Upgrade Suggestions
          </h3>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={`upgrade-${suggestion}-${index}-${regenerationKey}`}
              type="button"
              onClick={(e) => handleSuggestionClick(e, suggestion)}
              className="w-full text-left p-3 bg-gray-800/50 hover:bg-purple-900/30 border border-gray-700/50 hover:border-purple-500/40 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200 group-hover:text-purple-100">
                  {suggestion}
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {/* Helper text */}
        <div className="mt-3 pt-2 border-t border-gray-700/50">
          <p className="text-xs text-purple-400/70 text-center">
            Click to add upgrades to your character
          </p>
        </div>
      </div>
    </div>
  );
}