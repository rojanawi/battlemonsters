import React, { useState, useRef, useEffect } from 'react';
import { Send, Wand2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SuggestionPopup } from './ui/SuggestionPopup';
import { DEMO_PHOENIX_WARRIOR, DEMO_TIME_MANIPULATOR } from '../data/demoCharacters';

interface PromptInputProps {
  selectedPrompt?: string;
}

export function PromptInput({ selectedPrompt }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { state, dispatch } = useGame();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update input when a prompt is selected from examples
  useEffect(() => {
    if (selectedPrompt) {
      setPrompt(selectedPrompt);
      setShowSuggestions(false); // Hide suggestions when example is selected
    }
  }, [selectedPrompt]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the number of lines
      const lineHeight = 24; // Approximate line height in pixels
      const padding = 28; // Top and bottom padding (14px each)
      const minHeight = lineHeight + padding; // Minimum height for 1 line
      const maxHeight = (lineHeight * 5) + padding; // Maximum height for 5 lines
      
      // Set height based on content, with min/max constraints
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      textarea.style.height = `${newHeight}px`;
      
      // Enable/disable scrolling based on content
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

  const generateCharacterImage = async (character: any) => {
    try {
      dispatch({ type: 'SET_GENERATING_IMAGE', payload: true });
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: character.image_prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate character image');
      }

      const data = await response.json();
      
      // Update character with image URL
      const updatedCharacter = {
        ...character,
        image_url: data.url
      };
      
      dispatch({ type: 'SET_CHARACTER', payload: updatedCharacter });
      dispatch({ type: 'SET_GENERATING_IMAGE', payload: false });
      dispatch({ type: 'SET_IMAGE_GENERATION_ERROR', payload: false });
      
      return updatedCharacter;
    } catch (error) {
      console.error('Failed to generate character image:', error);
      dispatch({ type: 'SET_GENERATING_IMAGE', payload: false });
      dispatch({ type: 'SET_IMAGE_GENERATION_ERROR', payload: true });
      
      // Still set the character even if image generation fails
      dispatch({ type: 'SET_CHARACTER', payload: character });
      return character;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle demo mode
    if (state.demoMode) {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        dispatch({ type: 'SET_CHARACTER', payload: DEMO_PHOENIX_WARRIOR });
        dispatch({ type: 'SET_OPPONENT', payload: DEMO_TIME_MANIPULATOR });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1500);
      
      return;
    }

    // Regular mode - require prompt
    if (!prompt.trim()) return;

    setShowSuggestions(false);
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // First, generate the character data
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
      
      // Set loading to false for character creation
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Now generate the character image
      await generateCharacterImage(character);
      
      setPrompt('');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Hide suggestions on Escape
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleFocus = () => {
    if (!state.demoMode) {
      setIsFocused(true);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    // Keep suggestions open for next category unless it's a complete description
    const hasAllParts = suggestion.includes(' with ') && suggestion.includes(' and ');
    if (hasAllParts) {
      setShowSuggestions(false);
    }
    // Focus back on textarea
    textareaRef.current?.focus();
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const getButtonText = () => {
    if (state.demoMode) {
      return 'Start Demo Battle';
    }
    return 'Create Character';
  };

  const getPlaceholderText = () => {
    if (state.demoMode) {
      return 'Demo mode active - click to start battle';
    }
    return 'Describe your legendary character...';
  };

  const isSubmitDisabled = () => {
    if (state.demoMode) {
      return false; // Always allow demo mode submission
    }
    return !prompt.trim(); // Regular mode requires prompt
  };

  return (
    <div ref={containerRef} className="space-y-4 relative">
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
            disabled={state.demoMode}
            className={`w-full pl-12 pr-12 py-3.5 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none leading-6 ${
              state.demoMode 
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
            disabled={isSubmitDisabled()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 z-10"
            title={state.demoMode ? "Start Demo" : "Submit (Ctrl/Cmd + Enter)"}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion Popup - Only show in regular mode */}
        {!state.demoMode && (
          <SuggestionPopup
            isVisible={showSuggestions && isFocused}
            currentText={prompt}
            onSuggestionClick={handleSuggestionClick}
            onClose={handleCloseSuggestions}
          />
        )}
      </form>
    </div>
  );
}