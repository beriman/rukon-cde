import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
    title: "Rukon CDE - ISO 19650 Platform",
    description: "Common Data Environment for Modern Construction",
};

import { MainProvider } from "@/components/providers/MainProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <MainProvider>
                    {children}
                </MainProvider>
            </body>
        </html>
    );
}
