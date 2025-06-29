import OpenAI from 'jsr:@openai/openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CharacterGenerationResponse {
  character_name: string;
  description: string;
  hp: number;
  energy: number;
  mana: number;
  powers: Array<{
    name: string;
    description: string;
    energy_cost: number;
    cooldown: number;
    damage_range: string;
  }>;
  image_prompt: string;
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Character creation request started`);
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
    
    const { prompt } = body;

    if (!prompt) {
      console.error(`[${requestId}] Missing prompt in request`);
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`[${requestId}] User prompt: "${prompt}"`);

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error(`[${requestId}] OpenAI API key not found in environment`);
      throw new Error('OpenAI API key not configured');
    }

    console.log(`[${requestId}] Initializing OpenAI client...`);
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log(`[${requestId}] Making OpenAI API call...`);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a game master creating unique battle characters. Generate a character based on the user's prompt, including stats and powers that are balanced for gameplay. CRITICAL: You must generate exactly 3 powers for each character - no more, no less. Always respond with valid JSON using the generate_character function."
        },
        {
          role: "user",
          content: `Create a battle character based on this prompt: ${prompt}. Remember to include exactly 3 unique powers.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_character",
            parameters: {
              type: "object",
              properties: {
                character_name: { type: "string" },
                description: { type: "string" },
                hp: { type: "number", minimum: 80, maximum: 150 },
                energy: { type: "number", minimum: 80, maximum: 120 },
                mana: { type: "number", minimum: 0, maximum: 100 },
                powers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      energy_cost: { type: "number", minimum: 10, maximum: 50 },
                      cooldown: { type: "number", minimum: 3, maximum: 10 },
                      damage_range: { type: "string" }
                    },
                    required: ["name", "description", "energy_cost", "cooldown", "damage_range"]
                  },
                  minItems: 3,
                  maxItems: 3
                },
                image_prompt: { type: "string" }
              },
              required: ["character_name", "description", "hp", "energy", "mana", "powers", "image_prompt"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_character" } }
    });

    console.log(`[${requestId}] OpenAI API response received`);
    console.log(`[${requestId}] Response usage:`, completion.usage);

    const toolCall = completion.choices[0].message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_character') {
      console.error(`[${requestId}] No valid tool call found in response`);
      console.error(`[${requestId}] Full response:`, JSON.stringify(completion, null, 2));
      throw new Error('Failed to generate character - no valid function call');
    }

    console.log(`[${requestId}] Function call arguments:`, toolCall.function.arguments);

    let character: CharacterGenerationResponse;
    try {
      character = JSON.parse(toolCall.function.arguments);
      console.log(`[${requestId}] Successfully parsed character:`, character);
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse function arguments:`, parseError);
      console.error(`[${requestId}] Raw arguments:`, toolCall.function.arguments);
      throw new Error('Failed to parse character data from OpenAI response');
    }

    // Validate required fields
    const requiredFields = ['character_name', 'description', 'hp', 'energy', 'mana', 'powers', 'image_prompt'];
    for (const field of requiredFields) {
      if (!(field in character)) {
        console.error(`[${requestId}] Missing required field: ${field}`);
        throw new Error(`Generated character missing required field: ${field}`);
      }
    }

    // Validate powers array
    if (!Array.isArray(character.powers) || character.powers.length !== 3) {
      console.error(`[${requestId}] Invalid powers array:`, character.powers);
      throw new Error('Character must have exactly 3 powers');
    }

    console.log(`[${requestId}] Character generation successful`);
    console.log(`[${requestId}] Generated character name: ${character.character_name}`);

    return new Response(
      JSON.stringify(character),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Error in character creation:`, error);
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