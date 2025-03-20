import {
  createWarehouse,
  getAllWarehouses,
} from '@/lib/services/warehouseService';
import { Warehouse } from '@/lib/types/warehouse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useWarehouses = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (w: Warehouse) => createWarehouse(w),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
