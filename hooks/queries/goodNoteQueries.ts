import {
  createGoodNote,
  getAllCurrentWarehouseGoodIssueNotes,
  getAllCurrentWarehouseGoodReceiveNotes,
  getAllGoodIssueNotes,
  getAllGoodReceiveNotes,
  getGoodNoteById,
  updateGoodNote,
} from '@/services/goodNoteService';
import { GoodNote } from '@/types/goodNote';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useGoodReceiveNotes = (enabled: boolean) =>
  useQuery({
    queryKey: ['receiveNotes'],
    queryFn: getAllGoodReceiveNotes,
    staleTime: 300000,
    enabled: enabled,
  });

export const useGoodReceiveNote = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['receiveNote', id],
    queryFn: () => getGoodNoteById(id),
    staleTime: 300000,
    enabled: enabled,
  });

export const useCurrentWarehouseGoodReceiveNotes = (
  enabled: boolean,
  currentWarehouseId: string
) =>
  useQuery({
    queryKey: ['receiveNotes'],
    queryFn: () => getAllCurrentWarehouseGoodReceiveNotes(currentWarehouseId),
    staleTime: 300000,
    enabled: enabled,
  });

export const useAddGoodReceiveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grn: GoodNote) => createGoodNote(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['receiveNotes'] });
    },
    onError: () => {
      toast.error('Không thể thêm.');
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
    staleTime: 300000,
    enabled: enabled,
  });

export const useGoodIssueNote = (enabled: boolean, id: string) =>
  useQuery({
    queryKey: ['issueNotes', id],
    queryFn: () => getGoodNoteById(id),
    staleTime: 300000,
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
    mutationFn: (grn: GoodNote) => createGoodNote(grn),
    onSuccess: () => {
      toast.success('Thêm thành công!');
      queryClient.invalidateQueries({ queryKey: ['issueNotes'] });
    },
    onError: () => {
      toast.error('Không thể thêm.');
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
