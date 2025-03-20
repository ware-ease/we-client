import { createBatch, getAllBatches } from '@/lib/services/batchService';
import { Batch } from '@/lib/types/batch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useBatches = () =>
  useQuery({
    queryKey: ['batches'],
    queryFn: getAllBatches,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batch: Batch) => createBatch(batch),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['batches'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
