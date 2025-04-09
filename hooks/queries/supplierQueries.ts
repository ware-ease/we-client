import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  updateSupplier,
} from '@/services/supplierService';
import { Supplier } from '@/types/supplier';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useSuppliers = () =>
  useQuery({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
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
      queryClient.invalidateQueries({
        queryKey: ['partners', 0],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...supplierData }: Supplier) =>
      updateSupplier(id ?? '', supplierData),
    onSuccess: () => {
      toast.success('Cập nhật thành công!');
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['partners', 0],
      });
    },
    onError: () => {
      toast.error('Cập nhật thất bại!');
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
      queryClient.invalidateQueries({
        queryKey: ['partners', 0],
      });
    },
    onError: () => {
      toast.error('Thất bại!');
    },
  });
};
