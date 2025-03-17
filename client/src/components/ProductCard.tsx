'use client';

import { Product } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useLikeProduct } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { _id, name, price, category, subcategory, likedBy = [] } = product;
    const { isAuthenticated, user } = useAuth();
    const { mutate: likeProduct, isPending } = useLikeProduct();

    // Kiểm tra xem user hiện tại đã thích sản phẩm này chưa
    const isLiked = user ? likedBy.includes(user._id) : false;

    // Tính toán số lượt thích từ độ dài của mảng likedBy
    const totalLikes = likedBy.length;

    const handleLike = () => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để thích sản phẩm');
            return;
        }

        likeProduct(_id);
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="line-clamp-2">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-col gap-2">
                    <p className="text-2xl font-bold">${price}</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{category}</Badge>
                        {subcategory && <Badge variant="secondary">{subcategory}</Badge>}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    disabled={isPending}
                    className="gap-2"
                >
                    <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
                    <span>{totalLikes}</span>
                </Button>
            </CardFooter>
        </Card>
    );
} 