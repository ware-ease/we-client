import {
  createBatch,
  deleteBatch,
  getAllBatches,
  updateBatch,
} from '@/services/batchService';
import { Batch } from '@/types/batch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useBatches = () =>
  useQuery({
    queryKey: ['batches'],
    queryFn: () => getAllBatches(),
  });

export const useBatchesByProductId = (productId?: string) =>
  useQuery({
    queryKey: ['batches', productId],
    queryFn: () => getAllBatches(productId),
  });

export const useAddBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batch: Batch) => createBatch(batch),
    onSuccess: () => {
      toast.success('Thêm lô hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: ['batches'],
      });
    },
    onError: () => {
      toast.error('Không thể thêm lô hàng.');
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, batch }: { id: string; batch: Batch }) =>
      updateBatch(id, batch),
    onSuccess: () => {
      toast.success('Cập nhật lô hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: ['batches'],
      });
    },
    onError: () => {
      toast.error('Không thể cập nhật lô hàng.');
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBatch(id),
    onSuccess: () => {
      toast.success('Xóa lô hàng thành công!');
      queryClient.invalidateQueries({
        queryKey: ['batches'],
      });
    },
    onError: () => {
      toast.error('Không thể xóa lô hàng.');
    },
  });
};
