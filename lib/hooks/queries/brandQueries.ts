import { createBrand, getAllBrands } from '@/lib/services/brandService';
import { Brand } from '@/lib/types/brand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useBrands = () =>
  useQuery({
    queryKey: ['brands'],
    queryFn: getAllBrands,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand: Brand) => createBrand(brand),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['brands'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
