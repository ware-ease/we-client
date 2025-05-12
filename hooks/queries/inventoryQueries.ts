import {
  getBatchLocations,
  getInventories,
  getInventoryById,
  getLocations,
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
  });

// export const useInventoriesByWarehouse = (
//   warehouseId: string,
//   options?: { enabled?: boolean }
// ) =>
//   useQuery<Inventory[], Error>({
//     queryKey: ['inventories', warehouseId],
//     queryFn: () => getWarehouseInventories(warehouseId),
//     enabled: options?.enabled,
//   });

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
export const useInventories = () =>
  useQuery({
    queryKey: ['inventories'],
    queryFn: getInventories,
  });

export const useLocations = (locationId: string) =>
  useQuery({
    queryKey: ['locations', locationId],
    queryFn: () => getLocations(locationId),
  });

export const useInventoryDetails = (inventoryId: string) =>
  useQuery({
    queryKey: ['inventoryDetails', inventoryId],
    queryFn: () => getInventoryById(inventoryId),
  });

export const useBatchLocations = (batchId: string) =>
  useQuery({
    queryKey: ['batchLocations', batchId],
    queryFn: () => getBatchLocations(batchId),
  });
