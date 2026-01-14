import NavRail from '@/components/dashboard/NavRail';
import SidebarPanel from '@/components/dashboard/SidebarPanel';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full bg-[#bdc3c7] flex p-3 gap-3 overflow-hidden font-sans relative">
            {/* Blurred Background Graphic for Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-300 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Column 1: Floating Tool Rail */}
            <NavRail />

            {/* Column 2: Navigation Panel */}
            <SidebarPanel />

            {/* Column 3: Main Dashboard Content */}
            <div className="flex-1 glass-panel rounded-[2rem] flex flex-col p-8 z-10 relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}
