import React, { useState, useRef, useEffect } from 'react';
import { X, Wand2, Send, Sparkles, TrendingUp } from 'lucide-react';
import { UpgradeSuggestionPopup } from './UpgradeSuggestionPopup';
import { getRandomUpgradeSuggestions } from '../../data/upgradeData';

interface UpgradeCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterUpgraded: (character: any) => void;
  targetType: 'hero' | 'villain' | null;
  currentCharacter: any;
  demoMode: boolean;
}

export function UpgradeCharacterModal({ 
  isOpen, 
  onClose, 
  onCharacterUpgraded, 
  targetType,
  currentCharacter,
  demoMode 
}: UpgradeCharacterModalProps) {
  const [upgradePrompt, setUpgradePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [exampleUpgrades, setExampleUpgrades] = useState<string[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUpgradePrompt('');
      setError(null);
      setIsLoading(false);
      setIsGeneratingImage(false);
      setIsFocused(false);
      setShowSuggestions(false);
      // Generate example upgrades
      setExampleUpgrades(getRandomUpgradeSuggestions(3));
    }
  }, [isOpen]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      
      const lineHeight = 24;
      const padding = 28;
      const minHeight = lineHeight + padding;
      const maxHeight = (lineHeight * 5) + padding;
      
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      textarea.style.height = `${newHeight}px`;
      
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [upgradePrompt]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const generateUpgradedImage = async (upgradedCharacter: any) => {
    try {
      setIsGeneratingImage(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: upgradedCharacter.image_prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate upgraded character image');
      }

      const data = await response.json();
      
      // Update character with new image URL
      const characterWithImage = {
        ...upgradedCharacter,
        image_url: data.url
      };
      
      setIsGeneratingImage(false);
      return characterWithImage;
      
    } catch (error) {
      console.error('Failed to generate upgraded character image:', error);
      setIsGeneratingImage(false);
      
      // Still return the character even if image generation fails
      return upgradedCharacter;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle demo mode
    if (demoMode) {
      setIsLoading(true);
      
      setTimeout(async () => {
        // Create an upgraded version of the current character for demo
        const upgradedCharacter = {
          ...currentCharacter,
          character_name: `Enhanced ${currentCharacter.character_name}`,
          description: `${currentCharacter.description} Now ${upgradePrompt || 'enhanced with mystical upgrades'}.`,
          image_prompt: `${currentCharacter.image_prompt}, ${upgradePrompt || 'enhanced with mystical upgrades'}, upgraded appearance, more powerful looking, enhanced details`,
          hp: Math.min(currentCharacter.hp + 20, 200),
          energy: Math.min(currentCharacter.energy + 15, 150),
          mana: Math.min(currentCharacter.mana + 10, 120),
        };
        
        // Generate new image for demo character
        const characterWithImage = await generateUpgradedImage(upgradedCharacter);
        
        onCharacterUpgraded(characterWithImage);
        setIsLoading(false);
      }, 1500);
      
      return;
    }

    // Regular mode - require upgrade prompt
    if (!upgradePrompt.trim()) return;

    setShowSuggestions(false);
    setError(null);
    setIsLoading(true);
    
    try {
      // Create upgrade prompt that builds on the existing character
      const fullPrompt = `Upgrade this character: ${currentCharacter.character_name} - ${currentCharacter.description}. 

Upgrade instructions: ${upgradePrompt.trim()}

Keep the core identity and personality of the character, but enhance them with the requested upgrades. Maintain their existing powers but make them stronger or add complementary abilities. The character should feel like an evolved version of themselves.

IMPORTANT: Update the image_prompt to reflect the upgrades - add the upgrade details to the visual description while keeping the core character appearance recognizable.`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-creation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: fullPrompt }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upgrade character');
      }

      const upgradedCharacter = await response.json();
      
      // Set character creation loading to false
      setIsLoading(false);
      
      // Now generate the upgraded character image
      const characterWithImage = await generateUpgradedImage(upgradedCharacter);
      
      onCharacterUpgraded(characterWithImage);
      setUpgradePrompt('');
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleFocus = () => {
    if (!demoMode) {
      setIsFocused(true);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUpgradePrompt(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleExampleClick = (example: string) => {
    setUpgradePrompt(example);
  };

  const getModalTitle = () => {
    if (targetType === 'hero') {
      return 'Upgrade Hero Character';
    } else if (targetType === 'villain') {
      return 'Upgrade Villain Character';
    }
    return 'Upgrade Character';
  };

  const getButtonText = () => {
    if (demoMode) {
      return `Upgrade Demo ${targetType === 'hero' ? 'Hero' : 'Villain'}`;
    }
    return `Upgrade ${targetType === 'hero' ? 'Hero' : 'Villain'}`;
  };

  const getPlaceholderText = () => {
    if (demoMode) {
      return `Demo mode active - describe upgrades for ${currentCharacter?.character_name || 'character'}`;
    }
    return `Describe how to upgrade ${currentCharacter?.character_name || 'this character'}...`;
  };

  const getLoadingMessage = () => {
    if (isGeneratingImage) {
      return 'Generating upgraded image...';
    }
    if (isLoading) {
      return 'Upgrading character...';
    }
    return '';
  };

  const isSubmitDisabled = () => {
    if (demoMode) {
      return false;
    }
    return !upgradePrompt.trim();
  };

  const isProcessing = isLoading || isGeneratingImage;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{getModalTitle()}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm border border-green-500/20">
              <Wand2 className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-purple-200 text-lg leading-relaxed mb-2">
              Enhance <strong>{currentCharacter?.character_name || 'your character'}</strong> with new abilities and features
            </p>
            <p className="text-purple-300 text-sm">
              The upgraded character will keep their core identity while gaining new powers and appearance
            </p>
          </div>

          {/* Current Character Info */}
          {currentCharacter && (
            <div className="mb-6 p-4 bg-gray-800/30 border border-purple-500/20 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Current Character:</h4>
              <p className="text-purple-200 text-sm leading-relaxed">
                <strong>{currentCharacter.character_name}</strong> - {currentCharacter.description}
              </p>
            </div>
          )}

          {/* Loading Status */}
          {isProcessing && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                <p className="text-blue-300 text-sm">
                  {getLoadingMessage()}
                </p>
              </div>
            </div>
          )}

          {/* Demo Mode Indicator */}
          {demoMode && (
            <div className="mb-6 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-300 text-center">
                <strong>Demo Mode Active:</strong> Will create an enhanced version with new image
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 backdrop-blur-sm">
              <X className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Upgrade Input Form */}
          <div ref={containerRef} className="space-y-4 relative mb-6">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="absolute left-3 top-4 text-green-400 z-10">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <textarea
                  ref={textareaRef}
                  value={upgradePrompt}
                  onChange={(e) => setUpgradePrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  placeholder={getPlaceholderText()}
                  disabled={isProcessing}
                  className={`w-full pl-12 pr-12 py-3.5 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none leading-6 ${
                    isProcessing
                      ? 'bg-gray-800/30 cursor-not-allowed placeholder-gray-400 italic' 
                      : 'bg-gray-800/50 placeholder-gray-400'
                  }`}
                  style={{ 
                    minHeight: '56px',
                    maxHeight: '146px'
                  }}
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isSubmitDisabled() || isProcessing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-gradient-to-r from-green-600 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25 z-10"
                  title={demoMode ? "Upgrade Demo Character" : "Submit (Ctrl/Cmd + Enter)"}
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Upgrade Suggestion Popup - Only show in regular mode */}
              {!demoMode && (
                <UpgradeSuggestionPopup
                  isVisible={showSuggestions && isFocused && !isProcessing}
                  currentText={upgradePrompt}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={handleCloseSuggestions}
                />
              )}
            </form>
          </div>

          {/* Example Upgrades */}
          {!isProcessing && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                Example Upgrades
              </h4>
              <div className="space-y-2">
                {exampleUpgrades.map((example, index) => (
                  <button
                    key={`example-${index}`}
                    onClick={() => handleExampleClick(example)}
                    disabled={isProcessing}
                    className="w-full text-left p-3 bg-gray-800/30 hover:bg-green-900/20 border border-gray-700/50 hover:border-green-500/30 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0 group-hover:bg-green-300 transition-colors" />
                      <p className="text-sm text-green-300 group-hover:text-green-200 transition-colors leading-relaxed">
                        {example}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-green-400/70 mt-3 text-center">
                Click any example to use it, or create your own upgrade description
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-purple-500/20">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled() || isProcessing}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-green-500/25"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isGeneratingImage ? 'Generating Image...' : 'Upgrading...'}</span>
              </div>
            ) : (
              getButtonText()
            )}
          </button>
        </div>
      </div>
    </div>
  );
}