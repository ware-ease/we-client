import {
  createInventoryAdjustment,
  createInventoryCount,
  deleteInventoryCount,
  getAllInventoryCounts,
  getInventoryCountById,
  updateInventoryCount,
} from '@/services/inventoryCountService';
import { InventoryAdjutment, InventoryCount } from '@/types/inventoryCount';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Hook để lấy tất cả inventory counts
export const useInventoryCounts = (enabled: boolean, warehouseId?: string) =>
  useQuery({
    queryKey: ['inventoryCounts', warehouseId],
    queryFn: () => getAllInventoryCounts(warehouseId),
    refetchOnWindowFocus: false,
    enabled,
  });

// Hook để lấy inventory count theo ID
export const useInventoryCountById = (id?: string) =>
  useQuery({
    queryKey: ['inventoryCounts', id],
    queryFn: () => getInventoryCountById(id!),
    refetchOnWindowFocus: false,
    enabled: !!id, // Chỉ chạy query nếu id tồn tại
  });

// Hook để thêm inventory count mới
export const useAddInventoryCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inventoryCount: InventoryCount) =>
      createInventoryCount(inventoryCount),
    onSuccess: () => {
      toast.success('Thêm inventory count thành công!');
      queryClient.invalidateQueries({
        queryKey: ['inventoryCounts'],
      });
    },
    onError: () => {
      toast.error('Không thể thêm inventory count.');
    },
  });
};

// Hook để cập nhật inventory count
export const useUpdateInventoryCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      inventoryCount,
    }: {
      id: string;
      inventoryCount: InventoryCount;
    }) => updateInventoryCount(id, inventoryCount),
    onSuccess: () => {
      toast.success('Cập nhật inventory count thành công!');
      queryClient.invalidateQueries({
        queryKey: ['inventoryCounts'],
      });
    },
    onError: () => {
      toast.error('Không thể cập nhật inventory count.');
    },
  });
};

// Hook để xóa inventory count
export const useDeleteInventoryCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInventoryCount(id),
    onSuccess: () => {
      toast.success('Xóa inventory count thành công!');
      queryClient.invalidateQueries({
        queryKey: ['inventoryCounts'],
      });
    },
    onError: () => {
      toast.error('Không thể xóa inventory count.');
    },
  });
};
export const useAddInventoryCountAdjustment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inventoryAdjustment: InventoryAdjutment) =>
      createInventoryAdjustment(inventoryAdjustment),
    onSuccess: () => {
      toast.success('Thêm inventory adjustment thành công!');
      queryClient.invalidateQueries({
        queryKey: ['inventoryAdjustments'],
      });
    },
    onError: () => {
      toast.error('Không thể thêm inventory adjustment.');
    },
  });
};
