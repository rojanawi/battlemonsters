import React, { useState, useRef, useEffect } from 'react';
import { X, Crown, Send, Wand2 } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { CustomSceneInput } from './CustomSceneInput';
import { useGame } from '../../context/GameContext';

interface FinalizeBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinalSceneGenerated: (description: string) => void;
}

export function FinalizeBattleModal({ 
  isOpen, 
  onClose, 
  onFinalSceneGenerated
}: FinalizeBattleModalProps) {
  const { state } = useGame();
  const { character, opponent } = state;
  
  const [customScene, setCustomScene] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<Array<{ label: string; description: string }>>([]);

  // Initialize suggested final actions when modal opens
  useEffect(() => {
    if (isOpen && character?.powers) {
      // Create epic finale versions of character powers
      const finalActions = character.powers.slice(0, 3).map(power => ({
        label: `Ultimate ${power.name}`,
        description: `delivers the final decisive blow with an ultimate ${power.description.toLowerCase()} that ends the battle in epic fashion`
      }));
      setSuggestedActions(finalActions);
      setCustomScene('');
    }
  }, [isOpen, character]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleActionClick = (action: { label: string; description: string }) => {
    onFinalSceneGenerated(action.description);
    onClose();
  };

  const handleCustomScene = () => {
    if (customScene.trim()) {
      onFinalSceneGenerated(customScene.trim());
      onClose();
    }
  };

  const replaceAction = (actionIndex: number) => {
    if (!character?.powers) return;
    
    // Generate new epic finale action
    const basePower = character.powers[actionIndex % character.powers.length];
    const epicDescriptions = [
      `unleashes the ultimate ${basePower.description.toLowerCase()} in a final devastating assault`,
      `channels all remaining power into a legendary ${basePower.description.toLowerCase()} that shakes the battlefield`,
      `performs the legendary finishing move with ${basePower.description.toLowerCase()} that decides the battle's fate`,
      `executes the ultimate technique combining ${basePower.description.toLowerCase()} with pure determination`,
      `delivers the final blow with an earth-shattering ${basePower.description.toLowerCase()} attack`
    ];
    
    const randomDescription = epicDescriptions[Math.floor(Math.random() * epicDescriptions.length)];
    
    setSuggestedActions(prev => {
      const newActions = [...prev];
      newActions[actionIndex] = {
        label: `Epic ${basePower.name}`,
        description: randomDescription
      };
      return newActions;
    });
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
            <div className="p-2 bg-gradient-to-r from-yellow-600/20 to-red-600/20 rounded-full">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Finalize Epic Battle</h3>
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
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-r from-yellow-900/50 to-red-900/50 backdrop-blur-sm border border-yellow-500/20">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <h4 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent mb-3">
              The Final Moment
            </h4>
            <p className="text-purple-200 text-lg leading-relaxed">
              Choose how your epic battle reaches its legendary conclusion
            </p>
          </div>

          {/* Suggested Final Actions */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Ultimate Finishing Moves
            </h4>
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

          {/* Custom Final Scene Input */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              Custom Epic Finale
            </h4>
            <div className="relative">
              <CustomSceneInput
                value={customScene}
                onChange={setCustomScene}
                onSubmit={handleCustomScene}
                disabled={false}
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-red-600/10 rounded-lg blur opacity-50"></div>
              </div>
            </div>
            <p className="text-yellow-300/70 text-xs mt-2 text-center">
              Describe the epic conclusion that will end this legendary battle
            </p>
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