import {
  createLocation,
  createWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  getWarehouseById,
  getWarehouseInventoriesById,
  getWarehouseInventoryAdjustments,
  updateWarehouse,
} from '@/services/warehouseService';
import { Location, Warehouse } from '@/types/warehouse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useWarehouses = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
    staleTime: 300000,
  });

export const useWarehouseById = (id: string) =>
  useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouseById(id),
    staleTime: 300000,
  });

export const useWarehousesInventories = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['inventories', id],
    queryFn: () => getWarehouseInventoriesById(id),
    staleTime: 300000,
    enabled: enabled,
  });

export const useWarehouseInventoryAdjustments = (
  enabled: boolean,
  id: string
) =>
  useQuery({
    queryKey: ['adjustments', id],
    queryFn: () => getWarehouseInventoryAdjustments(id),
    staleTime: 300000,
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

export const useUpdateWarehouse = () => {
  // Added hook
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      updateWarehouse(id, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật thành công!');
      queryClient.invalidateQueries({
        queryKey: ['warehouse', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
    onError: () => {
      toast.error('Cập nhật thất bại!');
    },
  });
};

export const useDeleteWarehouse = () => {
  // Added hook
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => {
      toast.success('Xóa thành công!');
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
    onError: () => {
      toast.error('Xóa thất bại!');
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
