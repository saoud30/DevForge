import { Mistral } from '@mistralai/mistralai';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const AI_MODELS = {
  GEMINI: 'gemini-1.5',
  XAI: 'grok-beta'
} as const;

interface AIResponse {
  content: string;
  error?: string;
}

export async function generateWithAI(prompt: string, model: keyof typeof AI_MODELS): Promise<AIResponse> {
  try {
    console.log('Generating with model:', model);
    if (model === 'GEMINI') {
      return await generateWithGemini(prompt);
    } else {
      return await generateWithXAI(prompt);
    }
  } catch (error) {
    console.error('Error in generateWithAI:', error);
    return { content: '', error: 'Failed to generate content' };
  }
}

async function generateWithGemini(prompt: string): Promise<AIResponse> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not found');
    }

    console.log('Calling Gemini API...');
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      })
    });

    console.log('Gemini API response received');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content with Gemini');
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    let content = data.candidates[0].content.parts[0].text;
    content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    
    console.log('Successfully generated content with Gemini');
    return { content };
  } catch (error) {
    console.error('Error in generateWithGemini:', error);
    return { content: '', error: error instanceof Error ? error.message : 'Failed to generate content with Gemini' };
  }
}

async function generateWithXAI(prompt: string): Promise<AIResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_XAI_API_KEY) {
      throw new Error('X-AI API key not found');
    }

    console.log('Calling X-AI API...');
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_XAI_API_KEY}`,
        'X-Title': 'DevForge Documentation Generator'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an expert documentation generator.' },
          { role: 'user', content: prompt }
        ],
        model: 'grok-beta',
        temperature: 0.7
      })
    });

    console.log('X-AI API response received');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate content with X-AI');
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    
    console.log('Successfully generated content with X-AI');
    return { content };
  } catch (error) {
    console.error('Error in generateWithXAI:', error);
    return { content: '', error: error instanceof Error ? error.message : 'Failed to generate content with X-AI' };
  }
}