import { useEffect, useRef, useState } from 'react';
import { MessageSquare, RotateCcw, Send, X } from 'lucide-react';
import { MiniMeadowSprout } from './Header';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const STARTER_QUESTIONS = [
  'How do I use the Herbal Shampoo Bar?',
  'Which Eau de Parfum is earthy & woody?',
  'Is the All-Purpose Cleaner pet-safe?',
  'What are shipping & COD terms in India?',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Welcome to Mini Meadow Customer Care. Ask about our Herbal Shampoo Bar, All-Purpose Cleaner, Organic Tulsi Infusion, Botanical Eau de Parfums, or India shipping & COD.',
};

export function CustomerCareWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const sendConversation = async (conversation: ChatMessage[]) => {
    setErrorMsg('');
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45_000);

    try {
      const payloadMessages = conversation
        .filter((m) => m.id !== 'welcome')
        .slice(-10)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/customer-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      });

      let data: { reply?: string; error?: string } = {};
      try {
        data = (await res.json()) as { reply?: string; error?: string };
      } catch {
        data = {};
      }

      if (!res.ok || !data.reply) {
        setErrorMsg(
          data.error || 'Could not reach Mini Meadow Customer Care. Please try again.'
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.reply as string,
        },
      ]);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setErrorMsg('Request timed out. Please click Retry or send your question again.');
      } else {
        setErrorMsg('Network error reaching Customer Care. Please try again.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;
    if (trimmed.length > 600) {
      setErrorMsg('Please keep messages under 600 characters.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    await sendConversation(updatedMessages);
  };

  const handleRetryLast = () => {
    if (isLoading || messages.length <= 1) return;
    void sendConversation(messages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    setMessages([INITIAL_GREETING]);
    setErrorMsg('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Mini Meadow Customer Care chat"
          className="inline-flex items-center gap-2 px-4 py-2.5 h-11 bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[6px] shadow-herbarium text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-transform duration-150 hover:bg-[#2E5A27] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
        >
          <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Customer Care</span>
        </button>
      ) : (
        <section
          role="dialog"
          aria-label="Mini Meadow Customer Care"
          className="w-[calc(100vw-2rem)] sm:w-96 max-h-[75vh] bg-[#FAF8F3] border border-[#D8CEBC] rounded-lg shadow-herbarium flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#EFE9DD] border-b border-[#D8CEBC] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <MiniMeadowSprout className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <h2 className="font-serif text-base font-semibold text-[#1E3F20] truncate">
                  Mini Meadow Customer Care
                </h2>
                <p className="text-[11px] text-[#5C5850] truncate">
                  Formulations, scents, shipping &amp; rituals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset conversation"
                className="p-1.5 text-[#5C5850] hover:text-[#1E3F20] rounded-[4px] hover:bg-[#F7F4EE] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close customer care chat"
                className="p-1.5 text-[#1F2421] border border-[#D8CEBC] bg-[#F7F4EE] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F7F4EE]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-[6px] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#1E3F20] text-[#F7F4EE]'
                      : 'bg-[#EFE9DD] text-[#1F2421] border border-[#D8CEBC]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    className="text-left px-2.5 py-1.5 text-[11px] font-medium bg-[#FAF8F3] border border-[#D8CEBC] rounded-[4px] text-[#1E3F20] hover:border-[#2E5A27] hover:bg-[#EFE9DD] cursor-pointer transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2 rounded-[6px] bg-[#EFE9DD] border border-[#D8CEBC] text-xs text-[#5C5850]">
                  Checking apothecary notes...
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-3 text-xs bg-[#FFDAD6] text-[#93000A] border border-[#BA1A1A]/40 rounded-[4px] flex items-center justify-between gap-2"
              >
                <span>{errorMsg}</span>
                {messages[messages.length - 1]?.role === 'user' && !isLoading && (
                  <button
                    type="button"
                    onClick={handleRetryLast}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-[#93000A] text-[#FAF8F3] rounded-[3px] shrink-0 cursor-pointer hover:opacity-90"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-[#D8CEBC] bg-[#FAF8F3] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              maxLength={600}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about scents, ingredients, COD..."
              aria-label="Message Mini Meadow Customer Care"
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="p-2.5 bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
