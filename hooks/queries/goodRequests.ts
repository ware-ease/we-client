import {
  getAllGoodReceiveRequests,
  getAllGoodRequests,
} from '@/services/goodRequestService';
import { useQuery } from '@tanstack/react-query';

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
