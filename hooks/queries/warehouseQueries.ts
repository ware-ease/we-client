import {
  createLocation,
  createWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  getWarehouseById,
  getWarehouseInventoriesById,
  getWarehouseInventoriesByProductId,
  getWarehouseInventoryAdjustments,
  getWarehouseProductsById,
  getWarehouseStockBook,
  getWarehouseStockCardByProductId,
  updateWarehouse,
} from '@/services/warehouseService';
import { Location, Warehouse } from '@/types/warehouse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useWarehouses = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
  });

export const useWarehouseById = (id: string) =>
  useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouseById(id),
  });

export const useWarehousesInventories = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['inventories', id],
    queryFn: () => getWarehouseInventoriesById(id),
    enabled: enabled,
  });

export const useWarehousesProducts = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['warehouse-products', id],
    queryFn: () => getWarehouseProductsById(id),
    enabled: enabled,
  });

export const useWarehousesInventoriesByProductID = (
  enabled: boolean,
  warehouseId: string,
  productId: string
) =>
  useQuery({
    queryKey: ['inventories', warehouseId, productId],
    queryFn: () => getWarehouseInventoriesByProductId(warehouseId, productId),
    enabled: enabled,
  });

export const useWarehousesStockCardByProductID = (
  enabled: boolean,
  warehouseId: string,
  productId: string
) =>
  useQuery({
    queryKey: ['stockcard', warehouseId, productId],
    queryFn: () => getWarehouseStockCardByProductId(warehouseId, productId),
    enabled: enabled,
  });

export const useWarehousesStockBook = (
  enabled: boolean,
  warehouseId: string,
  month: number,
  year: number
) =>
  useQuery({
    queryKey: ['stockbook', warehouseId, month, year],
    queryFn: () => getWarehouseStockBook(warehouseId, month, year),
    enabled: enabled,
  });

export const useWarehouseInventoryAdjustments = (
  enabled: boolean,
  id: string
) =>
  useQuery({
    queryKey: ['adjustments'],
    queryFn: () => getWarehouseInventoryAdjustments(id),
    enabled: enabled,
  });

export const useAddWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (w: Warehouse) => createWarehouse(w),
    onSuccess: () => {
      toast.success('Thêm kho thành công!');
      queryClient.invalidateQueries({
        queryKey: ['warehouses'],
      });
    },
    onError: () => {
      toast.error('Thêm kho thất bại!');
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
