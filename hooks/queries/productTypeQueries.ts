import {
  createProductType,
  deleteProductType,
  getAllProductTypes,
  updateProductType,
} from '@/services/productService';
import { ProductType } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Lấy danh sách loại sản phẩm
export const useProductTypes = () =>
  useQuery({
    queryKey: ['product-types'],
    queryFn: getAllProductTypes,
  });

export const useAddProductType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productType: ProductType) => createProductType(productType),
    onSuccess: () => {
      toast.success('Thêm loại sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
    onError: () => {
      toast.error('Không thể thêm loại sản phẩm.');
    },
  });
};

export const useUpdateProductType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, note }: ProductType) =>
      updateProductType(id!, { name, note }),
    onSuccess: () => {
      toast.success('Cập nhật loại sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
    onError: () => {
      toast.error('Không thể cập nhật loại sản phẩm.');
    },
  });
};

export const useDeleteProductType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductType(id),
    onSuccess: () => {
      toast.success('Xóa loại sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
    onError: () => {
      toast.error('Không thể xóa loại sản phẩm.');
    },
  });
};
