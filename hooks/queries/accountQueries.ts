// @/hooks/queries/accountQueries.ts
import {
  createAccount,
  getAllAccounts,
  getAllGroups,
  getAllPermissions,
  updateAccount,
  updateAccountStatus,
} from '@/services/accountService';
import { getCurrentUser } from '@/services/authService';
import { getAllWarehouses } from '@/services/warehouseService';
import {
  AccountStatusUpdate,
  AccountUpdate,
  CreateAccount,
} from '@/types/account';
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
      toast.success('Tạo tài khoản thành công!');
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
    },
    onError: () => {
      toast.error('Tạo tài khoản thất bại!');
    },
  });
};
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (a: AccountUpdate) => updateAccount(a),
    onSuccess: () => {
      toast.success('Cập nhật tài khoản thành công!');
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
    },
    onError: () => {
      toast.error('Cập nhật tài khoản thất bại!');
    },
  });
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (a: AccountStatusUpdate) => updateAccountStatus(a.id, a.status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
    },
    onError: () => {
      toast.error('Cập nhật trạng thái thất bại!');
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });
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

// export const useAccountTasks = () =>
//   useQuery<Task[]>({
//     queryKey: ['account-tasks'],
//     queryFn: getAccountTasks,
//     staleTime: 300000,
//   });
