import { Settings, User, Bell, Shield, Palette, Database, Globe, ChevronRight, Building } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const sections = [
        { icon: User, label: 'Profile', desc: 'Manage your account details', href: '/dashboard/settings/profile' },
        { icon: Building, label: 'Organization', desc: 'Manage organization and branding', href: '/dashboard/settings/organization' },
        { icon: Bell, label: 'Notifications', desc: 'Configure alert preferences', href: '/dashboard/settings/notifications' },
        { icon: Shield, label: 'Security', desc: 'Password and authentication', href: '/dashboard/settings/security' },
        { icon: Palette, label: 'Appearance', desc: 'Theme and display options', href: '/dashboard/settings/appearance' },
        { icon: Database, label: 'Data', desc: 'Export and backup settings', href: '/dashboard/settings/data' },
        { icon: Globe, label: 'Language', desc: 'Regional preferences', href: '/dashboard/settings/language' },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Settings
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Manage your account and preferences
                    </p>
                </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link key={section.label} href={section.href} className="glass-card rounded-2xl p-5 text-left hover:shadow-lg transition-shadow group block">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                        <Icon className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-800">{section.label}</h3>
                                        <p className="text-sm text-slate-400">{section.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Danger Zone */}
            <div className="mt-8 glass-card rounded-2xl p-6 border border-red-200/50">
                <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-500 mb-4">Irreversible actions</p>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                        Delete Account
                    </button>
                    <button className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        Export All Data
                    </button>
                </div>
            </div>
        </>
    );
}
