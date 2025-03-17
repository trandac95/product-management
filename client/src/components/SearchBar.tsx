'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
            />
            {query && (
                <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                        setQuery('');
                        onSearch('');
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
} 