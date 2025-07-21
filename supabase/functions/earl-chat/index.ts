import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, conversation } = await req.json();

    console.log('Received chat request:', { message, conversationLength: conversation?.length });

    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: `You are Earl, a friendly and helpful AI assistant for Experiential, a platform that connects volunteers and organizations with opportunities. 

Your personality:
- Enthusiastic and encouraging about volunteering and making a difference
- Knowledgeable about volunteer work, community service, and social impact
- Helpful with questions about the platform, finding opportunities, and getting involved
- Warm, approachable, and slightly quirky (you're represented by a cute animal character)
- Keep responses concise but friendly

You can help users with:
- Finding volunteer opportunities
- Understanding how the platform works
- Tips for effective volunteering
- Information about different types of community service
- General questions about making a positive impact

Always stay positive and focus on encouraging civic engagement and community involvement!`
      }
    ];

    // Add conversation history if provided
    if (conversation && Array.isArray(conversation)) {
      messages.push(...conversation);
    }

    // Add the current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending to OpenAI with messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using more cost-effective model
        messages: messages,
        max_tokens: 300, // Reduced for efficiency
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const assistantMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Earl chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});