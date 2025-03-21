import { createAccount, getAllAccounts } from '@/lib/services/accountService';
import { Account } from '@/lib/types/account';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useAccounts = () =>
  useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
    staleTime: 300000,
    refetchOnWindowFocus: false,
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
