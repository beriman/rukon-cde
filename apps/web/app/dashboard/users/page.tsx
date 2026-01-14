'use client';

import { useState } from 'react';
import {
    Search,
    UserPlus,
    Edit2,
    Trash2,
    Building2,
    Users,
    Mail,
    MoreVertical,
    X,
    Check,
    ChevronDown,
} from 'lucide-react';

// Stakeholder Types (matches CDE folder access)
type StakeholderType = 'owner' | 'pengawas' | 'perencana' | 'kontraktor' | 'user';

interface User {
    id: string;
    name: string;
    email: string;
    company: string;
    stakeholderType: StakeholderType;
    status: 'active' | 'pending' | 'inactive';
    joinedAt: string;
}

// Mock data - grouped by company and stakeholder
const mockUsers: User[] = [
    // Owner
    { id: '1', name: 'Budi Santoso', email: 'budi@ptabc.co.id', company: 'PT ABC Development', stakeholderType: 'owner', status: 'active', joinedAt: '2024-01-15' },
    { id: '2', name: 'Dewi Kartini', email: 'dewi@ptabc.co.id', company: 'PT ABC Development', stakeholderType: 'owner', status: 'active', joinedAt: '2024-01-20' },
    // Pengawas
    { id: '3', name: 'Ahmad Fauzi', email: 'ahmad@konsultanmk.id', company: 'PT Konsultan MK', stakeholderType: 'pengawas', status: 'active', joinedAt: '2024-02-01' },
    { id: '4', name: 'Siti Rahayu', email: 'siti@konsultanmk.id', company: 'PT Konsultan MK', stakeholderType: 'pengawas', status: 'active', joinedAt: '2024-02-05' },
    // Perencana
    { id: '5', name: 'Eko Prasetyo', email: 'eko@arsitekpro.com', company: 'Arsitek Pro Indonesia', stakeholderType: 'perencana', status: 'active', joinedAt: '2024-01-10' },
    { id: '6', name: 'Nina Wulandari', email: 'nina@arsitekpro.com', company: 'Arsitek Pro Indonesia', stakeholderType: 'perencana', status: 'pending', joinedAt: '2024-03-01' },
    // Kontraktor
    { id: '7', name: 'Hendra Gunawan', email: 'hendra@buildmax.co.id', company: 'PT BuildMax Construction', stakeholderType: 'kontraktor', status: 'active', joinedAt: '2024-02-15' },
    { id: '8', name: 'Rudi Hermawan', email: 'rudi@buildmax.co.id', company: 'PT BuildMax Construction', stakeholderType: 'kontraktor', status: 'active', joinedAt: '2024-02-20' },
    { id: '9', name: 'Agus Salim', email: 'agus@buildmax.co.id', company: 'PT BuildMax Construction', stakeholderType: 'kontraktor', status: 'inactive', joinedAt: '2024-01-05' },
    // User
    { id: '10', name: 'Lisa Permata', email: 'lisa@client.com', company: 'Client Company', stakeholderType: 'user', status: 'active', joinedAt: '2024-03-10' },
];

const stakeholderConfig: Record<StakeholderType, { label: string; color: string; folderAccess: string }> = {
    owner: { label: 'Owner', color: 'blue', folderAccess: 'WIP (Owner folder only), Published, Archive' },
    pengawas: { label: 'Pengawas', color: 'emerald', folderAccess: 'WIP (Pengawas), Shared, Published, Archive' },
    perencana: { label: 'Perencana', color: 'violet', folderAccess: 'WIP (Perencana folder only), Published, Archive' },
    kontraktor: { label: 'Kontraktor', color: 'amber', folderAccess: 'WIP (Kontraktor), Shared, Published, Archive' },
    user: { label: 'User', color: 'slate', folderAccess: 'WIP (User folder only), Published, Archive' },
};

