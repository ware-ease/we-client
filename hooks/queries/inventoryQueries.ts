import {
  getWarehouseInventoryById,
  putAwayGood,
} from '@/services/inventoryService';
import { PutAwayGood } from '@/types/warehouse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useInventoryById = (id: string) =>
  useQuery({
    queryKey: ['inventory', id],
    queryFn: () => getWarehouseInventoryById(id),
    staleTime: 300000,
  });

export const usePutAwayGoods = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (w: PutAwayGood) => putAwayGood(w),
    onSuccess: (value) => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['inventory', value],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
