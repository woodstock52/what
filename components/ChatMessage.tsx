
import React from 'react';
import { ChatMessage as ChatMessageType, GroundingSource } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Simple markdown-ish formatter for the demo
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold handling
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (line.trim().startsWith('- ')) {
        return <li key={i} dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} className="ml-4 list-disc" />;
      }
      if (line.trim().startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine.substring(4) }} />;
      }
      if (line.trim().startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mt-6 mb-3 border-b pb-1" dangerouslySetInnerHTML={{ __html: formattedLine.substring(3) }} />;
      }
      
      return <p key={i} className="mb-2 min-h-[1.5rem]" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
        isUser 
          ? 'bg-blue-600 text-white rounded-tr-none' 
          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
      }`}>
        <div className="flex items-center mb-2 gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
            isUser ? 'bg-blue-500' : 'bg-slate-100'
          }`}>
            <i className={`fas ${isUser ? 'fa-user' : 'fa-balance-scale text-blue-600'}`}></i>
          </div>
          <span className="text-xs font-semibold opacity-70">
            {isUser ? 'Taxpayer' : 'FTA Compliance Expert'}
          </span>
          <span className="text-[10px] opacity-40 ml-auto">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="text-sm leading-relaxed overflow-x-auto markdown-content">
          {formatContent(message.content)}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Legal References & Sources</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] bg-slate-50 border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <i className="fas fa-link text-[9px]"></i>
                  {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
