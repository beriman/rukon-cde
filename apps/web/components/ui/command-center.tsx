import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Command Center Card
 * Glassmorphic dark style with specialized borders
 */
export function CommandCard({ children, className, title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any }) {
    return (
        <div className={cn(
            "bg-[#1e293b]/60 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl",
            className
        )}>
            {title && (
                <div className="px-8 py-6 border-b border-slate-800/50 bg-slate-900/40 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-blue-400" />}
                        <h3 className="font-bold text-white text-sm tracking-tight">{title}</h3>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                </div>
            )}
            <div className="p-8">
                {children}
            </div>
        </div>
    );
}

/**
 * HUD Metric
 * Compact data display for high-density dashboards
 */
export function HUDMetric({ label, value, trend, color = "text-blue-400" }: { label: string, value: string | number, trend?: string, color?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <div className="flex items-end gap-2">
                <p className={cn("text-2xl font-black tracking-tighter", color)}>{value}</p>
                {trend && <span className="text-[10px] font-bold text-green-500 pb-1">{trend}</span>}
            </div>
        </div>
    );
}

/**
 * High-Tech Button
 * Animated focus and click states
 */
export function CommandButton({ children, onClick, variant = "primary", className }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "ghost" | "danger", className?: string }) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]",
        ghost: "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50",
        danger: "bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/30"
    };

    return (
        <button 
            onClick={onClick}
            className={cn(
                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all active:scale-[0.97]",
                variants[variant],
                className
            )}
        >
            {children}
        </button>
    );
}
