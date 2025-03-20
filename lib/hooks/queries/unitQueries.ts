import { createUnit, getAllUnits } from '@/lib/services/unitService';
import { Unit } from '@/lib/types/unit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useUnits = () =>
  useQuery({
    queryKey: ['units'],
    queryFn: getAllUnits,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unit: Unit) => createUnit(unit),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['units'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
