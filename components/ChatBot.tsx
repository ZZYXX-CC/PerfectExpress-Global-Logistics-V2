import React, { useState, useRef, useEffect } from 'react';
import { chatWithSupport } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your PerfectExpress assistant. How can I help you with your shipping today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await chatWithSupport(input, messages);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I'm having a bit of trouble. Please try again or contact our support team." }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150]">
      {isOpen ? (
        <div className="bg-bgSurface w-80 md:w-[380px] h-[550px] rounded border border-borderColor shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-5 bg-bgMain flex justify-between items-center border-b border-borderColor">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-bgSurface flex items-center justify-center border border-borderColor">
                <iconify-icon icon="solar:headphones-round-linear" width="20" class="text-red-600"></iconify-icon>
              </div>
              <div>
                 <span className="block font-extrabold text-[10px] tracking-widest uppercase text-textMain heading-font">Help Assistant</span>
                 <span className="block text-[8px] text-textMuted font-bold uppercase tracking-widest">We're here to help</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-textMain transition-colors">
              <iconify-icon icon="solar:close-circle-linear" width="22"></iconify-icon>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-bgMain/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-sm text-xs font-medium leading-relaxed ${m.role === 'user' ? 'bg-textMain text-bgMain shadow-lg' : 'bg-bgMain text-textMain border border-borderColor'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-bgMain px-4 py-3 rounded-sm border border-borderColor">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-borderColor bg-bgMain">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 bg-bgSurface/40 border border-borderColor rounded-sm px-4 py-3 text-[10px] focus:outline-none focus:border-textMuted text-textMain font-bold tracking-widest uppercase"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="w-12 h-11 bg-textMain hover:opacity-90 text-bgMain rounded-sm flex items-center justify-center transition-all">
                <iconify-icon icon="solar:arrow-right-linear" width="18"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-bgSurface hover:bg-bgMain rounded border border-borderColor shadow-2xl flex items-center justify-center text-red-600 transition-all hover:scale-105 active:scale-95 group"
        >
          <iconify-icon icon="solar:headphones-round-linear" width="28" class="group-hover:scale-110 transition-transform"></iconify-icon>
        </button>
      )}
    </div>
  );
};

export default ChatBot;