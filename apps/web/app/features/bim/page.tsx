'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Box, 
  Database, 
  History, 
  AlertTriangle, 
  Zap, 
  RefreshCcw, 
  Layout, 
  ArrowRight, 
  PlayCircle,
  Menu,
  X,
  Construction,
  CheckCircle2
} from 'lucide-react';

const BIMDeepDivePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const formats = [
    { name: 'IFC 4.0', status: 'STABLE', desc: 'Full schema support with optimized parsing speed for large datasets.', meta: '1.2GB/s Parse Rate', icon: Database },
    { name: 'REVIT (RVT)', status: 'PLUGIN', desc: 'Direct bi-directional plugin integration for seamless sync.', meta: 'Auto-Sync Enabled', icon: Box },
    { name: 'AUTOCAD (DWG)', status: null, desc: '2D/3D overlay support with high precision positioning.', meta: 'Layer Mapping', icon: Construction },
    { name: 'NAVISWORKS (NWD)', status: null, desc: 'Import existing coordination models instantly retaining groups.', meta: 'Set Retention', icon: Layers },
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
            <Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Pricing</Link>
            <Link href="/#resources" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Resources</Link>
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
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-surface-dark px-4 py-1.5 rounded-full text-xs font-semibold text-primary mb-8 border border-blue-100 dark:border-border-dark">
                    <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">BIM Module</span>
                    Visual Coordination Engine
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1] uppercase">
                    Visualize the Future of Coordination
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                    Experience the power of our Federated Model engine. Real-time Clash Detection, 
                    Automated Versioning, and Deep BCF Integration all in one place.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95">
                        Request a Custom BIM Demo
                    </button>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <PlayCircle className="w-5 h-5 text-primary" />
                        <span>Watch Tour</span>
                    </button>
                </div>
            </div>

            {/* BIM Viewer Mockup */}
            <div className="relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden aspect-video flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                           <RefreshCcw className="w-3 h-3 animate-spin" /> Live Feature
                        </div>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-black tracking-tight text-white uppercase italic">MEP vs Structural Clash</h3>
                        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                            <div className="flex items-center gap-2 text-red-500 mb-1">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Issue Found</span>
                            </div>
                            <p className="text-xs text-red-200/70 font-medium">Deep BCF Integration: HVAC duct intersecting main beam</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex gap-3 text-slate-500">
                            <Layers className="w-5 h-5" />
                            <Box className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">Model_ID: 884-XJ-09</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-green-500/70">Status: Synced 14ms ago</p>
                        </div>
                    </div>

                    {/* Fake 3D Lines Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none -z-10">
                        <div className="h-full w-full bg-[linear-gradient(90deg,transparent_20%,rgba(255,255,255,0.1)_21%,rgba(255,255,255,0.1)_22%,transparent_23%),linear-gradient(rgba(255,255,255,0.1)_20%,transparent_21%)] bg-[size:50px_50px] [transform:perspective(500px)_rotateX(60deg)]"></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Format Compatibility */}
      <section className="px-6 py-24 bg-white dark:bg-surface-dark/30">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex flex-col md:row justify-between items-end gap-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight uppercase italic">Format Compatibility</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Seamlessly ingest data from any authoring tool. Our engine normalizes geometry and metadata instantly.</p>
                </div>
                <Link href="/docs/specs" className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                    View full specs <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {formats.map((f) => (
                    <div key={f.name} className="p-8 rounded-3xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary transition-colors group">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <f.icon className="w-6 h-6" />
                        </div>
                        {f.status && (
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{f.status}</div>
                        )}
                        <h3 className="text-lg font-black mb-3 tracking-tight uppercase">{f.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">{f.desc}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full w-fit">
                            <Zap className="w-3 h-3 fill-current" /> {f.meta}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Federated Data Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1 flex flex-col gap-6 relative">
                {/* Visual Flow Representation */}
                <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Input Source 01</p>
                        <p className="text-sm font-black uppercase italic">Architecture</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform ml-8">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-lg flex items-center justify-center">
                        <Box className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Input Source 02</p>
                        <p className="text-sm font-black uppercase italic">Plumbing (MEP)</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform ml-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center">
                        <Construction className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Input Source 03</p>
                        <p className="text-sm font-black uppercase italic">Structural</p>
                    </div>
                </div>
                
                {/* Core Hub */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 bg-slate-900 border-4 border-primary rounded-full flex flex-col items-center justify-center text-center shadow-2xl shadow-primary/20 animate-pulse">
                    <RefreshCcw className="w-8 h-8 text-primary mb-1 animate-spin" />
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">Rukon2 Core</p>
                </div>
            </div>

            <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight uppercase italic leading-none">
                    The Power of <br /> <span className="text-primary">Federated Data</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                    Rukon2 merges architectural, structural, and MEP models into a single source of truth, 
                    eliminating silos and reducing rework. Our proprietary algorithm detects conflicts before they reach the site.
                </p>

                <div className="space-y-8">
                    {[
                        { title: 'Unified Truth', desc: 'One central model for all disciplines. No more outdated file versions sent via email.', icon: Database },
                        { title: 'Conflict Resolution', desc: 'Identify and assign issues instantly. Track resolution progress with automated dashboards.', icon: AlertTriangle },
                        { title: 'Smart Versioning', desc: 'Time-travel through your project. Compare any two versions side-by-side visually.', icon: History },
                    ].map((feat) => (
                        <div key={feat.title} className="flex gap-5">
                            <div className="w-12 h-12 bg-white dark:bg-surface-dark border border-slate-100 dark:border-border-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <feat.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest mb-1">{feat.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight uppercase italic">Ready to Streamline Your Coordination?</h2>
            <p className="text-slate-400 mb-12 text-lg font-medium leading-relaxed">
                Join the leading BIM teams using Rukon2 to save time, reduce risk, and deliver better projects.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95">
                    Get Started Now
                </button>
                <button className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/5 transition-all active:scale-95">
                    Contact Sales
                </button>
            </div>
        </div>
      </section>

      {/* Footer (Reused from Landing) */}
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
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
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

export default BIMDeepDivePage;
