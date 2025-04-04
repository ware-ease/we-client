import {
  confirmGoodRequest,
  createGoodRequest,
  getAllGoodIssueRequests,
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

export const useGoodIssueRequests = () =>
  useQuery({
    queryKey: ['issueRequests'],
    queryFn: getAllGoodIssueRequests,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddGoodRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodRequest) => createGoodRequest(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['issueRequests'] });
      queryClient.invalidateQueries({ queryKey: ['receiveRequests'] });
    },
    onError: () => {
      toast.error('Không thể thêm.');
    },
  });
};

export const useConfirmGoodRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmGoodRequest(id),
    onSuccess: () => {
      toast.success('Xác nhận thành công!');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['issueRequests'] });
      queryClient.invalidateQueries({ queryKey: ['receiveRequests'] });
    },
    onError: () => {
      toast.error('Không thể xác nhận.');
    },
  });
};
