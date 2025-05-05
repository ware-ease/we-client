'use client';

import CustomInventoryCheckTable from '@/components/custom-table/CustomInventoryCheckTable';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';
import { useAddInventoryCount } from '@/hooks/queries/inventoryCountQueries';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import useFormData from '@/hooks/useFormData';
import { InventoryCount } from '@/types/inventoryCount';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';

// 🧪 Validate bằng Zod
const InventoryCountSchema = z.object({
  status: z.number(),
  code: z.string().min(1, 'Mã phiếu là bắt buộc'),
  note: z.string().optional(),
  date: z.string().min(1, 'Ngày kiểm kê là bắt buộc'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  inventoryCountDetails: z
    .array(
      z.object({
        inventoryId: z.string().min(1, 'InventoryId là bắt buộc'),
        countedQuantity: z.number().nonnegative('Số lượng không âm'),
        note: z.string().optional(),
        errorTicketId: z.string().optional(),
      })
    )
    .min(1, 'Phải có ít nhất 1 dòng kiểm kê'),
});

type RowData = {
  inventoryId: string;
  countedQuantity: number;
  note?: string;
  errorTicketId?: string;
};

const CheckInventoryCreate = () => {
  const { warehouseId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useAddInventoryCount();
  const currentWarehouse = useCurrentWarehouse();

  const { data: inventoryData, isLoading } = useWarehousesInventories(
    true, // Assuming first param enables the query
    (warehouseId as string) ? (warehouseId as string) : '' // Pass warehouseId based on onlyCurrentWarehouse
  );

  // const { data: inventoryData, isLoading } = useWarehousesInventories(
  //   currentWarehouse?.id ?? ''
  // );

  const { formData, handleChange } = useFormData<InventoryCount>({
    code: '',
    date: '',
    startTime: '',
    endTime: '',
    note: '',
    status: 0,
    inventoryCountDetails: [],
  });

  const [data, setData] = useState<RowData[]>([]);

  const handleSubmit = () => {
    const finalFormData: InventoryCount = {
      ...formData,
      status: 0,
      inventoryCountDetails: data.map((row) => ({
        inventoryId: row.inventoryId,
        countedQuantity: parseFloat(row.countedQuantity.toString() || '0'),
        note: row.note,
        errorTicketId: row.errorTicketId || undefined,
      })),
    };

    const result = InventoryCountSchema.safeParse(finalFormData);
    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    mutate(finalFormData, {
      onSuccess: () => {
        toast.success('Tạo biên bản thành công');
        router.push(pathname.replace('/create', ''));
      },
      onError: () => {
        toast.error('Tạo biên bản thất bại');
      },
    });
  };

  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-8 bg-gray-50 rounded-lg shadow-lg'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-semibold text-primary'>
          Tạo Biên bản Kiểm kê
        </h1>
        <p className='text-lg text-gray-600'>
          Nhập thông tin kiểm kê chi tiết dưới đây
        </p>
      </div>

      {/* Mã phiếu và Ngày kiểm kê */}
      <div className='space-y-8'>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h2 className='text-xl font-semibold text-primary mb-4'>
            Thông tin cơ bản
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600'>Mã phiếu</div>
              <Input
                name='code'
                value={formData.code}
                onChange={handleChange}
                required
                className='border-gray-300 focus:ring-2 focus:ring-primary'
              />
            </div>
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600'>Ngày kiểm kê</div>
              <Input
                name='date'
                value={formData.date}
                type='date'
                onChange={handleChange}
                required
                className='border-gray-300 focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>
        </div>

        {/* Thời gian kiểm kê */}
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h2 className='text-xl font-semibold text-primary mb-4'>
            Thời gian kiểm kê
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600'>Thời gian bắt đầu</div>
              <Input
                name='startTime'
                value={formData.startTime}
                type='time'
                onChange={handleChange}
                className='border-gray-300 focus:ring-2 focus:ring-primary'
              />
            </div>
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600'>Thời gian kết thúc</div>
              <Input
                name='endTime'
                value={formData.endTime}
                type='time'
                onChange={handleChange}
                className='border-gray-300 focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>
        </div>

        {/* Kho kiểm kê và Ghi chú */}
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h2 className='text-xl font-semibold text-primary mb-4'>
            Thông tin khác
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600'>Kho kiểm kê</div>
              <Input
                value={currentWarehouse?.name ?? ''}
                disabled
                className='border-gray-300'
              />
            </div>
            <div className='flex flex-col'>
              <div className='text-sm text-gray-600'>Ghi chú</div>
              <Input
                name='note'
                value={formData.note}
                onChange={handleChange}
                className='border-gray-300 focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table phần kiểm kê */}
      <div className='mt-8'>
        {isLoading ? (
          <div>Đang tải danh sách tồn kho...</div>
        ) : (
          <CustomInventoryCheckTable
            initialData={[]}
            inventories={inventoryData?.inventories || []}
            onDataChange={setData}
          />
        )}
      </div>
      {/* Nút submit */}
      <div className='flex w-full justify-end mt-8'>
        <Button
          onClick={handleSubmit}
          className='bg-primary text-white hover:bg-primary-dark'
        >
          Tạo biên bản kiểm kê
        </Button>
      </div>
    </div>
  );
};

export default CheckInventoryCreate;
