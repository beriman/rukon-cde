'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  Search, 
  Plus, 
  MoreHorizontal,
  Shield,
  UserPlus,
  Mail,
  CheckCircle2
} from 'lucide-react';

const UserManagementPage = () => {
  const users = [
    { name: 'Engineer Thornton', email: 'alex.t@globalinfra.com', role: 'Engineer', dept: 'Structural', status: 'Active', lastActive: '2 mins ago' },
    { name: 'Sarah Jenkins', email: 's.jenkins@rukon2.com', role: 'Admin', dept: 'Operations', status: 'Active', lastActive: '10 mins ago' },
    { name: 'Michael Chen', email: 'm.chen@buildit.com', role: 'Project Manager', dept: 'MEP', status: 'Inactive', lastActive: '2 days ago' },
    { name: 'Emma Wilson', email: 'e.wilson@globalinfra.com', role: 'Guest', dept: 'Legal', status: 'Active', lastActive: '5 hours ago' },
  ];

  const roles = [
    { name: 'Admin', color: 'bg-red-500', permissions: ['Full System Access', 'Manage Users', 'Billing Control'] },
    { name: 'Project Manager', color: 'bg-blue-500', permissions: ['Project Creation', 'Document Approval', 'Issue Management'] },
    { name: 'Engineer', color: 'bg-green-500', permissions: ['Read/Write CDE', 'Edit BIM', 'View Issues'] },
    { name: 'Guest', color: 'bg-slate-500', permissions: ['Read-only Access', 'View BIM', 'View Documents'] },
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
          <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <FolderKanban className="w-5 h-5" /> Projects
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm uppercase tracking-widest">
            <Users className="w-5 h-5" /> Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-black tracking-tight uppercase italic">User Management</h1>
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <UserPlus className="w-4 h-4" /> Invite User
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* User List Table */}
            <div className="lg:col-span-2 space-y-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or department..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold"
                    />
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-background-dark/30 border-b border-slate-100 dark:border-border-dark">
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Role</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Department</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Active</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-border-dark">
                                {users.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-background-dark/20 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-background-dark flex items-center justify-center text-[10px] font-black">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{user.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                user.role === 'Admin' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' :
                                                user.role === 'Project Manager' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
                                                user.role === 'Engineer' ? 'bg-green-50 dark:bg-green-900/20 text-green-500' :
                                                'bg-slate-50 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{user.dept}</td>
                                        <td className="p-5 text-xs font-medium text-slate-400">{user.lastActive}</td>
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
                </div>
            </div>

            {/* Roles & Permissions Card */}
            <div className="space-y-8">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Role Access Levels</h2>
                    </div>

                    <div className="space-y-8">
                        {roles.map((role) => (
                            <div key={role.name} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-tighter italic">{role.name}</h3>
                                    <div className={`w-2 h-2 rounded-full ${role.color}`}></div>
                                </div>
                                <ul className="space-y-2">
                                    {role.permissions.map((p) => (
                                        <li key={p} className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                            <CheckCircle2 className="w-3 h-3 text-slate-600" /> {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5">
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            Configure Custom Roles
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-sm">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Security Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-background-dark/50 rounded-2xl border border-slate-100 dark:border-border-dark">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold tracking-tight uppercase italic">2FA Enforcement</span>
                            </div>
                            <div className="w-10 h-5 bg-primary rounded-full p-1 relative">
                                <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-background-dark/50 rounded-2xl border border-slate-100 dark:border-border-dark opacity-50">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold tracking-tight uppercase italic">SSO Auth (SAML)</span>
                            </div>
                            <span className="text-[8px] font-black bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">ENTERPRISE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;
