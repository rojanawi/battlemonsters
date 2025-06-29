import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Wand2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterPortrait } from './ui/CharacterPortrait';
import { ComicPanel } from './ui/ComicPanel';
import { ActionButton } from './ui/ActionButton';
import { CustomSceneInput } from './ui/CustomSceneInput';
import { FinalizeButton } from './ui/FinalizeButton';
import { RestartModal } from './ui/RestartModal';
import { RegenerateCharacterModal } from './ui/RegenerateCharacterModal';
import { ReplaceActionModal } from './ui/ReplaceActionModal';
import { FinalizeBattleModal } from './ui/FinalizeBattleModal';
import { PostBattleControls } from './ui/PostBattleControls';
import { SkeletonPanel } from './ui/SkeletonPanel';
import { BackToMainModal } from './ui/BackToMainModal';

interface BattlePanel {
  id: string;
  imageUrl?: string;
  isGenerating: boolean;
  error: boolean;
  description: string;
  prompt: string;
  aspectRatio?: string;
  isPlaceholder?: boolean;
  isVillainAction?: boolean;
}

// Predefined layout patterns for each row
const LAYOUT_PATTERNS = [
  [25, 50, 25], // Panel 1 (1/4), Panel 2 (2/4), Panel 3 (1/4)
  [50, 25, 25], // Panel 1 (2/4), Panel 2 (1/4), Panel 3 (1/4)
  [25, 25, 50], // Panel 1 (1/4), Panel 2 (1/4), Panel 3 (2/4)
  [33.33, 33.33, 33.34], // Panel 1 (1/3), Panel 2 (1/3), Panel 3 (1/3)
];

const PANELS_PER_PAGE = 12; // 4 rows × 3 panels per row

