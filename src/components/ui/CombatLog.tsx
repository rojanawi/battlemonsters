import React, { useState, useEffect } from 'react';
import { ScrollText, Sword, Shield, Sparkles, RotateCcw, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import type { CombatPhase } from '../../types/combat';

interface CombatLogProps {
  combatLog: CombatPhase[];
}

interface ActionImage {
  url?: string;
  isGenerating: boolean;
  error: boolean;
}

export function CombatLog({ combatLog }: CombatLogProps) {
  const [actionImages, setActionImages] = useState<Record<string, ActionImage>>({});

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'attack':
        return <Sword className="w-4 h-4 text-red-400" />;
      case 'defend':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'special':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'counter':
        return <RotateCcw className="w-4 h-4 text-yellow-400" />;
      default:
        return <Sword className="w-4 h-4 text-gray-400" />;
    }
  };

  const generateActionImage = async (phaseIndex: number, action: any, actionType: 'initiator' | 'reactor') => {
    const imageKey = `${phaseIndex}-${actionType}`;
    
    // Don't generate if already generating or exists
    if (actionImages[imageKey]?.isGenerating || actionImages[imageKey]?.url) {
      return;
    }

    setActionImages(prev => ({
      ...prev,
      [imageKey]: { isGenerating: true, error: false }
    }));

    try {
      const prompt = `Epic fantasy combat action illustration: ${action.name} - ${action.description}. 
      
      Dynamic action scene showing the combat move in progress, magical effects and energy, dramatic lighting with sparks and particles, intense battle atmosphere, fantasy art style, high contrast, detailed character action pose, combat magic effects, cinematic composition, 16:9 aspect ratio.`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            aspect_ratio: '16:9'
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate action image');
      }

      const data = await response.json();
      
      setActionImages(prev => ({
        ...prev,
        [imageKey]: { 
          url: data.url, 
          isGenerating: false, 
          error: false 
        }
      }));

    } catch (error) {
      console.error('Failed to generate action image:', error);
      setActionImages(prev => ({
        ...prev,
        [imageKey]: { 
          isGenerating: false, 
          error: true 
        }
      }));
    }
  };

  const retryImageGeneration = (phaseIndex: number, action: any, actionType: 'initiator' | 'reactor') => {
    const imageKey = `${phaseIndex}-${actionType}`;
    setActionImages(prev => ({
      ...prev,
      [imageKey]: { isGenerating: false, error: false }
    }));
    generateActionImage(phaseIndex, action, actionType);
  };

  // Generate images for new combat log entries
  useEffect(() => {
    combatLog.forEach((phase, index) => {
      if (phase.initiator_action) {
        const imageKey = `${index}-initiator`;
        if (!actionImages[imageKey]) {
          generateActionImage(index, phase.initiator_action, 'initiator');
        }
      }
      if (phase.reactor_action) {
        const imageKey = `${index}-reactor`;
        if (!actionImages[imageKey]) {
          generateActionImage(index, phase.reactor_action, 'reactor');
        }
      }
    });
  }, [combatLog]);

  const renderActionImage = (phaseIndex: number, action: any, actionType: 'initiator' | 'reactor') => {
    const imageKey = `${phaseIndex}-${actionType}`;
    const imageData = actionImages[imageKey];

    if (!imageData) return null;

    return (
      <div className="w-16 h-9 rounded overflow-hidden bg-gray-800/50 flex-shrink-0">
        {imageData.isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
        ) : imageData.error ? (
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => retryImageGeneration(phaseIndex, action, actionType)}
              className="w-full h-full flex items-center justify-center hover:bg-gray-700/50 transition-colors"
              title="Retry image generation"
            >
              <RefreshCw className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        ) : imageData.url ? (
          <img
            src={imageData.url}
            alt={`${action.name} action`}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <ScrollText className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Combat Log</h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {combatLog.length === 0 ? (
          <p className="text-purple-300 text-sm italic">Combat has not yet begun...</p>
        ) : (
          combatLog.map((phase, index) => (
            <div key={index} className="border-l-2 border-purple-500/30 pl-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-purple-300">
                  Turn {phase.turn_number} - {phase.phase === 'player_initiative' ? 'Player Initiative' : 'Opponent Initiative'}
                </span>
              </div>

              {phase.initiator_action && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {renderActionImage(index, phase.initiator_action, 'initiator')}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getActionIcon(phase.initiator_action.type)}
                        <span className="text-sm font-semibold text-white">
                          {phase.initiator === 'player' ? 'You' : 'Opponent'} used {phase.initiator_action.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        {phase.initiator_action.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {phase.reactor_action && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {renderActionImage(index, phase.reactor_action, 'reactor')}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getActionIcon(phase.reactor_action.type)}
                        <span className="text-sm font-semibold text-white">
                          {phase.initiator === 'opponent' ? 'You' : 'Opponent'} reacted with {phase.reactor_action.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        {phase.reactor_action.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {phase.resolution && (
                <div className="bg-gray-800/50 p-3 rounded-lg ml-2">
                  <p className="text-sm text-purple-200 mb-2">{phase.resolution.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-blue-300">
                        {phase.initiator === 'player' ? 'You' : 'Opponent'}:
                      </span>
                      <span className="text-red-400 ml-1">
                        -{phase.resolution.initiator_damage_taken} HP
                      </span>
                    </div>
                    <div>
                      <span className="text-red-300">
                        {phase.initiator === 'opponent' ? 'You' : 'Opponent'}:
                      </span>
                      <span className="text-red-400 ml-1">
                        -{phase.resolution.reactor_damage_taken} HP
                      </span>
                    </div>
                  </div>
                  {phase.resolution.special_effects.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600/30">
                      {phase.resolution.special_effects.map((effect, effectIndex) => (
                        <p key={effectIndex} className="text-xs text-yellow-300">
                          • {effect}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}