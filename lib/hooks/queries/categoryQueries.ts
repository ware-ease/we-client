import {
  createCategory,
  getAllCategories,
} from '@/lib/services/categoryService';
import { Category } from '@/lib/types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Category) => createCategory(category),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
