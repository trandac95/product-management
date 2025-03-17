'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Product Management
                </Link>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}`} alt={user?.fullName || ''} />
                                    <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium hidden md:inline-block">
                                    {user?.fullName}
                                </span>
                            </div>
                            <Button variant="outline" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LoginForm />
                            <RegisterForm />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
} 