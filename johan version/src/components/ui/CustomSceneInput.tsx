import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface CustomSceneInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function CustomSceneInput({ value, onChange, onSubmit, disabled }: CustomSceneInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the number of lines
      const lineHeight = 24; // Approximate line height in pixels
      const padding = 16; // Top and bottom padding (8px each)
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
  }, [value]);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your custom scene... (e.g., 'unleashes a devastating combo attack while dodging enemy fire')"
            disabled={disabled}
            className={`w-full p-4 pr-14 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none leading-6 ${
              disabled 
                ? 'bg-gray-800/30 cursor-not-allowed' 
                : 'bg-gray-800/50'
            }`}
            rows={1}
            style={{ 
              minHeight: '40px',
              maxHeight: '136px'
            }}
          />
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            title="Generate Scene (Ctrl/Cmd + Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}