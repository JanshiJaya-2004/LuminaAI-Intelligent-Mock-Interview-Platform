import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="relative max-w-4xl mx-auto w-full px-4 pb-8">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-brand-accent/50 transition-all duration-300 backdrop-blur-xl"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lumina anything..."
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-sm max-h-[200px] text-brand-primary placeholder:text-white/20"
          disabled={disabled}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-3 bg-brand-accent text-white rounded-xl disabled:opacity-20 disabled:grayscale transition-all"
        >
          <ArrowUp size={18} />
        </motion.button>
      </form>
      <div className="mt-3 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
          Powered by Gemini 3.1 Pro &bull; Experimental Intelligence
        </p>
      </div>
    </div>
  );
};
