import {
  createGoodRequest,
  getAllGoodReceiveRequests,
  getAllGoodRequests,
} from '@/services/goodRequestService';
import { GoodRequest } from '@/types/goodRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useGoodRequests = () =>
  useQuery({
    queryKey: ['requests'],
    queryFn: getAllGoodRequests,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useGoodReceiveRequests = () =>
  useQuery({
    queryKey: ['receiveRequests'],
    queryFn: getAllGoodReceiveRequests,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddGoodRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodRequest) => createGoodRequest(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['receiveNotes'] });
    },
    onError: () => {
      toast.error('Không thể thêm.');
    },
  });
};
