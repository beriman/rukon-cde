'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronLeft,
  MoreHorizontal,
  ExternalLink,
  MessageSquare,
  Clock,
  Briefcase,
  ShieldCheck,
  Building
} from 'lucide-react';

const LeadDetailPage = ({ params }: { params: { id: string } }) => {
  const lead = {
    name: 'Alex Thornton',
    company: 'Global Infra Group',
    role: 'Information Manager',
    status: 'Qualified',
    email: 'alex.t@globalinfra.com',
    phone: '+44 20 7946 0123',
    linkedin: 'linkedin.com/in/alexthornton',
    projectValue: '$50M+',
    industry: 'Infrastructure',
    interests: ['ISO 19650 CDE', 'BIM Coordination'],
    timeline: [
      { date: 'Oct 22, 2026', time: '10:30 AM', event: 'Form Submitted', type: 'system' },
      { date: 'Oct 22, 2026', time: '11:00 AM', event: 'Intro Email Sent', type: 'email' },
      { date: 'Oct 23, 2026', time: '02:00 PM', event: 'Scheduled Demo', type: 'calendar' },
    ]
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Sidebar (Reused) */}
      <aside className="w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark p-6 flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-lg font-black tracking-tight uppercase italic">Rukon2 Admin</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm uppercase tracking-widest">
            <Users className="w-5 h-5" /> Leads
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <FolderKanban className="w-5 h-5" /> Projects
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <Link href="/admin/leads" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary mb-6 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Back to Leads
          </Link>
          
          <div className="flex flex-col md:row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-100 dark:bg-background-dark rounded-3xl flex items-center justify-center text-2xl font-black italic uppercase text-primary border border-slate-200 dark:border-border-dark shadow-xl">
                    AT
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase italic">{lead.name}</h1>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {lead.role} at <span className="text-primary">{lead.company}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <select className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>New</option>
                    <option>Contacted</option>
                    <option selected>Qualified</option>
                    <option>Closed</option>
                </select>
                <button className="p-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl hover:bg-slate-50 transition-all">
                    <Mail className="w-5 h-5 text-slate-400" />
                </button>
                <button className="p-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl hover:bg-slate-50 transition-all">
                    <Calendar className="w-5 h-5 text-slate-400" />
                </button>
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all active:scale-95">
                    Create Quote
                </button>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Left Col: Info Cards */}
            <div className="md:col-span-2 space-y-8">
                {/* Contact Info */}
                <div className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                                    <p className="text-sm font-bold">{lead.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</p>
                                    <p className="text-sm font-bold">{lead.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn Profile</p>
                                    <a href="#" className="text-sm font-bold text-primary hover:underline">{lead.linkedin}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Context */}
                <div className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Project Context</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Value</p>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary" />
                                <p className="text-lg font-black italic uppercase tracking-tight">{lead.projectValue}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Industry</p>
                            <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-primary" />
                                <p className="text-sm font-bold uppercase">{lead.industry}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">ISO 19650 Interests</p>
                            <div className="flex flex-wrap gap-2">
                                {lead.interests.map(i => (
                                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-tighter">
                                        {i}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Internal Notes */}
                <div className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Internal Notes</h2>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Add Note</button>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-background-dark/50 rounded-2xl border border-slate-100 dark:border-border-dark">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sarah Jenkins • Oct 22, 2026</p>
                            </div>
                            <p className="text-sm font-medium leading-relaxed">
                                Lead is very interested in the automated naming convention feature. They currently use a manual process that takes 4+ hours per day.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Timeline */}
            <div className="space-y-8">
                <div className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">Activity Timeline</h2>
                    <div className="relative space-y-12">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-border-dark"></div>
                        
                        {lead.timeline.map((t, idx) => (
                            <div key={idx} className="relative flex gap-6">
                                <div className="w-10 h-10 bg-white dark:bg-surface-dark border-2 border-slate-100 dark:border-border-dark rounded-full flex items-center justify-center z-10 text-primary">
                                    {t.type === 'system' && <ShieldCheck className="w-4 h-4" />}
                                    {t.type === 'email' && <Mail className="w-4 h-4" />}
                                    {t.type === 'calendar' && <Calendar className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.date} • {t.time}</p>
                                    <p className="text-sm font-black uppercase italic">{t.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetailPage;
