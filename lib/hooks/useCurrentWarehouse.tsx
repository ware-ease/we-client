import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { getWarehouseById } from '../services/warehouseService';

export function useCurrentWarehouse() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/');
  const warehouseId = pathSegments[3] ?? '';

  const isWarehousePath = pathname.includes('/warehouses/');

  const { data: warehouse } = useQuery({
    queryKey: ['warehouse', warehouseId],
    queryFn: () => getWarehouseById(warehouseId),
    enabled: isWarehousePath && !!warehouseId,
  });

  return warehouse;
}
