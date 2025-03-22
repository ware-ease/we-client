import {
  getAllGoodIssueNotes,
  getAllGoodReceiveNotes,
} from '@/lib/services/goodNoteService';
import { useQuery } from '@tanstack/react-query';

export const useGoodReceiveNotes = () =>
  useQuery({
    queryKey: ['receiveNotes'],
    queryFn: getAllGoodReceiveNotes,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useGoodIssueNotes = () =>
  useQuery({
    queryKey: ['issueNotes'],
    queryFn: getAllGoodIssueNotes,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
