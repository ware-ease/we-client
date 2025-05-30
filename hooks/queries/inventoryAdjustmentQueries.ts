import { createInventoryAdjustment } from '@/services/inventoryAdjustmentService';
import { InventoryAdjustment } from '@/types/warehouse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useAddInventoryAdjustments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invAdj: InventoryAdjustment) =>
      createInventoryAdjustment(invAdj),
    onSuccess: () => {
      toast.success('Điều chỉnh thành công!');
      queryClient.invalidateQueries({
        queryKey: ['adjustments'],
      });
    },
    onError: () => {
      toast.error('Điều chỉnh thất bại!');
    },
  });
};
