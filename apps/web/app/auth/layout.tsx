export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Decorative / Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                        Rukon CDE
                    </div>
                </div>
                <div className="relative z-10">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;The ISO 19650 compliant Common Data Environment for modern construction projects.&rdquo;
                        </p>
                        <footer className="text-sm">Rukon Platform</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right: Form Content */}
            <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full max-w-sm space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
