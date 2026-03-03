'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  TrendingUp, 
  ArrowRight, 
  LayoutGrid, 
  Building2, 
  Store, 
  Factory, 
  ChevronDown,
  Menu,
  X,
  Zap,
  Leaf,
  Users,
  Timer
} from 'lucide-react';

const CaseStudiesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState('All');

  const cases = [
    {
      title: 'LONDON CROSSRAIL EXPANSION',
      location: 'London, UK',
      tags: ['BIM Level 2', 'CDE Compliance'],
      stat: '3x Faster Delivery',
      statIcon: Timer,
      highlight: '40% Less RFI Cycles',
      category: 'Infrastructure',
      color: 'text-primary'
    },
    {
      title: 'DUBAI SKY-RISE PHASE 2',
      location: 'Dubai, UAE',
      tags: ['Project Controls', 'Cost Mgmt'],
      stat: 'Zero Waste Target',
      statIcon: Leaf,
      category: 'Commercial',
      color: 'text-green-500'
    },
    {
      title: 'BERLIN GIGAFACTORY SETUP',
      location: 'Berlin, Germany',
      tags: ['Industrial', 'HSE', 'Supply Chain'],
      stat: '$2M Cost Savings',
      statIcon: Zap,
      category: 'Industrial',
      color: 'text-primary'
    },
    {
      title: 'BAY AREA BRIDGE RETROFIT',
      location: 'San Francisco, USA',
      tags: ['Infrastructure', 'Asset Mgmt'],
      stat: '100% User Adoption',
      statIcon: Users,
      category: 'Infrastructure',
      color: 'text-primary'
    },
    {
      title: 'TOKYO FINANCIAL TOWER',
      location: 'Tokyo, Japan',
      tags: ['Commercial', 'FM'],
      stat: '250% Energy Efficiency',
      statIcon: Zap,
      category: 'Commercial',
      color: 'text-green-500'
    },
    {
      title: 'SYDNEY SOLAR GRID',
      location: 'Sydney, Australia',
      tags: ['Energy', 'Sustainability'],
      stat: 'Real-time Grid Sync',
      statIcon: Zap,
      category: 'Industrial',
      color: 'text-primary'
    }
  ];

  const filteredCases = activeFilter === 'All' 
    ? cases 
    : cases.filter(c => c.category === activeFilter);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold">R</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Rukon2</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#features" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Platform</Link>
            <Link href="/#solutions" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Solutions</Link>
            <Link href="/case-studies" className="text-primary font-bold">Case Studies</Link>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Log in</Link>
            <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              Request Demo
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-24 pb-16 text-center max-w-4xl mx-auto">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 block animate-fade-in">Success Stories</span>
        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1] uppercase italic animate-fade-in">
            Digital Excellence <br /> in Action
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Discover how global leaders are transforming infrastructure delivery with Rukon2's 
            integrated project controls and real-time data insights.
        </p>
      </section>

      {/* Filters */}
      <section className="px-6 mb-16 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 bg-white dark:bg-surface-dark border border-slate-100 dark:border-border-dark rounded-xl text-slate-400">
                <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-surface-dark/50 rounded-2xl border border-slate-200 dark:border-border-dark">
                {['All', 'Infrastructure', 'Commercial', 'Industrial'].map((f) => (
                    <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeFilter === f 
                            ? 'bg-slate-900 dark:bg-primary text-white shadow-lg' 
                            : 'text-slate-500 hover:text-primary'
                        }`}
                    >
                        {f === 'All' ? 'All Projects' : f}
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <main className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
            {filteredCases.map((c, i) => (
                <article 
                    key={c.title} 
                    className="group bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-100 dark:border-border-dark shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                    <div className="flex flex-col h-full">
                        {c.highlight && (
                            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                                <TrendingUp className="w-3 h-3" /> {c.highlight}
                            </div>
                        )}
                        
                        <h3 className="text-xl font-black mb-2 tracking-tight uppercase leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                        
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest">
                            <MapPin className="w-3 h-3" /> {c.location}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {c.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-background-dark/50 text-slate-500 text-[10px] font-bold rounded uppercase tracking-tighter">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {c.stat && (
                            <div className={`mt-auto mb-8 flex items-center gap-3 text-sm font-black uppercase tracking-widest ${c.color}`}>
                                <c.statIcon className="w-5 h-5" /> {c.stat}
                            </div>
                        )}

                        <Link href={`/case-studies/${c.title.toLowerCase().replace(/ /g, '-')}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group/link">
                            View Case Study 
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </article>
            ))}
        </div>

        <div className="mt-20 text-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all group">
                Load More Stories 
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded flex items-center justify-center font-bold text-sm">R</div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              © 2026 Rukon2. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudiesPage;
