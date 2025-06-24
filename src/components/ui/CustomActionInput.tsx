import React, { useState } from 'react';
import { Send, Wand2 } from 'lucide-react';

interface CustomActionInputProps {
  onExecuteCustomAction: (actionDescription: string) => void;
  disabled?: boolean;
}

export function CustomActionInput({ onExecuteCustomAction, disabled = false }: CustomActionInputProps) {
  const [customAction, setCustomAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAction.trim() || disabled) return;

    onExecuteCustomAction(customAction.trim());
    setCustomAction('');
  };

  return (
    <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-purple-500/20">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-4 h-4 text-purple-400" />
        <h4 className="text-sm font-semibold text-purple-200">Custom Action</h4>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
          placeholder="Describe your custom action... (e.g., 'I summon a meteor from the sky to crush my enemy')"
          disabled={disabled}
          className={`w-full px-3 py-2 pr-12 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 text-sm resize-none transition-all duration-200 ${
            disabled 
              ? 'border-gray-600/30 cursor-not-allowed opacity-50' 
              : 'border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent'
          }`}
          rows={2}
        />
        <button
          type="submit"
          disabled={!customAction.trim() || disabled}
          className={`absolute right-2 bottom-2 p-1.5 rounded-md transition-colors duration-200 ${
            !customAction.trim() || disabled
              ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-500'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      
      <p className="text-xs text-purple-300/70 mt-2">
        Type any creative action and execute it immediately!
      </p>
    </div>
  );
}