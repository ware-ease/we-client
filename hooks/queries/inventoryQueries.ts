import { getWarehouseInventoryById } from '@/services/inventoryService';
import { useQuery } from '@tanstack/react-query';

export const useInventoryById = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['inventory', id],
    queryFn: () => getWarehouseInventoryById(id),
    staleTime: 300000,
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
