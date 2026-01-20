
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import { queryTaxExpert } from './services/geminiService';
import { ChatMessage as ChatMessageType, TaxType } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AI UAE Tax Expert. I can provide detailed guidance on Corporate Tax, VAT, and Excise Tax, citing specific FTA Decree-Laws and Articles.\n\nHow can I assist you with your UAE tax compliance today?',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await queryTaxExpert(input);
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please ensure you have a valid internet connection or try again later.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Corporate Tax registration requirements for Free Zone companies?",
    "VAT treatment for export of services outside the GCC?",
    "Excise tax rates on energy drinks and sweetened beverages?",
    "Administrative penalties for late VAT registration?"
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1 overflow-hidden relative flex flex-col max-w-5xl mx-auto w-full">
        {/* Messages area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-8 md:px-8 custom-scrollbar"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 italic">Analyzing FTA laws and recent regulations...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          {messages.length === 1 && !isLoading && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="text-left text-xs p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600"
                >
                  <i className="fas fa-chevron-right text-blue-500 mr-2 text-[10px]"></i>
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center bg-white border border-slate-300 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about CT, VAT, or Excise tax laws..."
              className="w-full py-4 px-6 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`mr-2 p-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          <p className="text-[10px] text-center mt-3 text-slate-400 font-medium">
            DISCLAIMER: This AI advisor provides information based on public FTA records. Always verify with a certified tax professional for official filing.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
