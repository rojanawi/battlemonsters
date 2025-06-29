import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { 
  getRandomCharacterTypes, 
  getRandomPhysicalFeatures, 
  getRandomDistinctiveAttributes,
  getThemeFromCharacterType 
} from '../../data/suggestionData';

interface SuggestionPopupProps {
  isVisible: boolean;
  currentText: string;
  onSuggestionClick: (suggestion: string) => void;
  onClose: () => void;
}

type SuggestionCategory = 'character' | 'features';

interface SuggestionState {
  category: SuggestionCategory;
  suggestions: string[];
  selectedTheme: string;
  hasCharacterType: boolean;
}

export function SuggestionPopup({ isVisible, currentText, onSuggestionClick, onClose }: SuggestionPopupProps) {
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    category: 'character',
    suggestions: [],
    selectedTheme: 'generic',
    hasCharacterType: false
  });

  // Force regeneration of suggestions when popup becomes visible
  const [regenerationKey, setRegenerationKey] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setRegenerationKey(prev => prev + 1);
    }
  }, [isVisible]);

  // Determine current category and generate appropriate suggestions
  useEffect(() => {
    if (!isVisible) return;

    const text = currentText.toLowerCase().trim();
    
    // Check if we have a character type (once we have one, we always show details)
    const hasCharacterType = text !== '' && (
      suggestionState.hasCharacterType || 
      getRandomCharacterTypes(100).some(type => text.includes(type.toLowerCase()))
    );
    
    let newCategory: SuggestionCategory = hasCharacterType ? 'features' : 'character';
    let newTheme = 'generic';
    
    if (hasCharacterType) {
      // Find the character type to determine theme
      const matchedType = getRandomCharacterTypes(100).find(type => 
        text.includes(type.toLowerCase())
      );
      if (matchedType) {
        newTheme = getThemeFromCharacterType(matchedType);
      }
    }

    // Generate suggestions based on category with more randomization
    let newSuggestions: string[] = [];
    if (newCategory === 'character') {
      newSuggestions = getRandomCharacterTypes(3);
    } else {
      // Create a more varied mix of features and attributes
      const mixRatio = Math.random();
      let physicalCount, attributeCount;
      
      if (mixRatio < 0.33) {
        // Mostly physical features
        physicalCount = 2;
        attributeCount = 1;
      } else if (mixRatio < 0.66) {
        // Mostly attributes
        physicalCount = 1;
        attributeCount = 2;
      } else {
        // Even mix or all of one type
        if (Math.random() < 0.5) {
          physicalCount = 3;
          attributeCount = 0;
        } else {
          physicalCount = 0;
          attributeCount = 3;
        }
      }
      
      const physicalFeatures = physicalCount > 0 ? getRandomPhysicalFeatures(newTheme, physicalCount) : [];
      const distinctiveAttributes = attributeCount > 0 ? getRandomDistinctiveAttributes(newTheme, attributeCount) : [];
      
      // Combine and shuffle for maximum randomness
      newSuggestions = [...physicalFeatures, ...distinctiveAttributes]
        .sort(() => Math.random() - 0.5);
    }

    setSuggestionState({
      category: newCategory,
      suggestions: newSuggestions,
      selectedTheme: newTheme,
      hasCharacterType: hasCharacterType
    });
  }, [isVisible, currentText, regenerationKey, suggestionState.hasCharacterType]);

  const handleSuggestionClick = (e: React.MouseEvent, suggestion: string) => {
    // Prevent any form submission or event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    let newText = currentText;
    
    if (suggestionState.category === 'character') {
      // Replace or add character type
      newText = suggestion;
    } else {
      // Add feature (physical or distinctive attribute)
      newText = currentText.trim() + ' ' + suggestion;
    }
    
    onSuggestionClick(newText);
    
    // Force regeneration of suggestions after selection
    setTimeout(() => {
      setRegenerationKey(prev => prev + 1);
    }, 100);
  };

  const getCategoryTitle = () => {
    switch (suggestionState.category) {
      case 'character':
        return 'Choose Character Type';
      case 'features':
        return 'Add Physical Details';
      default:
        return 'Suggestions';
    }
  };

  const getCategoryIcon = () => {
    switch (suggestionState.category) {
      case 'character':
        return '⚔️';
      case 'features':
        return '🛡️';
      default:
        return '💡';
    }
  };

  if (!isVisible || suggestionState.suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{getCategoryIcon()}</span>
          <h3 className="text-sm font-semibold text-purple-200">
            {getCategoryTitle()}
          </h3>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          {suggestionState.suggestions.map((suggestion, index) => (
            <button
              key={`${suggestionState.category}-${suggestion}-${index}-${regenerationKey}`}
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
      </div>
    </div>
  );
}