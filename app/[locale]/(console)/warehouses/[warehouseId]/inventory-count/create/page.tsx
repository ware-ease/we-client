'use client';
import CustomInventoryCheckTable from '@/components/custom-table/CustomInventoryCheckTable';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';
import { useAccounts } from '@/hooks/queries/accountQueries';
import { useAddInventoryCount } from '@/hooks/queries/inventoryCountQueries';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import useFormData from '@/hooks/useFormData';
import { InventoryCount } from '@/types/inventoryCount';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';

const InventoryCountSchema = z.object({
  status: z.number(),
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
  accountId: string;
};

const CheckInventoryCreate = () => {
  const { warehouseId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useAddInventoryCount();
  const currentWarehouse = useCurrentWarehouse();

  const { data: inventoryData, isLoading } = useWarehousesInventories(
    true,
    (warehouseId as string) ?? ''
  );
  const { data: accountsData } = useAccounts();
  const { formData, handleChange } = useFormData<InventoryCount>({
    date: new Date().toISOString().split('T')[0],
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
      warehouseId: currentWarehouse?.id ?? '',
      status: 0,
      inventoryCountDetails: data.map((row) => ({
        inventoryId: row.inventoryId,
        countedQuantity: parseFloat(row.countedQuantity.toString() || '0'),
        note: row.note,
        errorTicketId: row.errorTicketId || undefined,
        accountId: row.accountId,
      })),
    };

    const result = InventoryCountSchema.safeParse(finalFormData);
    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    mutate(finalFormData, {
      onSuccess: () => {
        router.push(pathname.replace('/create', ''));
      },
    });
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>
          Tạo biên bản kiểm kê
        </h1>

        <div className='space-y-4'>
          {/* Basic Info */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Mã yêu cầu */}
            <div>
              <label
                htmlFor='code'
                className='block text-sm font-medium text-gray-700'
              >
                Mã yêu cầu
              </label>
              <Input
                id='code'
                name='code'
                value='Hệ thống tự tạo'
                disabled
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Ngày kiểm kê
              </label>
              <Input
                name='date'
                type='date'
                value={formData.date}
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Thời gian bắt đầu
              </label>
              <Input
                name='startTime'
                type='time'
                value={formData.startTime}
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Thời gian kết thúc
              </label>
              <Input
                name='endTime'
                type='time'
                value={formData.endTime}
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Ghi chú
              </label>
              <textarea
                name='note'
                value={formData.note}
                onChange={handleChange}
                placeholder='Điền ghi chú...'
                className='mt-1 w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24'
              />
            </div>
            {currentWarehouse && (
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Kho kiểm kê
                </label>
                <Input
                  value={currentWarehouse.name}
                  readOnly
                  className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100'
                />
              </div>
            )}
          </div>

          {/* Table */}
          <div>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Chọn tồn kho cần kiểm kê
            </h2>
            {isLoading ? (
              <div>Đang tải danh sách tồn kho...</div>
            ) : (
              <CustomInventoryCheckTable
                inventories={inventoryData?.inventories || []}
                onDataChange={setData}
                accounts={accountsData || []}
              />
            )}
          </div>

          {/* Submit */}
          <div className='flex justify-end space-x-4'>
            <Button
              onClick={handleSubmit}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Tạo biên bản kiểm kê
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInventoryCreate;
