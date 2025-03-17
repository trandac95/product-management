'use client';

import { ReactNode } from 'react';
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
                <AuthProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-6">
                            {children}
                        </main>
                        <footer className="border-t py-4">
                            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                                © {new Date().getFullYear()} Mini Store App
                            </div>
                        </footer>
                    </div>
                    <Toaster />
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
    );
} 