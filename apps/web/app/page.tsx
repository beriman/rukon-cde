'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle, FolderOpen, Box, ShieldCheck, CheckCircle2, Menu, X } from 'lucide-react';

const RukonLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Rukon2</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Platform</a>
            <a href="#solutions" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Solutions</a>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Pricing</Link>
            <a href="#resources" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Resources</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Log in</Link>
            <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              Book a Demo
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden p-6 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-border-dark animate-fade-in">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <a href="#features" className="py-2">Platform</a>
              <a href="#solutions" className="py-2">Solutions</a>
              <Link href="/pricing" className="py-2">Pricing</Link>
              <a href="#resources" className="py-2">Resources</a>
              <hr className="border-slate-100 dark:border-border-dark" />
              <Link href="/auth" className="py-2">Log in</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232b8cee\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E')] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-surface-dark px-4 py-1.5 rounded-full text-xs font-semibold text-primary mb-8 border border-blue-100 dark:border-border-dark animate-fade-in">
          <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">New</span>
          ISO 19650 Compliance Module v2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
          Master ISO 19650 with <span className="text-primary">Rukon2</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          The ultimate Common Data Environment for digital construction management. 
          Streamline workflows, ensure compliance, and empower your team with next-gen tools.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95">
            Book a Demo
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95">
            <PlayCircle className="w-5 h-5" />
            <span>Watch Video</span>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-24 bg-white dark:bg-surface-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Platform Modules</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Integrated tools designed to handle the complexity of modern construction projects with precision and speed.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* ISO 19650 CDE */}
            <div className="group p-8 rounded-3xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">ISO 19650 CDE</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Fully compliant document management with automated naming conventions and revision control.</p>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Automatic Metadata</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Revision Control</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Audit Trail</li>
              </ul>
            </div>

            {/* BIM Coordination */}
            <div className="group p-8 rounded-3xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">BIM Coordination</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Seamless model federation and clash detection integration directly within the browser.</p>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> IFC Viewer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Issue Tracking (BCF)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Model Comparison</li>
              </ul>
            </div>

            {/* Advanced HSE */}
            <div className="group p-8 rounded-3xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Advanced HSE</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Comprehensive Health, Safety, and Environment tracking with real-time reporting.</p>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Incident Reporting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Safety Inspections</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Compliance Stats</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Rukon2</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering the construction industry with advanced CDE and BIM coordination for ISO 19650 compliance.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 font-medium">
          <p>© 2026 Rukon2 Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RukonLandingPage;
