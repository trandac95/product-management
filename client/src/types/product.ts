export interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    subcategory: string;
    likes: number;
    likedBy: string[];
    isLiked?: boolean;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
    __v: number;
}

export interface ProductsResponse {
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ProductFormData {
    name: string;
    price: string;
    category: string;
    subcategory: string;
} 