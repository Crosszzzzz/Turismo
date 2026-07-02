'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { RoutePreview } from './RoutePreview';
import type { ChatMessage, GeneratedRoute } from '@/types/route';

interface ChatAssistantProps {
  onRouteGenerated?: (route: GeneratedRoute) => void;
}

export function ChatAssistant({ onRouteGenerated }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu guía virtual de Sucre 🇧🇴\n\nContame:\n- ¿Cuánto tiempo tenés?\n- ¿Cuánto presupuesto?\n- ¿Qué te gusta? (museos, comida, historia, arte...)\n\nY te armo una ruta perfecta para vos.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.route) {
        setGeneratedRoute(data.route);
        onRouteGenerated?.(data.route);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Disculpá, tuve un problema. Intentá de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: '🏛️ Ruta Patrimonial', message: 'Quiero una ruta patrimonial con los monumentos más importantes' },
    { label: '🍽️ Ruta Gastronómica', message: 'Quiero probar la comida típica de Sucre' },
    { label: '🎨 Ruta Artística', message: 'Quiero ver murales, galerías y arte callejero' },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <MapPin className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Asistente de Rutas</h2>
            <p className="text-xs text-green-600">● En línea</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Pensando...</span>
            </div>
          )}
          
          {generatedRoute && (
            <RoutePreview route={generatedRoute} />
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (show only at start) */}
        {messages.length === 1 && (
          <div className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setInput(action.message);
                }}
                className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-left text-sm text-indigo-700 transition hover:bg-indigo-100"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu mensaje..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