export function ComicBattleInterface() {
  const { state, dispatch } = useGame();
  const { character, opponent, demoMode } = state;
  
  const [battlePanels, setBattlePanels] = useState<BattlePanel[]>([]);
  const [customScene, setCustomScene] = useState('');
  const [isGeneratingAction, setIsGeneratingAction] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<Array<{ label: string; description: string }>>([]);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerateTarget, setRegenerateTarget] = useState<'hero' | 'villain' | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceModalTarget, setReplaceModalTarget] = useState<{ index: number; isVillainAction: boolean } | null>(null);
  const [showFinalizeBattleModal, setShowFinalizeBattleModal] = useState(false);
  const [isBattleFinalized, setIsBattleFinalized] = useState(false);
  const [showBackToMainModal, setShowBackToMainModal] = useState(false);
  
  // Ref for the scrollable comic panels container
  const comicScrollRef = useRef<HTMLDivElement>(null);

  // Initialize suggested actions when character is available
  useEffect(() => {
    if (character?.powers) {
      const initialActions = character.powers.slice(0, 3).map(power => ({
        label: power.name,
        description: power.description
      }));
      setSuggestedActions(initialActions);
    }
  }, [character]);

  // Auto-scroll to bottom when new panels are added
  useEffect(() => {
    if (comicScrollRef.current && battlePanels.length > 0) {
      const scrollContainer = comicScrollRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [battlePanels.length]); // Only trigger when panel count changes

  // Update current page when panels are added
  useEffect(() => {
    const totalPages = Math.ceil(battlePanels.length / PANELS_PER_PAGE);
    if (totalPages > 0) {
      setCurrentPage(totalPages - 1); // Always show the latest page
    }
  }, [battlePanels.length]);

  // Function to get a new random action from character powers
  const getRandomAction = (excludeIndex?: number) => {
    if (!character?.powers) return null;
    
    const availablePowers = character.powers.filter((_, index) => index !== excludeIndex);
    if (availablePowers.length === 0) return null;
    
    const randomPower = availablePowers[Math.floor(Math.random() * availablePowers.length)];
    return {
      label: randomPower.name,
      description: randomPower.description
    };
  };

  // Function to get a random villain action
  const getRandomVillainAction = () => {
    if (!opponent?.powers) return null;
    
    const randomPower = opponent.powers[Math.floor(Math.random() * opponent.powers.length)];
    return {
      label: randomPower.name,
      description: randomPower.description
    };
  };

  // Function to replace a specific action with a new random one
  const replaceAction = (actionIndex: number) => {
    const newAction = getRandomAction();
    if (newAction) {
      setSuggestedActions(prev => {
        const newActions = [...prev];
        newActions[actionIndex] = newAction;
        return newActions;
      });
    }
  };

  // Function to get layout pattern for a row
  const getLayoutPattern = (rowIndex: number) => {
    return LAYOUT_PATTERNS[rowIndex % LAYOUT_PATTERNS.length];
  };

  // Function to group panels into pages and rows - FIXED VERSION
  const groupPanelsIntoPages = (panels: BattlePanel[]) => {
    const pages = [];
    const totalPages = Math.ceil(panels.length / PANELS_PER_PAGE);
    
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageStart = pageIndex * PANELS_PER_PAGE;
      const pageEnd = Math.min(pageStart + PANELS_PER_PAGE, panels.length);
      const pagePanels = panels.slice(pageStart, pageEnd);
      
      const rows = [];
      for (let i = 0; i < pagePanels.length; i += 3) {
        const rowPanels = pagePanels.slice(i, Math.min(i + 3, pagePanels.length));
        const globalRowIndex = Math.floor((pageStart + i) / 3);
        const layoutPattern = getLayoutPattern(globalRowIndex);
        
        // Ensure we only use the width patterns for the actual number of panels in this row
        const rowWidths = layoutPattern.slice(0, rowPanels.length);
        
        rows.push({
          panels: rowPanels,
          widths: rowWidths,
          globalStartIndex: pageStart + i
        });
      }
      
      pages.push({ rows, pageIndex });
    }
    
    return pages;
  };

  const generateBattlePanel = async (actionDescription: string, isCustom: boolean = false, isVillainAction: boolean = false) => {
    if (!character || !opponent) return;

    // Generate unique panel ID using timestamp and random number to avoid conflicts
    const panelId = `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Determine which character is performing the action
    const actingCharacter = isVillainAction ? opponent : character;
    const targetCharacter = isVillainAction ? character : opponent;

    // Create detailed battle prompt
    const prompt = `Epic fantasy battle comic panel: ${actingCharacter.character_name} (${actingCharacter.image_prompt}) ${actionDescription} against ${targetCharacter.character_name} (${targetCharacter.image_prompt}). 
    
    Action: ${actionDescription}. Dynamic combat scene with explosive magical effects, dramatic lighting with sparks and energy, debris flying through the air, fierce expressions, dynamic action poses mid-combat, cinematic battle photography, high contrast lighting, magical effects, destruction and chaos, epic confrontation, comic book art style with vibrant colors.`;

    // Add new panel with loading state
    const newPanel: BattlePanel = {
      id: panelId,
      isGenerating: !demoMode, // Don't show generating state in demo mode
      error: false,
      description: actionDescription,
      prompt,
      isPlaceholder: demoMode, // Mark as placeholder in demo mode
      isVillainAction
    };

    // Add the panel to the state immediately
    setBattlePanels(prev => [...prev, newPanel]);

    // In demo mode, just add placeholder and finish
    if (demoMode) {
      if (isCustom) {
        setCustomScene('');
      }
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate battle panel');
      }

      const data = await response.json();
      
      // Update the specific panel by ID
      setBattlePanels(prev => {
        return prev.map(panel => {
          if (panel.id === panelId) {
            return {
              ...panel,
              imageUrl: data.url,
              aspectRatio: data.aspect_ratio,
              isGenerating: false,
              error: false
            };
          }
          return panel;
        });
      });

    } catch (error) {
      console.error('Failed to generate battle panel:', error);
      
      // Update the specific panel by ID to show error
      setBattlePanels(prev => {
        return prev.map(panel => {
          if (panel.id === panelId) {
            return {
              ...panel,
              isGenerating: false,
              error: true
            };
          }
          return panel;
        });
      });
    } finally {
      if (isCustom) {
        setCustomScene('');
      }
    }
  };

  const handleActionClick = async (action: { label: string; description: string }, actionIndex: number) => {
    // Prevent multiple clicks during generation
    if (isGeneratingAction) return;

    setIsGeneratingAction(true);

    try {
      // Generate hero action first
      await generateBattlePanel(action.description);
      
      // Replace the clicked action with a new random one
      replaceAction(actionIndex);
      
      // Generate villain response action
      const villainAction = getRandomVillainAction();
      if (villainAction) {
        await generateBattlePanel(villainAction.description, false, true);
      }
    } finally {
      setIsGeneratingAction(false);
    }
  };

  const handleCustomScene = async () => {
    // Prevent multiple clicks during generation
    if (isGeneratingAction) return;
    
    if (customScene.trim()) {
      setIsGeneratingAction(true);

      try {
        // Generate hero custom action first
        await generateBattlePanel(customScene.trim(), true);
        
        // Generate villain response action
        const villainAction = getRandomVillainAction();
        if (villainAction) {
          await generateBattlePanel(villainAction.description, false, true);
        }
      } finally {
        setIsGeneratingAction(false);
      }
    }
  };

  const handleRetryPanel = (panelIndex: number) => {
    const panel = battlePanels[panelIndex];
    if (panel && !demoMode) { // Don't allow retry in demo mode
      // Update the panel to show loading state
      setBattlePanels(prev => {
        return prev.map((p, index) => {
          if (index === panelIndex) {
            return {
              ...p,
              isGenerating: true,
              error: false
            };
          }
          return p;
        });
      });

      // Regenerate the panel
      generateBattlePanel(panel.description, false, panel.isVillainAction);
    }
  };

  const handleReplacePanel = (panelIndex: number) => {
    const panel = battlePanels[panelIndex];
    if (!panel) return;

    setReplaceModalTarget({ index: panelIndex, isVillainAction: panel.isVillainAction || false });
    setShowReplaceModal(true);
  };

  const handleReplaceActionGenerated = async (newDescription: string) => {
    if (!replaceModalTarget) return;

    const { index: panelIndex, isVillainAction } = replaceModalTarget;
    
    // Update the panel with new description and regenerate
    setBattlePanels(prev => {
      return prev.map((panel, index) => {
        if (index === panelIndex) {
          return {
            ...panel,
            description: newDescription,
            isGenerating: !demoMode,
            error: false,
            imageUrl: demoMode ? undefined : panel.imageUrl
          };
        }
        return panel;
      });
    });

    // Generate new image if not in demo mode
    if (!demoMode) {
      const actingCharacter = isVillainAction ? opponent : character;
      const targetCharacter = isVillainAction ? character : opponent;

      const prompt = `Epic fantasy battle comic panel: ${actingCharacter?.character_name} (${actingCharacter?.image_prompt}) ${newDescription} against ${targetCharacter?.character_name} (${targetCharacter?.image_prompt}). 
      
      Action: ${newDescription}. Dynamic combat scene with explosive magical effects, dramatic lighting with sparks and energy, debris flying through the air, fierce expressions, dynamic action poses mid-combat, cinematic battle photography, high contrast lighting, magical effects, destruction and chaos, epic confrontation, comic book art style with vibrant colors.`;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-image`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to generate battle panel');
        }

        const data = await response.json();
        
        setBattlePanels(prev => {
          return prev.map((panel, index) => {
            if (index === panelIndex) {
              return {
                ...panel,
                imageUrl: data.url,
                aspectRatio: data.aspect_ratio,
                isGenerating: false,
                error: false
              };
            }
            return panel;
          });
        });

      } catch (error) {
        console.error('Failed to generate replacement panel:', error);
        setBattlePanels(prev => {
          return prev.map((panel, index) => {
            if (index === panelIndex) {
              return {
                ...panel,
                isGenerating: false,
                error: true
              };
            }
            return panel;
          });
        });
      }
    }

    setReplaceModalTarget(null);
  };

  const handleDeletePanel = (panelIndex: number) => {
    setBattlePanels(prev => {
      const newPanels = prev.filter((_, index) => index !== panelIndex);
      
      // Update current page after deletion
      const newTotalPages = Math.ceil(newPanels.length / PANELS_PER_PAGE);
      if (newTotalPages === 0) {
        setCurrentPage(0);
      } else if (currentPage >= newTotalPages) {
        setCurrentPage(newTotalPages - 1);
      }
      
      return newPanels;
    });
  };

  const handleFinalizeBattle = () => {
    setShowFinalizeBattleModal(true);
  };

  const handleFinalSceneGenerated = async (description: string) => {
    // Generate the final panel
    await generateBattlePanel(description);
    
    // Mark battle as finalized
    setIsBattleFinalized(true);
    
    // Collapse controls to show the post-battle interface
    setIsControlsExpanded(false);
  };

  const handleDownloadComic = () => {
    // TODO: Implement comic download functionality
    console.log('Download comic functionality to be implemented');
    alert('Download functionality will be implemented soon!');
  };

  const handleShareComic = () => {
    // TODO: Implement comic sharing functionality
    console.log('Share comic functionality to be implemented');
    alert('Share functionality will be implemented soon!');
  };

  const handleRestartComic = () => {
    setBattlePanels([]);
    setCustomScene('');
    setCurrentPage(0);
    setIsBattleFinalized(false);
    setIsControlsExpanded(true);
    setShowRestartModal(false);
  };

  const handleBackToMain = () => {
    // Check if there are any panels in the comic strip
    if (battlePanels.length > 0) {
      setShowBackToMainModal(true);
    } else {
      // No panels, go back directly
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const handleConfirmBackToMain = () => {
    setShowBackToMainModal(false);
    dispatch({ type: 'RESET_GAME' });
  };

  const handleRegenerateCharacter = (target: 'hero' | 'villain') => {
    setRegenerateTarget(target);
    setShowRegenerateModal(true);
  };

  const handleCharacterRegenerated = (newCharacter: any) => {
    if (regenerateTarget === 'hero') {
      dispatch({ type: 'SET_CHARACTER', payload: newCharacter });
      // Reset suggested actions with new character's powers
      if (newCharacter.powers) {
        const newActions = newCharacter.powers.slice(0, 3).map((power: any) => ({
          label: power.name,
          description: power.description
        }));
        setSuggestedActions(newActions);
      }
    } else if (regenerateTarget === 'villain') {
      dispatch({ type: 'SET_OPPONENT', payload: newCharacter });
    }
    
    setShowRegenerateModal(false);
    setRegenerateTarget(null);
  };

  const handleRetryImageGeneration = async () => {
    if (!character) return;
    
    try {
      dispatch({ type: 'SET_GENERATING_IMAGE', payload: true });
      dispatch({ type: 'SET_IMAGE_GENERATION_ERROR', payload: false });
      
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
      
    } catch (error) {
      console.error('Failed to retry character image generation:', error);
      dispatch({ type: 'SET_GENERATING_IMAGE', payload: false });
      dispatch({ type: 'SET_IMAGE_GENERATION_ERROR', payload: true });
    }
  };

  if (!character || !opponent) return null;

  const pages = groupPanelsIntoPages(battlePanels);
  const totalPages = pages.length;
  const currentPageData = pages[currentPage];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidepanel - Hero */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-purple-500/20 p-6 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-purple-500/50 shadow-2xl">
                {state.isGeneratingImage ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-2"></div>
                    <p className="text-xs text-purple-300">Generating...</p>
                  </div>
                ) : state.imageGenerationError ? (
                  <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-orange-600/20 flex flex-col items-center justify-center p-4">
                    <div className="text-red-400 text-xs text-center mb-2">Image failed</div>
                    <button
                      onClick={handleRetryImageGeneration}
                      className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : character.image_url ? (
                  <img
                    src={character.image_url}
                    alt={character.character_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <div className="text-6xl">⚔️</div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                HERO
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              {character.character_name}
            </h2>
            <p className="text-purple-200 text-sm text-center leading-relaxed mb-6">
              {character.description}
            </p>
            
            {/* Regenerate Hero Button */}
            <button
              onClick={() => handleRegenerateCharacter('hero')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Central Comic Strip Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/20 p-4 flex items-center justify-between">
            
            {/* Left Side - Back and Restart Buttons */}
            <div className="flex items-center gap-3">
              {/* Back to Main Button */}
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 text-gray-300 hover:text-gray-200 border border-gray-500/30 hover:border-gray-400/50 rounded-lg font-semibold text-sm transition-all duration-300"
                title="Back to main screen"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {/* Restart Button */}
              <button
                onClick={() => setShowRestartModal(true)}
                disabled={battlePanels.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  battlePanels.length === 0
                    ? 'bg-gray-800/30 border border-gray-600/30 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50'
                }`}
                title="Restart comic strip"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
            </div>

            {/* Title and Page Navigation - Center */}
            <div className="flex items-center gap-4">
              {/* Page Navigation */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-purple-300 hover:text-purple-200 transition-all duration-200"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                    <span className="text-purple-200 text-sm font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-purple-300 hover:text-purple-200 transition-all duration-200"
                    title="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              <h3 className="text-2xl font-bold text-white text-center">
                Battle Comic Strip
                {demoMode && (
                  <span className="ml-3 text-sm font-normal text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                    Demo Mode
                  </span>
                )}
              </h3>
            </div>
            
            {/* Finalize Button - Right Side */}
            <div>
              {!isBattleFinalized && (
                <button
                  onClick={handleFinalizeBattle}
                  disabled={isGeneratingAction || battlePanels.length === 0}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    isGeneratingAction || battlePanels.length === 0
                      ? 'bg-gray-800/30 border border-gray-600/30 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white shadow-lg hover:shadow-orange-500/25 border border-yellow-500/50'
                  }`}
                >
                  Finalize Battle
                </button>
              )}
            </div>
          </div>
          
          {/* Comic Panels and Controls Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Scrollable Comic Panels */}
            <div ref={comicScrollRef} className="flex-1 overflow-y-auto p-6">
              {battlePanels.length === 0 && !isGeneratingAction ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-xl text-purple-300 mb-2">Ready to Create Your Epic Battle Story?</p>
                    <p className="text-purple-400">
                      {demoMode 
                        ? 'Use the controls below to add placeholder panels to your comic!'
                        : 'Use the controls below to generate your first comic panel!'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Show current page panels */}
                  {currentPageData && currentPageData.rows.map((row, rowIndex) => (
                    <div key={`page-${currentPage}-row-${rowIndex}`} className="flex gap-4" style={{ height: '320px' }}>
                      {row.panels.map((panel, panelIndex) => {
                        const globalIndex = row.globalStartIndex + panelIndex;
                        
                        return (
                          <div 
                            key={`${panel.id}-${globalIndex}`} 
                            className="flex flex-col"
                            style={{ width: `${row.widths[panelIndex]}%` }}
                          >
                            <ComicPanel
                              panel={panel}
                              index={globalIndex}
                              onRetry={() => handleRetryPanel(globalIndex)}
                              onReplace={() => handleReplacePanel(globalIndex)}
                              onDelete={() => handleDeletePanel(globalIndex)}
                              demoMode={demoMode}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Battle Controls Section or Post-Battle Controls */}
            {isBattleFinalized ? (
              <PostBattleControls
                onDownload={handleDownloadComic}
                onShare={handleShareComic}
                onRestart={handleRestartComic}
                panelCount={battlePanels.length}
              />
            ) : (
              <div className="bg-gray-900/95 backdrop-blur-sm border-t border-purple-500/30 shadow-2xl">
                
                {/* Collapse/Expand Header */}
                <button
                  onClick={() => setIsControlsExpanded(!isControlsExpanded)}
                  className="w-full p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Battle Controls</span>
                    <span className="text-purple-300 text-sm">
                      {isControlsExpanded ? 'Click to collapse' : 'Click to expand'}
                    </span>
                    {isGeneratingAction && (
                      <div className="flex items-center gap-2 text-purple-300">
                        <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                        <span className="text-sm">Generating...</span>
                      </div>
                    )}
                  </div>
                  <div className="text-purple-400">
                    {isControlsExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expandable Content */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isControlsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="p-6 space-y-6">
                    
                    {/* Suggested Actions */}
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestedActions.map((action, index) => (
                          <ActionButton
                            key={`${action.label}-${index}`}
                            action={action}
                            onClick={() => handleActionClick(action, index)}
                            onRefresh={() => replaceAction(index)}
                            disabled={isGeneratingAction}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Custom Scene Input */}
                    <div>
                      <CustomSceneInput
                        value={customScene}
                        onChange={setCustomScene}
                        onSubmit={handleCustomScene}
                        disabled={isGeneratingAction}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidepanel - Villain */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-purple-500/20 p-6 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-red-500/50 shadow-2xl">
                {opponent.image_url ? (
                  <img
                    src={opponent.image_url}
                    alt={opponent.character_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center">
                    <div className="text-6xl">💀</div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                VILLAIN
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              {opponent.character_name}
            </h2>
            <p className="text-red-200 text-sm text-center leading-relaxed mb-6">
              {opponent.description}
            </p>
            
            {/* Regenerate Villain Button */}
            <button
              onClick={() => handleRegenerateCharacter('villain')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 border border-red-500/30 hover:border-red-400/50 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* Back to Main Confirmation Modal */}
      <BackToMainModal
        isOpen={showBackToMainModal}
        onClose={() => setShowBackToMainModal(false)}
        onConfirm={handleConfirmBackToMain}
        panelCount={battlePanels.length}
      />

      {/* Restart Confirmation Modal */}
      <RestartModal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        onConfirm={handleRestartComic}
      />

      {/* Regenerate Character Modal */}
      <RegenerateCharacterModal
        isOpen={showRegenerateModal}
        onClose={() => {
          setShowRegenerateModal(false);
          setRegenerateTarget(null);
        }}
        onCharacterGenerated={handleCharacterRegenerated}
        targetType={regenerateTarget}
        demoMode={demoMode}
      />

      {/* Replace Action Modal */}
      <ReplaceActionModal
        isOpen={showReplaceModal}
        onClose={() => {
          setShowReplaceModal(false);
          setReplaceModalTarget(null);
        }}
        onActionGenerated={handleReplaceActionGenerated}
        isVillainAction={replaceModalTarget?.isVillainAction || false}
      />

      {/* Finalize Battle Modal */}
      <FinalizeBattleModal
        isOpen={showFinalizeBattleModal}
        onClose={() => setShowFinalizeBattleModal(false)}
        onFinalSceneGenerated={handleFinalSceneGenerated}
      />
    </div>
  );
}