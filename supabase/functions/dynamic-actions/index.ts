import OpenAI from 'jsr:@openai/openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DynamicAction {
  name: string;
  description: string;
  damage: number;
  energy_cost: number;
  type: 'character_trait' | 'funny' | 'reactive' | 'custom_input';
}

interface DynamicActionsResponse {
  actions: DynamicAction[];
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Dynamic actions generation request started`);

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log(`[${requestId}] Request body:`, body);
    
    const { character, opponent, phase, opponent_action, turn_number } = body;

    if (!character || !opponent || !phase) {
      console.error(`[${requestId}] Missing required fields in request`);
      return new Response(
        JSON.stringify({ error: 'Character, opponent, and phase are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error(`[${requestId}] OpenAI API key not found in environment`);
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build context based on phase
    const isReacting = phase === 'reacting';
    const phaseContext = isReacting 
      ? `The player is REACTING to the opponent's action: "${opponent_action?.name}" - ${opponent_action?.description}`
      : `The player has INITIATIVE and is choosing their action first.`;

    const turnContext = turn_number ? `This is turn ${turn_number} of the battle.` : 'This is the beginning of the battle.';

    console.log(`[${requestId}] Making OpenAI API call for ${isReacting ? 'reactive' : 'initiative'} actions...`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative combat AI that generates dynamic battle actions. Generate exactly 3 actions based on the context:

1. CHARACTER_TRAIT: An action that showcases the character's unique traits, abilities, or background (20-35 damage, 15-30 energy)
2. FUNNY: A humorous, unexpected, or quirky action that's still combat-effective (15-25 damage, 10-20 energy)  
3. REACTIVE: ${isReacting ? 'A strategic counter or response to the opponent\'s specific action' : 'A tactical action that anticipates opponent responses'} (18-30 damage, 12-25 energy)

Make each action feel fresh and contextually appropriate. Consider the battle situation, character personalities, and what has happened so far. Always respond with valid JSON using the generate_dynamic_actions function.`
        },
        {
          role: "user",
          content: `Generate 3 dynamic combat actions for ${character.character_name} fighting ${opponent.character_name}.

Character: ${character.character_name}
- Description: ${character.description}
- Image prompt: ${character.image_prompt}

Opponent: ${opponent.character_name}  
- Description: ${opponent.description}

Context: ${phaseContext}
${turnContext}

Create actions that are:
1. CHARACTER_TRAIT - Reflects ${character.character_name}'s unique nature and abilities
2. FUNNY - Something humorous or unexpected but still effective
3. REACTIVE - ${isReacting ? `A strategic response to "${opponent_action?.name}"` : 'A tactical move that considers potential opponent responses'}

Make them creative, engaging, and appropriate for the battle context!`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_dynamic_actions",
            parameters: {
              type: "object",
              properties: {
                actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      damage: { type: "number", minimum: 10, maximum: 40 },
                      energy_cost: { type: "number", minimum: 8, maximum: 35 },
                      type: { type: "string", enum: ["character_trait", "funny", "reactive"] }
                    },
                    required: ["name", "description", "damage", "energy_cost", "type"]
                  },
                  minItems: 3,
                  maxItems: 3
                }
              },
              required: ["actions"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_dynamic_actions" } }
    });

    console.log(`[${requestId}] OpenAI API response received`);

    const toolCall = completion.choices[0].message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_dynamic_actions') {
      console.error(`[${requestId}] No valid tool call found in response`);
      throw new Error('Failed to generate dynamic actions - no valid function call');
    }

    let dynamicActions: DynamicActionsResponse;
    try {
      dynamicActions = JSON.parse(toolCall.function.arguments);
      console.log(`[${requestId}] Successfully parsed dynamic actions:`, dynamicActions);
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse function arguments:`, parseError);
      throw new Error('Failed to parse dynamic actions data from OpenAI response');
    }

    // Validate actions array
    if (!Array.isArray(dynamicActions.actions) || dynamicActions.actions.length !== 3) {
      console.error(`[${requestId}] Invalid actions array:`, dynamicActions.actions);
      throw new Error('Must generate exactly 3 dynamic actions');
    }

    // Validate action types
    const expectedTypes = ['character_trait', 'funny', 'reactive'];
    const actionTypes = dynamicActions.actions.map(action => action.type);
    const hasAllTypes = expectedTypes.every(type => actionTypes.includes(type));
    
    if (!hasAllTypes) {
      console.error(`[${requestId}] Missing required action types. Expected: ${expectedTypes.join(', ')}, Got: ${actionTypes.join(', ')}`);
      throw new Error('Actions must include one of each type: character_trait, funny, reactive');
    }

    console.log(`[${requestId}] Dynamic actions generation successful`);

    return new Response(
      JSON.stringify(dynamicActions),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Error in dynamic actions generation:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        requestId: requestId
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});