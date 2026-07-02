import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { startLocation, places } = await req.json();

    if (!places || places.length === 0) {
      return NextResponse.json({ error: 'No places provided' }, { status: 400 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
       return NextResponse.json({ error: 'Missing GOOGLE_AI_API_KEY' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `Actúa como un guía turístico profesional experto en Sucre, Bolivia.

REGLAS ESTRICTAS:
1. Tono: Profesional, conciso y formal. CERO EMOJIS. Esta prohibido usar cualquier emoji en toda la respuesta.
2. No muestres coordenadas de latitud ni longitud al usuario. Usa solo los nombres de los lugares.
3. NO utilices números, numerales (#), guiones (-), asteriscos (*) ni subrayados (_) en tu respuesta.
4. Utiliza párrafos de texto plano, limpios y fluidos para describir la ruta.
5. Mantén el tono formal y profesional.
6. Incluye tiempo estimado de traslado entre cada parada.
7. Incluye un consejo breve por cada lugar.
8. CRÍTICO: ASUME QUE TODAS LAS COORDENADAS SON CORRECTAS Y ESTÁN EN SUCRE, BOLIVIA. NO digas que las coordenadas están en el océano, ni las corrijas, ni menciones que son incorrectas. Limítate a trazar la ruta.

RESPONDE EXCLUSIVAMENTE CON UN JSON VÁLIDO (sin texto adicional antes o después) con esta estructura exacta:
{
  "introduction": "Descripción breve y profesional de la ruta que se va a realizar",
  "steps": [
    {
      "place": "Nombre del lugar",
      "time": "Tiempo de traslado estimado desde el lugar anterior",
      "description": "Descripción profesional del lugar y qué ver ahí",
      "tip": "Consejo breve y útil para el visitante"
    }
  ],
  "mapsUrl": "https://www.google.com/maps/dir/?api=1&origin=LAT,LNG&destination=LAT,LNG&waypoints=LAT,LNG|LAT,LNG"
}

El mapsUrl debe usar las coordenadas reales proporcionadas. Origin es el punto de partida del usuario. Destination es el último lugar. Waypoints son los intermedios separados por pipe (|).`,
    });

    const placesContext = places.map((p: any) => 
      `${p.name} (Categoría: ${p.category}, Coord: ${p.lat}, ${p.lon}, Tiempo sugerido: ${p.time})`
    ).join('\n');

    const startLocContext = startLocation
      ? `Tu punto de partida es obligatoriamente la ubicación actual del usuario (Current Location). Latitud: ${startLocation.lat}, Longitud: ${startLocation.lng}. Utiliza esta coordenada como origen exacto para calcular la ruta.`
      : 'Partiendo desde el centro de la ciudad (Plaza 25 de Mayo).';

    const prompt = `
${startLocContext}

Deseo visitar los siguientes lugares:
${placesContext}

Genera la ruta óptima en formato JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse as JSON, fallback to raw text if invalid
    let parsed;
    try {
      // Remove markdown code fences if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
      
      // Validate required fields
      if (!parsed.introduction || !parsed.steps || !parsed.mapsUrl) {
        throw new Error('Missing required fields in JSON response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return raw text as fallback
      return NextResponse.json({ routeInfo: text });
    }

    return NextResponse.json({ routeData: parsed });
  } catch (error: any) {
    console.error('Error generating route:', error);
    return NextResponse.json({ error: error.message || 'Error generating route' }, { status: 500 });
  }
}
