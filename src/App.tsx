import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Command, History, Settings, LogOut, Menu, X, Layers, Link as LinkIcon, Activity, Plus } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { streamResponse } from './services/gemini';
import { Message, NimroboProject } from './types';
import { GenerateContentResponse } from "@google/genai";
import { nimroboApi } from './services/nimrobo';

type View = 'chat' | 'nimrobo';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('chat');
  const [projects, setProjects] = useState<NimroboProject[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentView === 'nimrobo') {
      fetchProjects();
    }
  }, [currentView]);

  const fetchProjects = async () => {
    try {
      const data = await nimroboApi.listProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const stream = await streamResponse(content, history);
      let fullContent = '';

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullContent += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: fullContent }
            : msg
        ));
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-ink overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:relative z-50 w-72 h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="font-serif italic text-xl tracking-tight">Lumina</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/50">
                <X size={20} />
              </button>
            </div>

            <div className="px-4 py-2 space-y-1">
              <button 
                onClick={() => setCurrentView('chat')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${currentView === 'chat' ? 'bg-brand-accent/20 text-brand-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <Sparkles size={16} />
                <span>AI Assistant</span>
              </button>
              <button 
                onClick={() => setCurrentView('nimrobo')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${currentView === 'nimrobo' ? 'bg-brand-accent/20 text-brand-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <Layers size={16} />
                <span>Nimrobo AI</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-2 mb-2">Recent Activity</div>
              {[
                "Quantum Computing Basics",
                "The Future of Architecture",
                "Philosophy of Mind",
                "Sustainable Energy Solutions"
              ].map((chat, i) => (
                <button key={i} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 group">
                  <History size={14} className="opacity-40 group-hover:opacity-100" />
                  <span className="truncate">{chat}</span>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 space-y-1">
              <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-bottom border-white/5 flex items-center justify-between px-6 backdrop-blur-md bg-brand-ink/50 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white/50">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">
              {currentView === 'chat' ? 'Lumina Intelligence' : 'Nimrobo Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <Command size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-orange-600 border border-white/20" />
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {currentView === 'chat' ? (
            messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative mb-8"
                >
                  <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full animate-pulse" />
                  <div className="w-24 h-24 bg-brand-accent rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl shadow-brand-accent/20">
                    <Sparkles size={48} className="text-white" />
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-serif italic mb-4"
                >
                  How can I assist you today?
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/40 max-w-md text-sm leading-relaxed"
                >
                  Lumina is your gateway to advanced intelligence. Ask about complex problems, creative projects, or explore Nimrobo AI capabilities.
                </motion.p>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-12 w-full max-w-2xl"
                >
                  {[
                    "Design a Nimrobo Interview project",
                    "Create a Customer Research prompt",
                    "How to use Nimrobo Instant Links?",
                    "Analyze Nimrobo session transcripts"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left text-sm hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <span className="text-white/60 group-hover:text-white">{suggestion}</span>
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} className="h-32" />
              </div>
            )
          ) : (
            <div className="p-8 max-w-6xl mx-auto w-full">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-3xl font-serif italic mb-2">Nimrobo Projects</h1>
                  <p className="text-white/40 text-sm">Manage your voice-based AI projects and links.</p>
                </div>
                <button className="flex items-center gap-2 bg-brand-accent text-white px-6 py-3 rounded-2xl text-sm font-medium hover:scale-105 transition-all">
                  <Plus size={18} />
                  <span>New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-brand-accent/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                          <Layers size={20} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Active</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium mb-2 group-hover:text-brand-accent transition-colors">{project.name}</h3>
                      <p className="text-white/40 text-xs mb-6 line-clamp-2">{project.description || "No description provided."}</p>
                      
                      <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-white/30">
                          <LinkIcon size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Links</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/30">
                          <Activity size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Sessions</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white/2 rounded-3xl border border-dashed border-white/10">
                    <p className="text-white/20 text-sm italic">No projects found. Ask Lumina to help you create one.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Area (Only for Chat) */}
        {currentView === 'chat' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-ink via-brand-ink to-transparent pt-20">
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
