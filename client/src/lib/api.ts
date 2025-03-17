import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

const productApi = {
    getProducts: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/products?page=${page}&limit=${limit}`);

            const responseData = response.data;
            let products = [];
            if (responseData?.items) {
                products = responseData.items;
            }

            return {
                products: products || [],
                totalPages: responseData.pagination.totalPages || 1,
                currentPage: responseData.pagination.page || page,
                totalProducts: responseData.pagination.total || 0,
                hasNextPage: responseData.pagination.hasNext || false,
                hasPreviousPage: responseData.pagination.hasPrevious || false,
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    searchProducts: async (query: string, page = 1, limit = 10) => {
        if (!query.trim()) {
            return productApi.getProducts(page, limit);
        }

        const response = await api.get(`/products/search?q=${query}&page=${page}&limit=${limit}`);

        const items = response.data.data?.items || [];
        const pagination = response.data.data?.pagination || response.data.pagination || {};

        return {
            products: items,
            totalPages: pagination.totalPages || 1,
            currentPage: pagination.page || page,
            totalProducts: pagination.total || 0,
            hasNextPage: pagination.hasNext || false,
            hasPreviousPage: pagination.hasPrevious || false,
        };
    },

    addProduct: async (productData: {
        name: string;
        price: string;
        category: string;
        subcategory: string;
    }) => {
        const response = await api.post('/products', productData);
        return response.data.data;
    },

    likeProduct: async (productId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Bạn cần đăng nhập để thích sản phẩm');
            }

            const response = await api.post(`/products/${productId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data || response.status >= 400) {
                throw new Error(response.data?.message || 'Không thể thích sản phẩm');
            }
            const product = response.data.data;
            if (!product.likedBy) {
                console.warn('API không trả về mảng likedBy:', product);
            }

            return product;
        } catch (error) {
            console.error('Like product API error:', error);

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                localStorage.removeItem('token');
                throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            }

            throw error;
        }
    }
};

const authApi = {
    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('Login API response:', response.data.data);

            if (!response.data.data.tokens.accessToken) {
                console.error('Token không tìm thấy trong response:', response.data);
                throw new Error('Token không tìm thấy trong response');
            }

            return {
                token: response.data.data.tokens.accessToken,
                user: response.data.data.user
            };
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    },

    register: async (userData: { fullName: string; email: string; password: string }) => {
        try {
            const response = await api.post('/auth/register', userData);
            console.log('Register API response:', response.data);

            return {
                token: response.data.token,
                user: response.data.user || response.data.data
            };
        } catch (error) {
            console.error('Register API error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token');
            }

            const response = await api.get('/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.user || response.data.data;
        } catch (error) {
            console.error('Get current user API error:', error);
            throw error;
        }
    }
};

export { productApi, authApi };
