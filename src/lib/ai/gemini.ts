import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildRoutePrompt } from './prompts';
import type { ChatMessage, PlaceContext } from '@/types/route';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const MODEL_NAME = 'gemini-2.0-flash';

export async function chatWithAI(
  messages: ChatMessage[],
  placesContext: PlaceContext[]
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
  });

  const formattedPlaces = placesContext
    .map(
      (p) =>
        `- ID: ${p.id} | ${p.name} (${p.category}) | Coords: ${p.latitude}, ${p.longitude} | Costo: ${p.avg_cost} BOB | Tiempo visita: ${p.avg_visit_time}min | Gratis: ${p.is_free} | Rating: ${p.rating_avg}`
    )
    .join('\n');

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const prompt = buildRoutePrompt(
    lastMessage.content,
    formattedPlaces,
    messages.slice(0, -1)
  );

  const result = await chat.sendMessage(prompt);
  const response = result.response;

  return response.text();
}
