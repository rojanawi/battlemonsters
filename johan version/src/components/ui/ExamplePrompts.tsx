import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { generateExamplePrompts } from '../../data/promptExamples';

interface ExamplePromptsProps {
  onPromptSelect: (prompt: string) => void;
}

export function ExamplePrompts({ onPromptSelect }: ExamplePromptsProps) {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate initial prompts
  useEffect(() => {
    setPrompts(generateExamplePrompts(3));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrompts(generateExamplePrompts(3));
      setIsRefreshing(false);
    }, 300); // Small delay for smooth animation
  };

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-purple-200">Spark Your Imagination</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-2 py-1 text-xs text-purple-300 hover:text-purple-200 transition-colors disabled:opacity-50"
          title="Generate new examples"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          New Ideas
        </button>
      </div>
      
      <div className="space-y-2">
        {prompts.map((prompt, index) => (
          <button
            key={`${prompt}-${index}`}
            onClick={() => handlePromptClick(prompt)}
            className="w-full text-left p-3 bg-gray-800/30 hover:bg-purple-900/20 border border-gray-700/50 hover:border-purple-500/30 rounded-lg transition-all duration-200 group"
          >
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 group-hover:bg-purple-300 transition-colors" />
              <p className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors leading-relaxed">
                {prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-purple-400/70 mt-3 text-center">
        Click any example to use it, or create your own unique character
      </p>
    </div>
  );
}