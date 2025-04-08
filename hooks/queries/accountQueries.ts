import {
  createAccount,
  getAllAccounts,
  updateAccount,
} from '@/services/accountService';
import { getCurrentUser } from '@/services/authService';
import { Account } from '@/types/account';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useAccounts = () =>
  useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
    staleTime: 300000,
  });

export const useProfile = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 300000,
  });

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (a: Account) => createAccount(a),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (a: Account) => updateAccount(a),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
