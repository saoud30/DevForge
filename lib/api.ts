const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateContent(prompt: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('API key is not set');
    }

    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error.message || response.statusText}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Unexpected API response structure');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in generateContent:', error);
    throw error;
  }
}