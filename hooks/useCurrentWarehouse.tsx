import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getWarehouseById } from '../services/warehouseService';

export function useCurrentWarehouse() {
  const { warehouseId } = useParams();

  const { data: warehouse } = useQuery({
    queryKey: ['warehouse', warehouseId],
    queryFn: () => getWarehouseById(warehouseId as string),
    enabled: !!warehouseId,
  });

  return warehouse;
}
