import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from '@/services/customerService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Lấy danh sách khách hàng
export const useCustomers = () =>
  useQuery({
    queryKey: ['customers'],
    queryFn: getAllCustomers,
  });

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customer: { name: string; email: string }) =>
      createCustomer(customer),
    onSuccess: () => {
      toast.success('Thêm khách hàng thành công!');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({
        queryKey: ['partners', 1],
      });
    },
    onError: () => {
      toast.error('Không thể thêm khách hàng.');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      email,
    }: {
      id: string;
      name: string;
      email: string;
    }) => updateCustomer(id, { name, email }),
    onSuccess: () => {
      toast.success('Cập nhật khách hàng thành công!');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({
        queryKey: ['partners', 1],
      });
    },
    onError: () => {
      toast.error('Không thể cập nhật khách hàng.');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      toast.success('Xóa khách hàng thành công!');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({
        queryKey: ['partners', 1],
      });
    },
    onError: () => {
      toast.error('Không thể xóa khách hàng.');
    },
  });
};
