import React, { useState, useRef, useEffect } from 'react';
import { X, Wand2, Send, Sparkles, RefreshCw } from 'lucide-react';
import { ExamplePrompts } from './ExamplePrompts';
import { SuggestionPopup } from './SuggestionPopup';
import { DemoModeToggle } from './DemoModeToggle';
import { DEMO_PHOENIX_WARRIOR, DEMO_TIME_MANIPULATOR } from '../../data/demoCharacters';
import { getRandomOpponent } from '../../data/opponents';

interface RegenerateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterGenerated: (character: any) => void;
  targetType: 'hero' | 'villain' | null;
  demoMode: boolean;
}

export function RegenerateCharacterModal({ 
  isOpen, 
  onClose, 
  onCharacterGenerated, 
  targetType,
  demoMode 
}: RegenerateCharacterModalProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setSelectedPrompt('');
      setError(null);
      setIsLoading(false);
      setIsFocused(false);
      setShowSuggestions(false);
    }
  }, [isOpen]);

  // Update input when a prompt is selected from examples
  useEffect(() => {
    if (selectedPrompt) {
      setPrompt(selectedPrompt);
      setShowSuggestions(false);
    }
  }, [selectedPrompt]);

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
  }, [prompt]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle demo mode
    if (demoMode) {
      setIsLoading(true);
      
      setTimeout(() => {
        if (targetType === 'hero') {
          onCharacterGenerated(DEMO_PHOENIX_WARRIOR);
        } else {
          // For villain in demo mode, use a random opponent
          const randomOpponent = getRandomOpponent();
          onCharacterGenerated(randomOpponent);
        }
        setIsLoading(false);
      }, 1500);
      
      return;
    }

    // Regular mode - require prompt
    if (!prompt.trim()) return;

    setShowSuggestions(false);
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-creation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create character');
      }

      const character = await response.json();
      onCharacterGenerated(character);
      setPrompt('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
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
    setPrompt(suggestion);
    const hasAllParts = suggestion.includes(' with ') && suggestion.includes(' and ');
    if (hasAllParts) {
      setShowSuggestions(false);
    }
    textareaRef.current?.focus();
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const getModalTitle = () => {
    if (targetType === 'hero') {
      return 'Regenerate Hero Character';
    } else if (targetType === 'villain') {
      return 'Regenerate Villain Character';
    }
    return 'Regenerate Character';
  };

  const getButtonText = () => {
    if (demoMode) {
      return `Generate Demo ${targetType === 'hero' ? 'Hero' : 'Villain'}`;
    }
    return `Create New ${targetType === 'hero' ? 'Hero' : 'Villain'}`;
  };

  const getPlaceholderText = () => {
    if (demoMode) {
      return `Demo mode active - click to generate new ${targetType}`;
    }
    return `Describe your new ${targetType} character...`;
  };

  const isSubmitDisabled = () => {
    if (demoMode) {
      return false;
    }
    return !prompt.trim();
  };

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
            <div className="p-2 bg-purple-600/20 rounded-full">
              <RefreshCw className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{getModalTitle()}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/20">
              <Wand2 className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-purple-200 text-lg leading-relaxed">
              Create a new {targetType} character to replace the current one
            </p>
          </div>

          {/* Demo Mode Indicator */}
          {demoMode && (
            <div className="mb-6 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-300 text-center">
                <strong>Demo Mode Active:</strong> Will generate a predefined {targetType} character
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

          {/* Character Creation Form */}
          <div ref={containerRef} className="space-y-4 relative mb-6">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="absolute left-3 top-4 text-purple-400 z-10">
                  <Wand2 className="w-5 h-5" />
                </div>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  placeholder={getPlaceholderText()}
                  disabled={demoMode || isLoading}
                  className={`w-full pl-12 pr-12 py-3.5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none leading-6 ${
                    demoMode || isLoading
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
                  disabled={isSubmitDisabled() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 z-10"
                  title={demoMode ? "Generate Demo Character" : "Submit (Ctrl/Cmd + Enter)"}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Suggestion Popup - Only show in regular mode */}
              {!demoMode && (
                <SuggestionPopup
                  isVisible={showSuggestions && isFocused}
                  currentText={prompt}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={handleCloseSuggestions}
                />
              )}
            </form>
          </div>

          {/* Example Prompts - Only show in regular mode */}
          {!demoMode && (
            <ExamplePrompts onPromptSelect={handlePromptSelect} />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-purple-500/20">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled() || isLoading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
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