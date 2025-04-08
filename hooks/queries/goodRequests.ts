import {
  confirmGoodRequest,
  createGoodRequest,
  getAllGoodIssueRequests,
  getAllGoodReceiveRequests,
  getAllGoodRequests,
  getGoodRequestById,
  updateGoodRequest,
} from '@/services/goodRequestService';
import { GoodRequest } from '@/types/goodRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useGoodRequests = () =>
  useQuery({
    queryKey: ['requests'],
    queryFn: getAllGoodRequests,
    staleTime: 300000,
  });

export const useGoodRequest = (enable: boolean, id: string) =>
  useQuery({
    queryKey: ['request', id],
    queryFn: () => getGoodRequestById(id),
    staleTime: 300000,
  });

export const useGoodReceiveRequests = () =>
  useQuery({
    queryKey: ['receiveRequests'],
    queryFn: getAllGoodReceiveRequests,
    staleTime: 300000,
  });

export const useGoodIssueRequests = () =>
  useQuery({
    queryKey: ['issueRequests'],
    queryFn: getAllGoodIssueRequests,
    staleTime: 300000,
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

export const useUpdateGoodRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodRequest) => updateGoodRequest(grn),
    onSuccess: () => {
      toast.success('Sửa thành công!');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['issueRequests'] });
      queryClient.invalidateQueries({ queryKey: ['receiveRequests'] });
    },
    onError: () => {
      toast.error('Không thể sửa.');
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