export default function UsersPage() {
    const [users] = useState<User[]>(mockUsers);
    const [search, setSearch] = useState('');
    const [filterStakeholder, setFilterStakeholder] = useState<StakeholderType | 'all'>('all');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteStakeholder, setInviteStakeholder] = useState<StakeholderType>('user');
    const [inviteCompany, setInviteCompany] = useState('');

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.company.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterStakeholder === 'all' || user.stakeholderType === filterStakeholder;
        return matchesSearch && matchesFilter;
    });

    // Group users by stakeholder type
    const groupedUsers = filteredUsers.reduce((acc, user) => {
        if (!acc[user.stakeholderType]) {
            acc[user.stakeholderType] = [];
        }
        acc[user.stakeholderType].push(user);
        return acc;
    }, {} as Record<StakeholderType, User[]>);

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Team & Users
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Kelola akses stakeholder ke folder CDE
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite User
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                </div>
                <select
                    value={filterStakeholder}
                    onChange={(e) => setFilterStakeholder(e.target.value as StakeholderType | 'all')}
                    className="px-4 py-3 glass-card rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    <option value="all">All Stakeholders</option>
                    {Object.entries(stakeholderConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                    ))}
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {Object.entries(stakeholderConfig).map(([type, config]) => {
                    const count = users.filter(u => u.stakeholderType === type).length;
                    return (
                        <button
                            key={type}
                            onClick={() => setFilterStakeholder(type as StakeholderType)}
                            className={`glass-card rounded-xl p-4 text-left hover:shadow-lg transition-all ${filterStakeholder === type ? 'ring-2 ring-slate-400' : ''
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg bg-${config.color}-100 flex items-center justify-center mb-2`}>
                                <Users className={`w-4 h-4 text-${config.color}-600`} />
                            </div>
                            <p className="text-2xl font-medium text-slate-800">{count}</p>
                            <p className="text-xs text-slate-500">{config.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* User Groups */}
            <div className="space-y-4">
                {Object.entries(groupedUsers).map(([stakeholderType, userList]) => {
                    const config = stakeholderConfig[stakeholderType as StakeholderType];
                    return (
                        <div key={stakeholderType} className="glass-card rounded-2xl overflow-hidden">
                            {/* Group Header */}
                            <div className={`px-5 py-3 bg-${config.color}-50/50 border-b border-slate-200/50 flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full bg-${config.color}-500`}></div>
                                    <span className="font-medium text-slate-800">{config.label}</span>
                                    <span className="text-xs text-slate-400">({userList.length} users)</span>
                                </div>
                                <span className="text-xs text-slate-500">
                                    Access: {config.folderAccess}
                                </span>
                            </div>

                            {/* User List */}
                            <div className="divide-y divide-slate-100">
                                {userList.map((user) => (
                                    <div key={user.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/30 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-full bg-${config.color}-100 flex items-center justify-center text-sm font-medium text-${config.color}-600`}>
                                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-800">{user.name}</span>
                                                    {user.status === 'pending' && (
                                                        <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">Pending</span>
                                                    )}
                                                    {user.status === 'inactive' && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Inactive</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-3 h-3" />
                                                        {user.company}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                                                <Edit2 className="w-4 h-4 text-slate-400" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {Object.keys(groupedUsers).length === 0 && (
                <div className="glass-card rounded-2xl p-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No users found</p>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium text-slate-800">Invite User</h2>
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="user@company.com"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                                <input
                                    type="text"
                                    value={inviteCompany}
                                    onChange={(e) => setInviteCompany(e.target.value)}
                                    placeholder="PT Example Company"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>

                            {/* Stakeholder Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Stakeholder Type</label>
                                <select
                                    value={inviteStakeholder}
                                    onChange={(e) => setInviteStakeholder(e.target.value as StakeholderType)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    {Object.entries(stakeholderConfig).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-400 mt-1">
                                    Akses: {stakeholderConfig[inviteStakeholder].folderAccess}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: Send invite API call
                                        alert(`Invite sent to ${inviteEmail}`);
                                        setShowInviteModal(false);
                                        setInviteEmail('');
                                        setInviteCompany('');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    Send Invite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
