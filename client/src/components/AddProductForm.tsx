'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAddProduct } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ProductFormData } from '@/types/product';

export function AddProductForm() {
    const [open, setOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { mutate: addProduct, isPending } = useAddProduct();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        defaultValues: {
            name: '',
            price: '',
            category: '',
            subcategory: '',
        },
    });

    const onSubmit = (data: ProductFormData) => {
        if (!isAuthenticated) {
            toast.error('Please log in to add products');
            return;
        }

        addProduct({ ...data, price: String(data.price) }, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', {
                                required: 'Price is required',
                                min: { value: 0.01, message: 'Price must be greater than 0' },
                                valueAsNumber: true,
                            })}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-500">{errors.price.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            {...register('category', { required: 'Category is required' })}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-500">{errors.category.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input
                            id="subcategory"
                            {...register('subcategory')}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Adding...' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 