import { getAllPartners } from '@/services/partnerService';
import { useQuery } from '@tanstack/react-query';

export const usePartners = (partnerType: number) =>
  useQuery({
    queryKey: ['partners', partnerType],
    queryFn: () => getAllPartners(partnerType),
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
