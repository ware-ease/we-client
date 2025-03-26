import {
  createGoodNote,
  getAllCurrentWarehouseGoodReceiveNotes,
  getAllGoodIssueNotes,
  getAllGoodReceiveNotes,
} from '@/services/goodNoteService';
import { GoodNote } from '@/types/goodNote';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useGoodReceiveNotes = (enabled: boolean) =>
  useQuery({
    queryKey: ['receiveNotes'],
    queryFn: getAllGoodReceiveNotes,
    staleTime: 300000,
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
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

export const useGoodIssueNotes = () =>
  useQuery({
    queryKey: ['issueNotes'],
    queryFn: getAllGoodIssueNotes,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
