'use client';

import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  TrendingUp, 
  Percent, 
  Euro, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Plus, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminLeadsPage = () => {
  const stats = [
    { label: 'Total Leads', value: '1,245', trend: '+12%', icon: Users },
    { label: 'Conversion Rate', value: '18.5%', trend: '+2.5%', icon: Percent },
    { label: 'Avg Project Value', value: '€45,000', trend: '+5%', icon: Euro },
  ];

  const leads = [
    { name: 'John Doe', company: 'Acme Corp', industry: 'Construction', value: '€50,000', interest: 'BIM', source: 'Website', status: 'New' },
    { name: 'Jane Smith', company: 'BuildIt Inc', industry: 'Engineering', value: '€75,000', interest: 'CDE', source: 'Referral', status: 'Contacted' },
    { name: 'Bob Johnson', company: 'Design Co', industry: 'Architecture', value: '€30,000', interest: 'HSE', source: 'Cold Call', status: 'Qualified' },
    { name: 'Alice Brown', company: 'Tech Solutions', industry: 'IT', value: '€120,000', interest: 'BIM', source: 'Event', status: 'Closed' },
    { name: 'Charlie Davis', company: 'Green Builders', industry: 'Sustainability', value: '€40,000', interest: 'CDE', source: 'Website', status: 'New' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Contacted': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Qualified': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Closed': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark p-6 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-lg font-black tracking-tight uppercase italic">Rukon2 Admin</span>
        </div>

        <nav className="space-y-2 flex-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm uppercase tracking-widest">
            <Users className="w-5 h-5" /> Leads
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <FolderKanban className="w-5 h-5" /> Projects
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-border-dark">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-background-dark"></div>
                <div>
                    <p className="text-xs font-black uppercase tracking-widest">Admin User</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tighter">admin@rukon2.com</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Lead Management Dashboard</h1>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Download className="w-4 h-4" /> Export CSV
             </button>
             <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all active:scale-95">
                <Plus className="w-4 h-4" /> Add Lead
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-200 dark:border-border-dark shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">
                    <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                <span className="flex items-center gap-1 text-xs font-bold text-green-500">
                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search leads, companies..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl font-bold text-xs whitespace-nowrap">
              <Filter className="w-4 h-4 text-slate-400" /> Status
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl font-bold text-xs whitespace-nowrap">
              <Calendar className="w-4 h-4 text-slate-400" /> Last 30 Days
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-background-dark/30 border-b border-slate-100 dark:border-border-dark">
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lead Name</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Company</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Industry</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Value</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interests</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-border-dark">
                {leads.map((lead, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-background-dark/20 transition-colors group">
                    <td className="p-5">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{lead.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">via {lead.source}</p>
                    </td>
                    <td className="p-5 text-sm font-medium">{lead.company}</td>
                    <td className="p-5 text-sm font-medium">{lead.industry}</td>
                    <td className="p-5 text-sm font-black">{lead.value}</td>
                    <td className="p-5">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-primary text-[10px] font-black rounded uppercase tracking-tighter">
                        {lead.interest}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-background-dark rounded-lg transition-colors text-slate-400">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-slate-50 dark:border-border-dark flex flex-col md:row justify-between items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Showing 1-5 of 1,245 Results</p>
            <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-200 dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-background-dark transition-all disabled:opacity-50" disabled>
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, '...', 12].map((p, i) => (
                        <button key={i} className={`w-8 h-8 rounded-lg text-[10px] font-black ${p === 1 ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-background-dark text-slate-400'}`}>
                            {p}
                        </button>
                    ))}
                </div>
                <button className="p-2 border border-slate-200 dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-background-dark transition-all">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLeadsPage;
