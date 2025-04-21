import {
  createGoodInternalIssueNote,
  createGoodInternalReceiveNote,
  createGoodIssueNote,
  createGoodReceiveNote,
  getAllCurrentWarehouseGoodIssueNotes,
  getAllCurrentWarehouseGoodReceiveNotes,
  getAllGoodIssueNotes,
  getAllGoodReceiveNotes,
  getGoodNoteById,
  updateGoodNote,
} from '@/services/goodNoteService';
import { GoodNote, GoodReceiveNote } from '@/types/goodNote';
import { ResponseErrorType } from '@/types/response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const useGoodReceiveNotes = (enabled: boolean) =>
  useQuery({
    queryKey: ['receiveNotes'],
    queryFn: getAllGoodReceiveNotes,
    enabled: enabled,
  });

export const useGoodReceiveNote = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['receiveNote', id],
    queryFn: () => getGoodNoteById(id),
    enabled: enabled,
  });

export const useCurrentWarehouseGoodReceiveNotes = (
  enabled: boolean,
  currentWarehouseId: string
) =>
  useQuery({
    queryKey: ['receiveNotes'],
    queryFn: () => getAllCurrentWarehouseGoodReceiveNotes(currentWarehouseId),
    enabled: enabled,
  });

export const useAddGoodReceiveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodReceiveNote) => createGoodReceiveNote(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['receiveNotes'] });
    },
    onError: (res: AxiosError<ResponseErrorType>) => {
      console.log(res);
      toast.error(res.response?.data?.message || 'Không thể thêm');
    },
  });
};

export const useUpdateGoodReceiveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodNote) => updateGoodNote(grn),
    onSuccess: () => {
      toast.success('Sửa thành công!');
      queryClient.invalidateQueries({ queryKey: ['receiveNotes'] });
    },
    onError: () => {
      toast.error('Không thể sửa.');
    },
  });
};

export const useGoodIssueNotes = (enabled: boolean) =>
  useQuery({
    queryKey: ['issueNotes'],
    queryFn: getAllGoodIssueNotes,
    enabled: enabled,
  });

export const useGoodIssueNote = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['issueNotes', id],
    queryFn: () => getGoodNoteById(id),
    enabled: enabled,
  });

export const useCurrentWarehouseGoodIssueNotes = (
  enabled: boolean,
  currentWarehouseId: string
) =>
  useQuery({
    queryKey: ['issueNotes'],
    queryFn: () => getAllCurrentWarehouseGoodIssueNotes(currentWarehouseId),
    staleTime: 300000,
    enabled: enabled,
  });

export const useAddGoodIssueNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodNote) => createGoodIssueNote(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['issueNotes'] });
    },
    onError: (res: AxiosError<ResponseErrorType>) => {
      console.log(res);
      toast.error(res.response?.data?.message || 'Không thể thêm');
    },
  });
};

export const useUpdateGoodIssueNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodNote) => updateGoodNote(grn),
    onSuccess: () => {
      toast.success('Sửa thành công!');
      queryClient.invalidateQueries({ queryKey: ['issueNotes'] });
    },
    onError: () => {
      toast.error('Không thể sửa.');
    },
  });
};

export const useAddGoodInternalReceiptNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodReceiveNote) => createGoodInternalReceiveNote(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['receiveNotes'] });
    },
    onError: (res: AxiosError<ResponseErrorType>) => {
      console.log(res);
      toast.error(res.response?.data?.message || 'Không thể thêm');
    },
  });
};

export const useAddGoodInternalIssueNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodNote) => createGoodInternalIssueNote(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['issueNotes'] });
    },
    onError: (res: AxiosError<ResponseErrorType>) => {
      console.log(res);
      toast.error(res.response?.data?.message || 'Không thể thêm');
    },
  });
};
