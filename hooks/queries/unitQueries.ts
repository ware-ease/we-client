import {
  createUnit,
  deleteUnit,
  getAllUnits,
  updateUnit,
} from '@/services/unitService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export type Unit = {
  id?: string;
  name: string;
  note: string;
};

export const useUnits = () =>
  useQuery({
    queryKey: ['units'],
    queryFn: getAllUnits,
  });

export const useAddUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unit: Unit) => createUnit(unit),
    onSuccess: () => {
      toast.success('Thêm đơn vị thành công!');
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: () => {
      toast.error('Không thể thêm đơn vị.');
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, note }: Unit) => updateUnit(id!, { name, note }),
    onSuccess: () => {
      toast.success('Cập nhật đơn vị thành công!');
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: () => {
      toast.error('Không thể cập nhật đơn vị.');
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUnit(id),
    onSuccess: () => {
      toast.success('Xóa đơn vị thành công!');
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: () => {
      toast.error('Không thể xóa đơn vị.');
    },
  });
};
