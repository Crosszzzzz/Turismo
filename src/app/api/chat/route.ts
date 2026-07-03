import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage } from '@/types/route';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface ChatRequest {
  messages: ChatMessage[];
  places?: Array<{
    name: string;
    category: string;
    time: string;
    cost: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const { messages, places } = (await request.json()) as ChatRequest;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: 'Missing GOOGLE_AI_API_KEY' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `Sos el asistente de turismo de Sucre, Bolivia — Ciudad Patrimonio de la Humanidad declarada por la UNESCO en 1991.

CONTEXTO DE SUCRE:
- Altitud: 2,818 msnm
- Clima primaveral todo el año (18-22°C)
- Moneda: Boliviano (BOB)
- Idiomas: Español, Quechua, Aymara
- Fundada en 1538, es una de las ciudades más antiguas de Sudamérica
- Conocida como "La Atenas de Bolivia" por su importancia cultural

REGLAS ESTRICTAS:
1. Tono: Profesional, conciso y formal. CERO EMOJIS. Esta prohibido usar cualquier emoji en toda la respuesta.
2. No muestres coordenadas de latitud ni longitud al usuario.
3. Si el turista no habla español, responder en su idioma.
4. Si no conocés algo, decilo honestamente.
5. Sé amable pero profesional en tus respuestas.`,
    });

    // Build places context if available
    let placesContext = '';
    if (places && places.length > 0) {
      placesContext = `\n\nLUGARES SELECCIONADOS POR EL TURISTA:\n${places.map(p => 
        `${p.name} (${p.category}) - Tiempo: ${p.time} - Costo: ${p.cost}`
      ).join('\n')}`;
    }

    // Format conversation history
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const prompt = `${lastMessage.content}${placesContext}`;

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    return NextResponse.json({ reply: response.text() });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing your request' },
      { status: 500 }
    );
  }
}
