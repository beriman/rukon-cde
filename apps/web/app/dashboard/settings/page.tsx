'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = response.data;
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/profile`, 
                {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-slate-800 tracking-tight mb-2">
                    Profile Settings
                </h1>
                <p className="text-slate-500 font-light">
                    Manage your personal information and contact details.
                </p>
            </div>

            <div className="glass-card rounded-[2rem] p-8 bg-white border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1 flex items-center gap-2">
                            <User className="w-3 h-3" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all bg-slate-50/50"
                            placeholder="e.g. Beriman Juliano"
                            required
                        />
                    </div>

                    {/* Email (Disabled - from Auth) */}
                    <div className="space-y-2 opacity-60">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm bg-slate-100/50 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-400 ml-1">* Email is managed via Google Account</p>
                    </div>

                    {/* WhatsApp / Phone */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all bg-slate-50/50"
                            placeholder="e.g. +62 812 3456 7890"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Office/Home Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all bg-slate-50/50 min-h-[100px]"
                            placeholder="e.g. Bintaro Jaya, Tangerang Selatan"
                        />
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : 'Update Profile'}
                        </button>
                        
                        {success && (
                            <div className="flex items-center gap-2 text-green-500 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Updated!
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
