'use client';

import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchProducts } from '@/hooks/useProducts';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProductGridProps {
    searchQuery?: string;
}

export function ProductGrid({ searchQuery = '' }: ProductGridProps) {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Use the existing hooks that already implement useInfiniteQuery
    const {
        data,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        status,
        error
    } = useSearchProducts(searchQuery);

    useEffect(() => {
        if (data) {
            if (data.pages[0]?.products) {
                setAllProducts(data.pages.flatMap(page => page.products));
            } else {
                console.error('Products array not found in response');
            }
        }
    }, [data, status, error, hasNextPage]);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '300px',
            threshold: 0.1
        });

        const currentLoaderRef = loaderRef.current;

        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [handleObserver]);

    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage && allProducts.length > 0) {
            const timer = setTimeout(() => {
                fetchNextPage();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, allProducts.length]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-[250px]">
                        <Skeleton className="h-full w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-red-500">Lỗi khi tải sản phẩm: {(error as Error).message}</p>
            </div>
        );
    }

    if (!data || !data.pages || data.pages.length === 0 || allProducts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Phần tử loader ẩn để kích hoạt tải thêm sản phẩm khi cuộn đến */}
            <div ref={loaderRef} className="h-10 w-full">
                {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Đang tải thêm sản phẩm...</span>
                    </div>
                )}
            </div>

            {/* Hiển thị thông báo khi không còn sản phẩm để tải */}
            {!hasNextPage && allProducts.length > 0 && (
                <div className="text-center py-4">
                    <p className="text-gray-500">Đã hiển thị tất cả sản phẩm</p>
                </div>
            )}
        </div>
    );
}