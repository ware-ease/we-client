import {
  createLocation,
  createWarehouse,
  getAllWarehouses,
  getWarehouseInventoriesById,
} from '@/services/warehouseService';
import { Location, Warehouse } from '@/types/warehouse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useWarehouses = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useWarehousesInventories = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['inventories', id],
    queryFn: () => getWarehouseInventoriesById(id),
    staleTime: 300000,
    refetchOnWindowFocus: false,
    enabled: enabled,
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

export const useAddWarehouseLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (location: { locations: Location[] }) =>
      createLocation(location),
    onSuccess: (value) => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['warehouse', value],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
