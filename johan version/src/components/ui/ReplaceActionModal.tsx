import React, { useState, useRef, useEffect } from 'react';
import { X, Wand2, Send, RefreshCw } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { CustomSceneInput } from './CustomSceneInput';
import { useGame } from '../../context/GameContext';

interface ReplaceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionGenerated: (description: string) => void;
  isVillainAction?: boolean;
}

export function ReplaceActionModal({ 
  isOpen, 
  onClose, 
  onActionGenerated, 
  isVillainAction = false 
}: ReplaceActionModalProps) {
  const { state } = useGame();
  const { character, opponent } = state;
  
  const [customScene, setCustomScene] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<Array<{ label: string; description: string }>>([]);

  // Initialize suggested actions when modal opens
  useEffect(() => {
    if (isOpen) {
      const sourceCharacter = isVillainAction ? opponent : character;
      if (sourceCharacter?.powers) {
        const actions = sourceCharacter.powers.slice(0, 3).map(power => ({
          label: power.name,
          description: power.description
        }));
        setSuggestedActions(actions);
      }
      setCustomScene('');
    }
  }, [isOpen, isVillainAction, character, opponent]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleActionClick = (action: { label: string; description: string }) => {
    onActionGenerated(action.description);
    onClose();
  };

  const handleCustomScene = () => {
    if (customScene.trim()) {
      onActionGenerated(customScene.trim());
      onClose();
    }
  };

  const replaceAction = (actionIndex: number) => {
    const sourceCharacter = isVillainAction ? opponent : character;
    if (!sourceCharacter?.powers) return;
    
    const availablePowers = sourceCharacter.powers.filter((_, index) => {
      return !suggestedActions.some(action => action.label === sourceCharacter.powers[index].name);
    });
    
    if (availablePowers.length === 0) {
      // If no unused powers, pick a random one
      const randomPower = sourceCharacter.powers[Math.floor(Math.random() * sourceCharacter.powers.length)];
      setSuggestedActions(prev => {
        const newActions = [...prev];
        newActions[actionIndex] = {
          label: randomPower.name,
          description: randomPower.description
        };
        return newActions;
      });
    } else {
      const randomPower = availablePowers[Math.floor(Math.random() * availablePowers.length)];
      setSuggestedActions(prev => {
        const newActions = [...prev];
        newActions[actionIndex] = {
          label: randomPower.name,
          description: randomPower.description
        };
        return newActions;
      });
    }
  };

  const getModalTitle = () => {
    return `Replace ${isVillainAction ? 'Villain' : 'Hero'} Action`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
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
              Choose a new action to replace the current panel
            </p>
          </div>

          {/* Suggested Actions */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-4 text-center">Suggested Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedActions.map((action, index) => (
                <ActionButton
                  key={`${action.label}-${index}`}
                  action={action}
                  onClick={() => handleActionClick(action)}
                  onRefresh={() => replaceAction(index)}
                  disabled={false}
                />
              ))}
            </div>
          </div>

          {/* Custom Scene Input */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 text-center">Custom Action</h4>
            <CustomSceneInput
              value={customScene}
              onChange={setCustomScene}
              onSubmit={handleCustomScene}
              disabled={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-purple-500/20">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}