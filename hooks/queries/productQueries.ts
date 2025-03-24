import {
  createProduct,
  deleteProduct,
  getAllProducts,
} from '@/services/productService';
import { ProductCreate } from '@/types/request/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: ProductCreate) => createProduct(product),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
