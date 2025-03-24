import { getAllProductTypes } from '@/services/productService';
import { useQuery } from '@tanstack/react-query';

export const useProductTypes = () =>
  useQuery({
    queryKey: ['productTypes'],
    queryFn: getAllProductTypes,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
