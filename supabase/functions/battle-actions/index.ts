import OpenAI from 'jsr:@openai/openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BattleAction {
  name: string;
  description: string;
  attack_points: number;
  type: 'generic' | 'funny' | 'thematic';
}

interface BattleActionsResponse {
  actions: BattleAction[];
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Battle actions generation request started`);
  console.log(`[${requestId}] Method: ${req.method}`);
  console.log(`[${requestId}] URL: ${req.url}`);
  console.log(`[${requestId}] Headers:`, Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Parsing request body...`);
    const body = await req.json();
    console.log(`[${requestId}] Request body:`, body);
    
    const { character, opponent, turn_number } = body;

    if (!character || !opponent) {
      console.error(`[${requestId}] Missing character or opponent in request`);
      return new Response(
        JSON.stringify({ error: 'Character and opponent are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`[${requestId}] Generating actions for: ${character.character_name} vs ${opponent.character_name}`);

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error(`[${requestId}] OpenAI API key not found in environment`);
      throw new Error('OpenAI API key not configured');
    }

    console.log(`[${requestId}] Initializing OpenAI client...`);
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const turnContext = turn_number ? `This is turn ${turn_number} of the battle.` : 'This is the beginning of the battle.';

    console.log(`[${requestId}] Making OpenAI API call...`);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative battle system AI that generates dynamic combat actions. For each turn, create exactly 3 unique battle actions:

1. GENERIC: A straightforward, obvious attack that fits the character's basic combat style (15-25 attack points)
2. FUNNY: A humorous, unexpected, or silly action that's still effective in combat (10-20 attack points)  
3. THEMATIC: A powerful action that deeply reflects the character's unique traits, background, or special abilities (20-35 attack points)

Make each action creative and engaging. The actions should feel fresh and different each turn. Consider the battle context and what has happened so far. Always respond with valid JSON using the generate_battle_actions function.`
        },
        {
          role: "user",
          content: `Generate 3 dynamic battle actions for ${character.character_name} (${character.description}) fighting against ${opponent.character_name} (${opponent.description}). 

Character details:
- Name: ${character.character_name}
- Description: ${character.description}
- Image prompt: ${character.image_prompt}

${turnContext}

Create actions that are:
1. Generic - A basic but effective attack
2. Funny - Something humorous or unexpected 
3. Thematic - Deeply connected to the character's unique nature

Make them creative and engaging!`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_battle_actions",
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
                      attack_points: { type: "number", minimum: 10, maximum: 35 },
                      type: { type: "string", enum: ["generic", "funny", "thematic"] }
                    },
                    required: ["name", "description", "attack_points", "type"]
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
      tool_choice: { type: "function", function: { name: "generate_battle_actions" } }
    });

    console.log(`[${requestId}] OpenAI API response received`);
    console.log(`[${requestId}] Response usage:`, completion.usage);

    const toolCall = completion.choices[0].message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_battle_actions') {
      console.error(`[${requestId}] No valid tool call found in response`);
      console.error(`[${requestId}] Full response:`, JSON.stringify(completion, null, 2));
      throw new Error('Failed to generate battle actions - no valid function call');
    }

    console.log(`[${requestId}] Function call arguments:`, toolCall.function.arguments);

    let battleActions: BattleActionsResponse;
    try {
      battleActions = JSON.parse(toolCall.function.arguments);
      console.log(`[${requestId}] Successfully parsed battle actions:`, battleActions);
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse function arguments:`, parseError);
      console.error(`[${requestId}] Raw arguments:`, toolCall.function.arguments);
      throw new Error('Failed to parse battle actions data from OpenAI response');
    }

    // Validate actions array
    if (!Array.isArray(battleActions.actions) || battleActions.actions.length !== 3) {
      console.error(`[${requestId}] Invalid actions array:`, battleActions.actions);
      throw new Error('Must generate exactly 3 battle actions');
    }

    // Validate action types
    const expectedTypes = ['generic', 'funny', 'thematic'];
    const actionTypes = battleActions.actions.map(action => action.type);
    const hasAllTypes = expectedTypes.every(type => actionTypes.includes(type));
    
    if (!hasAllTypes) {
      console.error(`[${requestId}] Missing required action types. Expected: ${expectedTypes.join(', ')}, Got: ${actionTypes.join(', ')}`);
      throw new Error('Actions must include one of each type: generic, funny, thematic');
    }

    console.log(`[${requestId}] Battle actions generation successful`);
    console.log(`[${requestId}] Generated ${battleActions.actions.length} actions`);

    return new Response(
      JSON.stringify(battleActions),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Error in battle actions generation:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    
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