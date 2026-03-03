'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Target, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

const SalesAnalyticsPage = () => {
  const kpis = [
    { label: 'Monthly Recurring Revenue', value: '$124,500', trend: '+14.2%', up: true, icon: DollarSign },
    { label: 'Total Pipeline Value', value: '$2.8M', trend: '+8.1%', up: true, icon: Target },
    { label: 'Win Rate', value: '24.5%', trend: '-2.4%', up: false, icon: TrendingUp },
  ];

  const funnel = [
    { stage: 'Leads', count: 1245, value: '$12.4M', width: 'w-full', color: 'bg-primary' },
    { stage: 'Qualified', count: 480, value: '$4.8M', width: 'w-[80%]', color: 'bg-primary/80' },
    { stage: 'Proposal', count: 120, value: '$1.2M', width: 'w-[40%]', color: 'bg-primary/60' },
    { stage: 'Closed Won', count: 42, value: '$420K', width: 'w-[15%]', color: 'bg-green-500' },
  ];

  const recentDeals = [
    { client: 'Global Infra Group', size: '$85,000', modules: ['BIM', 'CDE'], date: 'Oct 24, 2026' },
    { client: 'BuildIt Inc', size: '$42,000', modules: ['CDE'], date: 'Oct 22, 2026' },
    { client: 'Dubai Sky-Rise P2', size: '$120,000', modules: ['BIM', 'CDE', 'HSE'], date: 'Oct 20, 2026' },
  ];

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Sidebar (Consistent) */}
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
          <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <Users className="w-5 h-5" /> Leads
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm uppercase tracking-widest">
            <BarChart3 className="w-5 h-5" /> Analytics
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
        <header className="mb-10 flex flex-col md:row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic mb-1">Sales Pipeline Analytics</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Executive Overview • Q4 2026</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Calendar className="w-4 h-4 text-slate-400" /> Oct 2026
             </button>
             <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Download className="w-4 h-4 text-slate-400" /> Report
             </button>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm group hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 dark:bg-background-dark rounded-2xl flex items-center justify-center border border-slate-100 dark:border-border-dark group-hover:text-primary transition-colors">
                    <kpi.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${kpi.up ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                </div>
              </div>
              <p className="text-3xl font-black tracking-tight mb-1 italic uppercase">{kpi.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Conversion Funnel */}
            <section className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Conversion Funnel</h2>
                    <Filter className="w-4 h-4 text-slate-300" />
                </div>
                
                <div className="space-y-4">
                    {funnel.map((f) => (
                        <div key={f.stage} className="space-y-2 group">
                            <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest px-1">
                                <span className="group-hover:text-primary transition-colors">{f.stage}</span>
                                <span className="text-slate-400">{f.count} ({f.value})</span>
                            </div>
                            <div className="h-12 w-full bg-slate-50 dark:bg-background-dark/50 rounded-xl overflow-hidden p-1">
                                <div className={`h-full ${f.color} rounded-lg shadow-lg ${f.width} transition-all duration-1000 animate-pulse`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Revenue Forecast Placeholder */}
            <section className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary/70 italic">Revenue Forecast</h2>
                    <TrendingUp className="w-4 h-4 text-primary" />
                </div>

                <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-3xl">
                    <div className="text-center">
                        <BarChart3 className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 italic">Chart Visualization Engine Loading...</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Projected Q4</p>
                        <p className="text-lg font-black italic">$420,000</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Growth Forecast</p>
                        <p className="text-lg font-black italic text-green-400">+22.5%</p>
                    </div>
                </div>
            </section>

            {/* Recent Deals Table */}
            <section className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 dark:border-border-dark flex justify-between items-center">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Recent Deals Won</h2>
                    <Link href="/admin/deals" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View CRM Pipeline</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-background-dark/30">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Name</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Deal Size</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Modules</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Closing Date</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-border-dark">
                            {recentDeals.map((deal, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-background-dark/20 transition-colors group">
                                    <td className="p-6">
                                        <p className="text-sm font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">{deal.client}</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-sm font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">{deal.size}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2">
                                            {deal.modules.map(m => (
                                                <span key={m} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-primary text-[8px] font-black rounded uppercase tracking-widest">{m}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs font-medium text-slate-400 italic uppercase tracking-widest">{deal.date}</td>
                                    <td className="p-6 text-center">
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-background-dark rounded-lg transition-colors text-slate-400">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

export default SalesAnalyticsPage;
