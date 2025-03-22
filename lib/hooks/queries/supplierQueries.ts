import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
} from '@/lib/services/supplierService';
import { Supplier } from '@/lib/types/supplier';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useSuppliers = () =>
  useQuery({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

export const useAddSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (s: Supplier) => createSupplier(s),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (supplierId: string) => deleteSupplier(supplierId),
    onSuccess: () => {
      toast.success('Thành công!');
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
