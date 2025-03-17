'use client';

import { productApi } from '@/lib/api';
import { Product, ProductFormData, ProductsResponse } from '@/types/product';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useProducts(initialPage = 1, limit = 10) {
    return useInfiniteQuery<ProductsResponse>({
        queryKey: ['products', limit],
        queryFn: ({ pageParam = initialPage }) => productApi.getProducts(pageParam as number, limit),
        getNextPageParam: (lastPage) => {
            return lastPage.currentPage < lastPage.totalPages
                ? lastPage.currentPage + 1
                : undefined;
        },
        initialPageParam: initialPage,
    });
}

export function useSearchProducts(query: string, initialPage = 1, limit = 10) {
    return useInfiniteQuery<ProductsResponse>({
        queryKey: ['products', 'search', query, limit],
        queryFn: ({ pageParam = initialPage }) => productApi.searchProducts(query, pageParam as number, limit),
        getNextPageParam: (lastPage) => {
            return lastPage.currentPage < lastPage.totalPages
                ? lastPage.currentPage + 1
                : undefined;
        },
        initialPageParam: initialPage,
    });
}

export function useAddProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData: ProductFormData) => productApi.addProduct(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product added successfully');
        },
        onError: () => {
            toast.error('Failed to add product');
        },
    });
}

export function useLikeProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Bạn cần đăng nhập để thích sản phẩm');
                }

                return await productApi.likeProduct(productId);
            } catch (error) {
                console.error('Like product error:', error);
                throw error;
            }
        },
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: ['products'] });

            const previousInfiniteData = queryClient.getQueryData(['products']);

            queryClient.setQueriesData({ queryKey: ['products'] }, (oldData: any) => {
                if (!oldData) return oldData;

                if (oldData.pages) {
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            products: page.products.map((product: Product) =>
                                product._id === productId
                                    ? { ...product, likes: product.likes + 1, isLiked: true }
                                    : product
                            ),
                        })),
                    };
                }

                return oldData;
            });

            return { previousInfiniteData };
        },
        onError: (error, _, context) => {
            if (context?.previousInfiniteData) {
                queryClient.setQueryData(['products'], context.previousInfiniteData);
            }
            const errorMessage = error instanceof Error ? error.message : 'Không thể thích sản phẩm';
            toast.error(errorMessage);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
} 