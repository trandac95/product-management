'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ProductGrid } from '@/components/ProductGrid';
import { AddProductForm } from '@/components/AddProductForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:w-64">
            <SearchBar onSearch={setSearchQuery} initialQuery={searchQuery} />
          </div>
          {isAuthenticated && <AddProductForm />}
        </div>
      </div>

      <ProductGrid searchQuery={searchQuery} />
    </div>
  );
}
