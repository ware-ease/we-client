import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '@/services/categoryService';
import { Category } from '@/types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 300000,
  });

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Category) => createCategory(category),
    onSuccess: () => {
      toast.success('Thêm danh mục thành công!');
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Không thể thêm danh mục.');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công!');
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Không thể cập nhật danh mục.');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công!');
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Không thể xóa danh mục.');
    },
  });
};
