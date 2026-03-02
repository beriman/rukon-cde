'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Split, MessageSquare, FileText, ChevronRight,
  ChevronLeft, History, AlertCircle, CheckCircle2,
  Search, Send, Sparkles, Database, Layers,
  Download, Share2, MoreVertical, Globe, Activity,
  Loader2, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { apiClient } from '@/lib/api-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

export default function SmartReviewPage() {
  const { activeProject, isLoading: isProjectLoading } = useProjectStore();
  const [sliderPos, setSliderOpen] = useState(50);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeProject && !isProjectLoading) {
      router.push('/projects');
      return;
    }
  }, [activeProject, isProjectLoading, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };

    setMessages([...messages, userMessage]);
    setQuery('');
    setIsTyping(true);

    try {
      const res = await apiClient.post('/ai/chat', {
        projectId: activeProject?.id,
        query: userMessage.content
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.answer || "I'm sorry, I couldn't process that request."
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Chat failed:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error connecting to the project database. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden selection:bg-blue-500/30">
      {/* Navigation Header */}
      <header className="h-14 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">{activeProject.name}</h1>
              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1 italic">Smart Review & AI Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-600/20">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">RAG Engine Online</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
            AB
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Main Smart Diff Viewer */}
        <main className="flex-grow relative bg-slate-900 overflow-hidden group">
          {/* Version A (Old) */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592cd58cd47f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale contrast-125">
            <div className="absolute top-6 left-6 z-10 px-3 py-1 rounded bg-slate-950/60 border border-slate-800 backdrop-blur-md">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Version 2.0 (Stable)</span>
            </div>
          </div>

          {/* Version B (New) - Clipped by Slider */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center border-l-2 border-indigo-500 shadow-[-20px_0_100px_rgba(99,102,241,0.2)]"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          >
            <div className="absolute top-6 right-6 z-10 px-3 py-1 rounded bg-indigo-600/20 border border-indigo-500/50 backdrop-blur-md">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">Version 3.1 (Latest)</span>
            </div>
          </div>

          {/* Interactive Slider Handle */}
          <div
            className="absolute inset-y-0 w-1 bg-indigo-500 cursor-ew-resize z-30 flex items-center justify-center group/handle"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={(e) => {
              const move = (moveEvent: MouseEvent) => {
                const newPos = (moveEvent.clientX / window.innerWidth) * 100;
                setSliderOpen(Math.max(0, Math.min(100, newPos)));
              };
              window.addEventListener('mousemove', move);
              window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
            }}
          >
            <div className="h-12 w-8 bg-indigo-600 rounded-lg shadow-2xl flex items-center justify-center text-white border border-indigo-400 group-hover/handle:scale-110 transition-transform">
              <Split size={16} />
            </div>
          </div>

          {/* Bot Panel: Change Log (Simplified for now) */}
          <div className="absolute bottom-6 left-6 right-6 z-40">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Visual Differential Analysis</h3>
                <div className="flex gap-4">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest italic">Swipe slider to compare versions</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - AI Assistant */}
        <aside className="w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-40 shadow-2xl relative">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-600/20 text-indigo-400">
                <MessageSquare size={18} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Project Assistant</h2>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-4 opacity-40">
                <Sparkles size={48} className="text-indigo-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 italic">I can answer questions about drawings, RFIs, and HSE reports in this project.</p>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col gap-3 ${m.role === 'user' ? 'max-w-[85%]' : 'max-w-[95%] ml-auto items-end'}`}>
                <div className={`p-4 rounded-2xl ${m.role === 'user'
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-indigo-600/10 border border-indigo-600/20 text-indigo-100 shadow-xl'
                  } text-sm font-medium leading-relaxed italic shadow-inner`}>
                  {m.content}
                </div>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2">
                  {m.role === 'user' ? 'You' : 'Rukon AI Engine'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col gap-3 max-w-[95%] ml-auto items-end animate-pulse">
                <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-600/10 text-indigo-400 text-sm italic">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-800 bg-slate-950/20">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
                placeholder="Ask about project data..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-14 text-sm font-medium focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700 min-h-[100px] resize-none shadow-inner"
              />
              <button
                onClick={handleSend}
                disabled={!query.trim() || isTyping}
                className="absolute bottom-4 right-4 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
              >
                <Send size={18} fill="currentColor" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic leading-none">Press Cmd+Enter to send query</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Info Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 italic"><Globe size={12} /> Data Source: Federated CDE Vector Index</span>
          <span className="flex items-center gap-2"><Clock size={12} /> Live Processing</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
          <span className="text-emerald-500/80">Rukon2 AI Core v4.2</span>
        </div>
      </footer>
    </div>
  );
}
