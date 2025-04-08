'use client';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import useFormData from '@/hooks/useFormData';
// import { usePathname, useRouter } from '@/lib/i18n/routing';
import { InventoryCount } from '@/types/inventoryCount';
// import { useState } from 'react';

const CheckInventoryCreate = () => {
  //   const router = useRouter();
  //   const pathname = usePathname();
  //   const [data, setData] = useState<RowData[]>([]);
  const { formData, handleChange } = useFormData<InventoryCount>({
    code: '',
    date: '',
    startTime: '',
    endTime: '',
    note: '',
    status: 'draft',
    locationId: '',
    scheduleId: '',
    inventoryCountDetails: [],
  });

  //   const { mutate } = useAddInventoryCount();
  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    // const finalFormData: InventoryCount = {
    //   ...formData,
    //   inventoryCountDetails: data.map((row) => ({
    //     productId: row.productId, // Assuming CustomTable provides productId
    //     expectedQuantity: parseFloat(row.expectedQuantity?.toString() || '0'),
    //     countedQuantity: parseFloat(row.countedQuantity?.toString() || '0'),
    //     note: row.note,
    //     errorTicketId: row.errorTicketId || undefined, // Optional field
    //   })),
    //   locationId: currentWarehouse?.id, // Using current warehouse as location
    // };
    // console.log(finalFormData);
    // const result = InventoryCountSchema.safeParse(finalFormData);
    // if (!result.success) {
    //   result.error.errors.forEach((err) => {
    //     toast.error(err.message);
    //   });
    //   return;
    // }
    // mutate(finalFormData, {
    //   onSuccess: () => {
    //     router.push(pathname.replace('/create', ''));
    //   },
    // });
  };

  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-4'>
      <div className='flex flex-col w-full'>
        <div className='flex space-x-20 items-center w-full'>
          <div className='text-4xl font-semibold text-primary'>
            Biên bản kiểm kê
          </div>
        </div>
        <div className='flex space-x-20 py-5 pl-3'>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Mã phiếu</div>
              <Input
                name='code'
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Ngày kiểm kê</div>
              <Input
                name='date'
                value={formData.date}
                type='date'
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Thời gian bắt đầu</div>
              <Input
                name='startTime'
                value={formData.startTime}
                type='time'
                onChange={handleChange}
              />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Thời gian kết thúc</div>
              <Input
                name='endTime'
                value={formData.endTime}
                type='time'
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Kho kiểm kê</div>
              <Input value={currentWarehouse?.name ?? ''} disabled />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Ghi chú</div>
              <Input
                name='note'
                value={formData.note}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1'>
        {/* <CustomTable onDataChange={setData} /> */}
      </div>
      <div className='flex w-full mt-4'>
        <div className='grow'></div>
        <Button onClick={handleSubmit}>Tạo biên bản kiểm kê</Button>
      </div>
    </div>
  );
};

export default CheckInventoryCreate;
