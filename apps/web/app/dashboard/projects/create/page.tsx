'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Rocket, 
    Building2, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Users, 
    Cloud, 
    Zap,
    Loader2
} from 'lucide-react';
import axios from 'axios';

const PLANS = [
    {
        id: 'UMKM',
        name: 'Paket UMKM',
        price: 'IDR 2.500.000',
        period: '/bulan',
        description: 'Cocok untuk kontraktor spesialis dan vendor material.',
        features: [
            'Hingga 500 Dokumen',
            'ISO 19650 Basic Workflow',
            '5GB Cloud Storage',
            'WhatsApp Support',
            'Mobile Field App Access'
        ],
        color: 'border-blue-100 bg-blue-50/30'
    },
    {
        id: 'KORPORASI',
        name: 'Paket Korporasi',
        price: 'IDR 15.000.000',
        period: '/bulan',
        description: 'Untuk BUMN, Main Contractor, dan Proyek Strategis.',
        features: [
            'Unlimited Dokumen',
            'Full 4D & 5D BIM Simulation',
            '500GB Storage + Glacier Archive',
            'ISO 19650 Full Compliance Audit',
            'Dedicated Account Manager',
            'On-Premise Hybrid Setup'
        ],
        color: 'border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
    }
];

export default function CreateProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Choose Plan, 2: Details, 3: Checkout
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        organizationId: 'your-org-id' // Ideally fetched from context
    });

    const handleCreateProject = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/projects-business/create-paid`, {
                ...formData,
                plan: selectedPlan.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Simulate redirect to payment
            setStep(3);
            setTimeout(() => {
                // Mock success
                axios.post(`${process.env.NEXT_PUBLIC_API_URL}/projects-business/checkout/${response.data.projectId}/success`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(() => {
                    router.push('/dashboard/projects');
                });
            }, 3000);
            
        } catch (error) {
            console.error('Failed to create project', error);
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto py-10">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                    Luncurkan Proyek Baru 🚀
                </h1>
                <p className="text-slate-500 font-light max-w-lg mx-auto">
                    Pilih paket yang sesuai dengan skala operasional Anda dan mulai bangun efisiensi digital hari ini.
                </p>
            </div>

            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {PLANS.map((plan) => (
                        <div 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`p-10 rounded-[2.5rem] border-2 cursor-pointer transition-all ${
                                selectedPlan?.id === plan.id ? 'scale-[1.02] border-blue-500 ring-4 ring-blue-500/5' : plan.color
                            }`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-2xl ${plan.id === 'KORPORASI' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                    {plan.id === 'UMKM' ? <Rocket className="w-8 h-8 text-blue-500" /> : <Building2 className="w-8 h-8 text-white" />}
                                </div>
                                {selectedPlan?.id === plan.id && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className={`text-sm mb-6 ${plan.id === 'KORPORASI' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {plan.description}
                            </p>
                            
                            <div className="mb-8">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-sm opacity-60 font-light">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Zap className={`w-4 h-4 ${plan.id === 'KORPORASI' ? 'text-blue-400' : 'text-blue-500'}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => setStep(2)}
                                className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                    plan.id === 'KORPORASI' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                            >
                                Pilih Paket Ini <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="max-w-md mx-auto glass-card p-10 rounded-[2.5rem] animate-in fade-in zoom-in duration-500">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Detail Proyek</h3>
                    <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest font-bold">Paket Terpilih: {selectedPlan?.name}</p>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Nama Proyek</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Apartemen Bintaro Heights"
                                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 bg-slate-50/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Kode Proyek (ISO 19650)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                placeholder="e.g. ABH"
                                className="w-full px-4 py-3 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 bg-slate-50/50"
                            />
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                            <button 
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 border border-slate-100 text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                            >
                                Kembali
                            </button>
                            <button 
                                onClick={handleCreateProject}
                                disabled={loading || !formData.name || !formData.code}
                                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-md mx-auto text-center py-20 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Payment Redirect</h2>
                    <p className="text-slate-500 mb-8 font-light">
                        Anda akan diarahkan ke gerbang pembayaran aman. Mohon tunggu sebentar...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Processing transaction...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
