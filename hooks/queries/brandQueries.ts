import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from '@/services/brandService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Lấy danh sách thương hiệu
export const useBrands = () =>
  useQuery({
    queryKey: ['brands'],
    queryFn: getAllBrands,
    staleTime: 300000,
  });

export const useAddBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand: { name: string }) => createBrand(brand),
    onSuccess: () => {
      toast.success('Thêm thương hiệu thành công!');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: () => {
      toast.error('Không thể thêm thương hiệu.');
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateBrand(id, { name }),
    onSuccess: () => {
      toast.success('Cập nhật thương hiệu thành công!');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: () => {
      toast.error('Không thể cập nhật thương hiệu.');
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      toast.success('Xóa thương hiệu thành công!');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: () => {
      toast.error('Không thể xóa thương hiệu.');
    },
  });
};
