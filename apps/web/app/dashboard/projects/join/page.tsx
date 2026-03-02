'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Users, 
    Hash, 
    Send, 
    CheckCircle2, 
    Loader2,
    Info
} from 'lucide-react';
import axios from 'axios';

export default function JoinProjectPage() {
    const router = useRouter();
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/projects-business/join/${projectId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send join request');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Permintaan Terkirim!</h2>
                <p className="text-slate-500 text-center max-w-sm mb-8 font-light">
                    Pemilik proyek telah menerima notifikasi Anda. Mohon tunggu konfirmasi di Private Inbox Anda.
                </p>
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                    Kembali ke Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto py-20">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Gabung Proyek</h1>
                <p className="text-slate-500 font-light">
                    Masukkan Project ID yang diberikan oleh admin proyek Anda.
                </p>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] bg-white border border-slate-100">
                <form onSubmit={handleJoin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1 flex items-center gap-2">
                            <Hash className="w-3 h-3" /> Project Unique ID
                        </label>
                        <input
                            type="text"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                            className="w-full px-4 py-4 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-300 transition-all bg-slate-50/50 font-mono"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-start gap-3 border border-red-100">
                            <Info className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !projectId}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Memeriksa ID...
                            </>
                        ) : (
                            <>
                                Kirim Permintaan Gabung <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-light">
                        Tidak punya ID? Hubungi manajer proyek Anda untuk mendapatkan akses.
                    </p>
                </div>
            </div>
        </div>
    );
}
