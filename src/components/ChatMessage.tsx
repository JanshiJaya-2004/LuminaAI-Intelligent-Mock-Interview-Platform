import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 py-8 px-4 md:px-8 transition-colors",
        isAssistant ? "bg-white/2" : "bg-transparent"
      )}
    >
      <div className="flex-shrink-0">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border",
          isAssistant ? "bg-brand-accent/10 border-brand-accent/20 text-brand-accent" : "bg-white/5 border-white/10 text-white/50"
        )}>
          {isAssistant ? <Sparkles size={16} /> : <User size={16} />}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "text-[10px] uppercase tracking-widest font-semibold opacity-50",
            isAssistant && "text-brand-accent opacity-100"
          )}>
            {isAssistant ? "Lumina" : "You"}
          </span>
          <span className="text-[10px] opacity-30">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="markdown-body prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};
