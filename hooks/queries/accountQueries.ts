// @/hooks/queries/accountQueries.ts
import {
  createAccount,
  getAllAccounts,
  getAllGroups,
  getAllPermissions,
  updateAccount,
} from '@/services/accountService';
import { getCurrentUser } from '@/services/authService';
import { getAllWarehouses } from '@/services/warehouseService';
import { AccountUpdate, CreateAccount } from '@/types/account';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useAccounts = () =>
  useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
  });

export const useProfile = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (a: CreateAccount) => createAccount(a),
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
    mutationFn: (a: AccountUpdate) => updateAccount(a),
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

export const usePermissions = () =>
  useQuery({
    queryKey: ['permissions'],
    queryFn: getAllPermissions,
    staleTime: 300000,
  });

export const useGroups = () =>
  useQuery({
    queryKey: ['groupsgroups'],
    queryFn: getAllGroups,
    staleTime: 300000,
  });

export const useWarehouses = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
    staleTime: 300000,
  });
