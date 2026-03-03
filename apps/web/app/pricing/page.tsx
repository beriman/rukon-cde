'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Info, ArrowRight, Menu, X } from 'lucide-react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Essential tools for small teams getting started with digital construction.',
      monthlyPrice: 375,
      annualPrice: 299,
      cta: 'Get Started',
      features: [
        '5 Users',
        '100GB CDE Storage',
        'Basic BIM Viewer',
        'Task Management',
        'Standard Support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Full ISO 19650 compliance toolkit for growing construction firms.',
      monthlyPrice: 875,
      annualPrice: 699,
      cta: 'Get Started',
      features: [
        '25 Users',
        '1TB CDE Storage',
        'Advanced BIM Viewer',
        'ISO 19650 Tools',
        'HSE Modules',
        'Priority Email Support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions with unlimited scalability and dedicated support.',
      monthlyPrice: null,
      annualPrice: null,
      cta: 'Contact Sales',
      features: [
        'Unlimited Users',
        'Unlimited Storage',
        'Enterprise BIM Capabilities',
        'Dedicated Success Manager',
        'Custom API & Integrations',
        'SSO & Advanced Security'
      ],
      popular: false
    }
  ];

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
            <Link href="/pricing" className="text-primary font-bold">Pricing</Link>
            <Link href="/#resources" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Resources</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Log in</Link>
            <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              Get a Demo
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-12 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight uppercase">
          Flexible Plans for Digital Construction
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
          Choose the right plan to scale your construction projects efficiently with industry-standard compliance and tools.
        </p>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-primary' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-slate-200 dark:bg-surface-dark rounded-full p-1 transition-colors relative"
          >
            <div className={`w-5 h-5 bg-primary rounded-full shadow-md transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-primary' : 'text-slate-500'}`}>Annual</span>
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
            Save 20%
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl border ${
                plan.popular 
                ? 'border-primary shadow-2xl shadow-primary/10 bg-white dark:bg-surface-dark scale-105 z-10' 
                : 'border-slate-200 dark:border-border-dark bg-white/50 dark:bg-surface-dark/50'
              } transition-all duration-300 hover:scale-[1.02]`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/30">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  {plan.annualPrice ? (
                    <>
                      <span className="text-4xl font-black tracking-tight">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-slate-500 text-sm font-medium">/mo</span>
                    </>
                  ) : (
                    <span className="text-4xl font-black tracking-tight">Custom</span>
                  )}
                </div>
                {plan.annualPrice && (
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                        Billed {isAnnual ? 'annually' : 'monthly'}
                    </p>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Key Features</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                      <div className="mt-1 w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                plan.popular 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-blue-600' 
                : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-24 bg-white dark:bg-surface-dark/30 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-16 text-center tracking-tight uppercase">Compare All Features</h2>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-border-dark shadow-xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark">
                  <th className="p-6 text-sm font-black uppercase tracking-widest text-slate-500">Feature Group</th>
                  <th className="p-6 text-sm font-black uppercase tracking-widest text-slate-500">Starter</th>
                  <th className="p-6 text-sm font-black uppercase tracking-widest text-slate-500">Professional</th>
                  <th className="p-6 text-sm font-black uppercase tracking-widest text-slate-500">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark bg-white dark:bg-background-dark/50">
                {/* Core Platform */}
                <tr className="bg-slate-50/50 dark:bg-surface-dark/50 font-bold text-[10px] uppercase tracking-widest text-primary/70">
                    <td colSpan={4} className="p-4 px-6">Core Platform</td>
                </tr>
                <tr>
                  <td className="p-6 text-sm font-bold">Max Users</td>
                  <td className="p-6 text-sm">5</td>
                  <td className="p-6 text-sm">25</td>
                  <td className="p-6 text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-6 text-sm font-bold">CDE Storage</td>
                  <td className="p-6 text-sm">100 GB</td>
                  <td className="p-6 text-sm">1 TB</td>
                  <td className="p-6 text-sm text-primary font-bold">Unlimited</td>
                </tr>
                {/* BIM */}
                <tr className="bg-slate-50/50 dark:bg-surface-dark/50 font-bold text-[10px] uppercase tracking-widest text-primary/70">
                    <td colSpan={4} className="p-4 px-6">BIM & Coordination</td>
                </tr>
                <tr>
                  <td className="p-6 text-sm font-bold">3D IFC Viewer</td>
                  <td className="p-6 text-sm">Basic</td>
                  <td className="p-6 text-sm">Advanced</td>
                  <td className="p-6 text-sm">Pro Edition</td>
                </tr>
                <tr>
                  <td className="p-6 text-sm font-bold">Clash Detection</td>
                  <td className="p-6 text-sm">—</td>
                  <td className="p-6 text-sm"><Check className="w-4 h-4 text-green-500" /></td>
                  <td className="p-6 text-sm"><Check className="w-4 h-4 text-green-500" /></td>
                </tr>
                {/* Support */}
                <tr className="bg-slate-50/50 dark:bg-surface-dark/50 font-bold text-[10px] uppercase tracking-widest text-primary/70">
                    <td colSpan={4} className="p-4 px-6">Security & Support</td>
                </tr>
                <tr>
                  <td className="p-6 text-sm font-bold">SSO Auth</td>
                  <td className="p-6 text-sm">—</td>
                  <td className="p-6 text-sm">—</td>
                  <td className="p-6 text-sm"><Check className="w-4 h-4 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="p-6 text-sm font-bold">Support Response</td>
                  <td className="p-6 text-sm">48 Hours</td>
                  <td className="p-6 text-sm text-primary font-bold">4 Hours</td>
                  <td className="p-6 text-sm text-primary font-bold">24/7 Dedicated</td>
                </tr>
              </tbody>
            </table>
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
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="text-primary">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-900 dark:text-white">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/api-docs" className="hover:text-primary transition-colors">API Reference</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 font-medium">
          <p>© 2026 Rukon2 Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
