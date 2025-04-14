import {
  confirmGoodRequest,
  createGoodRequest,
  declineGoodRequest,
  getAllGoodIssueRequests,
  getAllGoodReceiveRequests,
  getAllGoodRequests,
  getAllGoodTransferRequests,
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
  });

export const useGoodRequest = (enable: boolean, id: string) =>
  useQuery({
    queryKey: ['request', id],
    queryFn: () => getGoodRequestById(id),
  });

export const useGoodReceiveRequests = () =>
  useQuery({
    queryKey: ['receiveRequests'],
    queryFn: getAllGoodReceiveRequests,
  });

export const useGoodIssueRequests = () =>
  useQuery({
    queryKey: ['issueRequests'],
    queryFn: getAllGoodIssueRequests,
  });

export const useGoodTransferRequests = () =>
  useQuery({
    queryKey: ['transferRequests'],
    queryFn: getAllGoodTransferRequests,
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
      toast.success('Đồng ý thành công!');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['issueRequests'] });
      queryClient.invalidateQueries({ queryKey: ['receiveRequests'] });
    },
    onError: () => {
      toast.error('Không thể xác nhận.');
    },
  });
};

export const useDeclineGoodRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => declineGoodRequest(id),
    onSuccess: () => {
      toast.success('Từ chối thành công!');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['issueRequests'] });
      queryClient.invalidateQueries({ queryKey: ['receiveRequests'] });
    },
    onError: () => {
      toast.error('Không thể xác nhận.');
    },
  });
};
