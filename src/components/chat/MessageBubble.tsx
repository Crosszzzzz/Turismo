'use client';

import { MapPin } from 'lucide-react';
import type { ChatMessage } from '@/types/route';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-500">Guía Sucre</span>
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
    </div>
  );
}
