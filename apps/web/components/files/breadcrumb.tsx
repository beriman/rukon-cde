import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    name: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-zinc-400" />}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            {item.name}
                        </Link>
                    ) : (
                        <span className="text-zinc-900 dark:text-white font-medium">{item.name}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
