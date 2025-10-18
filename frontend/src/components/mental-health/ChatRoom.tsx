'use client';

import { useEffect, useState, useRef } from 'react';
import { chatAPI } from '~/lib/api';

interface ChatRoomProps {
  contracts: any;
}

export function ChatRoom({ contracts }: ChatRoomProps) {
  const { dbUser } = contracts;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const data = await chatAPI.getMessages(100);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'mood':
        return '😊';
      case 'achievement':
        return '🏆';
      case 'milestone':
        return '🎉';
      case 'admin':
        return '👨‍💼';
      case 'system':
      default:
        return '🤖';
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'mood':
        return 'bg-blue-50 border-blue-200';
      case 'achievement':
        return 'bg-green-50 border-green-200';
      case 'milestone':
        return 'bg-purple-50 border-purple-200';
      case 'admin':
        return 'bg-yellow-50 border-yellow-200';
      case 'system':
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="border border-border rounded-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Community Updates</h2>
              <p className="text-sm text-muted-foreground">
                Admin-maintained chat room • Read-only
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-muted-foreground">Live</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center mb-4">
                <img src="/icons/channel.png" alt="Chat" className="w-20 h-20 object-contain opacity-50" />
              </div>
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 ${getMessageColor(message.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getMessageIcon(message.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">
                        {message.type === 'admin' ? 'Admin' : message.type === 'system' ? 'System' : message.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t border-border bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              This chat room is maintained by admins. Automatic posts include user moods and achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Message Types Legend */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span>😊</span>
          <span className="text-muted-foreground">Mood Update</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>🏆</span>
          <span className="text-muted-foreground">Achievement</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>🎉</span>
          <span className="text-muted-foreground">Milestone</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>👨‍💼</span>
          <span className="text-muted-foreground">Admin Post</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>🤖</span>
          <span className="text-muted-foreground">System</span>
        </div>
      </div>
    </div>
  );
}
