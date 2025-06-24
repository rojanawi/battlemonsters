import React, { useState, useEffect } from 'react';
import { ScrollText, Sword, Shield, Sparkles, RotateCcw, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Tooltip } from './Tooltip';
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
  const { state } = useGame();
  const { character, opponent } = state;
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

  const generateActionImage = async (phaseIndex: number, action: any, actionType: 'initiator' | 'reactor', phase: CombatPhase) => {
    if (!character || !opponent) return;
    
    const imageKey = `${phaseIndex}-${actionType}`;
    
    // Don't generate if already generating or exists
    if (actionImages[imageKey]?.isGenerating || actionImages[imageKey]?.url) {
      return;
    }

    console.log(`Generating image for action: ${action.name} - ${action.description}`);

    setActionImages(prev => ({
      ...prev,
      [imageKey]: { isGenerating: true, error: false }
    }));

    try {
      // Determine who is performing the action
      const isPlayerAction = (phase.initiator === 'player' && actionType === 'initiator') || 
                            (phase.initiator === 'opponent' && actionType === 'reactor');
      
      const actingCharacter = isPlayerAction ? character : opponent;
      const targetCharacter = isPlayerAction ? opponent : character;

      // Enhanced prompt with character consistency like BattleStoryScreen
      const prompt = `Epic fantasy combat action: ${actingCharacter.character_name} (${actingCharacter.image_prompt}) performing ${action.name} against ${targetCharacter.character_name} (${targetCharacter.image_prompt}).

Action: ${action.description}. The attacker shows ${actingCharacter.description} while the target displays ${targetCharacter.description}.

Visual style: Dynamic combat action scene, ${actingCharacter.character_name} in the foreground executing the move, magical effects and energy corresponding to the action, dramatic lighting with sparks and energy trails, intense battle atmosphere, detailed character aesthetics matching their descriptions, cinematic action photography, high contrast lighting, fantasy combat art style, 16:9 aspect ratio.`;

      console.log(`Making API call for image generation with enhanced prompt: ${prompt}`);

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
        const errorText = await response.text();
        console.error(`Image generation failed: ${response.status} - ${errorText}`);
        throw new Error(`Failed to generate action image: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Image generation successful for ${imageKey}:`, data);
      
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

  const retryImageGeneration = (phaseIndex: number, action: any, actionType: 'initiator' | 'reactor', phase: CombatPhase) => {
    const imageKey = `${phaseIndex}-${actionType}`;
    setActionImages(prev => ({
      ...prev,
      [imageKey]: { isGenerating: false, error: false }
    }));
    generateActionImage(phaseIndex, action, actionType, phase);
  };

  // Generate images for new combat log entries
  useEffect(() => {
    if (!character || !opponent) return;
    
    console.log('Combat log updated, checking for new actions to generate images for:', combatLog);
    
    combatLog.forEach((phase, index) => {
      if (phase.initiator_action) {
        const imageKey = `${index}-initiator`;
        if (!actionImages[imageKey]) {
          console.log(`Triggering image generation for initiator action: ${phase.initiator_action.name}`);
          generateActionImage(index, phase.initiator_action, 'initiator', phase);
        }
      }
      if (phase.reactor_action) {
        const imageKey = `${index}-reactor`;
        if (!actionImages[imageKey]) {
          console.log(`Triggering image generation for reactor action: ${phase.reactor_action.name}`);
          generateActionImage(index, phase.reactor_action, 'reactor', phase);
        }
      }
    });
  }, [combatLog.length, character, opponent]); // Include character and opponent in dependencies

  const renderActionImage = (phaseIndex: number, action: any, actionType: 'initiator' | 'reactor', phase: CombatPhase) => {
    const imageKey = `${phaseIndex}-${actionType}`;
    const imageData = actionImages[imageKey];

    console.log(`Rendering action image for ${imageKey}:`, imageData);

    const imageElement = (
      <div className="w-16 h-9 rounded overflow-hidden bg-gray-800/50 flex-shrink-0 border border-gray-600/30 cursor-pointer hover:border-purple-500/50 transition-colors">
        {!imageData ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-600 rounded"></div>
          </div>
        ) : imageData.isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
        ) : imageData.error ? (
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => retryImageGeneration(phaseIndex, action, actionType, phase)}
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
            onLoad={() => console.log(`Image loaded successfully for ${imageKey}`)}
            onError={() => console.error(`Image failed to load for ${imageKey}`)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AlertCircle className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>
    );

    // Wrap with tooltip for image preview if image is available
    if (imageData?.url) {
      const tooltipContent = (
        <div className="space-y-2">
          <h4 className="font-semibold text-white">{action.name}</h4>
          <p className="text-gray-200 text-sm">{action.description}</p>
          <p className="text-purple-300 text-xs">
            {phase.initiator === 'player' && actionType === 'initiator' ? 'You performed this action' :
             phase.initiator === 'opponent' && actionType === 'reactor' ? 'You performed this action' :
             'Opponent performed this action'}
          </p>
        </div>
      );

      return (
        <Tooltip
          content={tooltipContent}
          imagePreview={imageData.url}
          position="top"
        >
          {imageElement}
        </Tooltip>
      );
    }

    // Regular tooltip for non-image elements
    return (
      <Tooltip
        content={action.description}
        position="top"
        wide={true}
      >
        {imageElement}
      </Tooltip>
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
                  <div className="flex items-center gap-3 mb-1">
                    {renderActionImage(index, phase.initiator_action, 'initiator', phase)}
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
                  <div className="flex items-center gap-3 mb-1">
                    {renderActionImage(index, phase.reactor_action, 'reactor', phase)}
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