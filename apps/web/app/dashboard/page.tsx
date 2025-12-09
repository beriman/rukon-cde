export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome to Rukon CDE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Projects</h3>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">0</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Files</h3>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">0</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Team Members</h3>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">0</p>
                </div>
            </div>
        </div>
    );
}
