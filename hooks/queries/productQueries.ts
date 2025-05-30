import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from '@/services/productService';
import { ProductCreate } from '@/types/request/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
  });

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: ProductCreate) => createProduct(product),
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công!');
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
    onError: () => {
      toast.error('Thêm sản phẩm thất bại!');
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
