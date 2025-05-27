'use client';
import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn-base/Dialog';
import { useUpdateInventoryCount } from '@/hooks/queries/inventoryCountQueries';
import { cn } from '@/lib/utils/utils';
import { getAllAccounts } from '@/services/accountService';
import { Account } from '@/types/account';
import { InventoryCount } from '@/types/inventoryCount';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import InventoryCountAdjustmentDialog from '../../dialogs/InventoryCountAdjutmentDialog';

interface StatusStepperProps {
  status: number;
  inventoryCounts: InventoryCount;
  //   {
  //     scheduleId?: string;
  //     locationId?: string;
  //     warehouseId?: string;
  //     status?: number;
  //     code?: string;
  //     note?: string;
  //     date?: string;
  //     startTime?: string;
  //     endTime?: string;
  //     location?: Location;
  //     inventoryCountDetailDTO?: InventoryCountDetailDTO[];
  //     id?: string;
  //     createdBy?: string;
  //     createdTime?: string;
  //     createdByAvatarUrl?: string;
  //     createdByFullName?: string;
  //     createdByGroup?: string;
  //   };
}
// export interface InventoryCountDetailDTO {
//   id?: string;
//   accountId?: string;
//   inventoryId?: string;
//   batchId?: string;
//   batchCode?: string;
//   productName?: string;
//   expectedQuantity?: number;
//   countedQuantity?: number;
//   note?: string;
//   status?: number;
//   createdBy?: string;
//   createdTime?: string;
//   createdByAvatarUrl?: string | null;
//   createdByFullName?: string | null;
//   createdByGroup?: string | null;
// }

const statusLabels = ['Chưa kiểm kê', 'Đã kiểm kê ', 'Đã cân bằng'];

const StatusStepper = ({ status, inventoryCounts }: StatusStepperProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [countedQuantities, setCountedQuantities] = useState<
    Record<string, number>
  >({});
  // const router = useRouter();
  const { data: accountsData } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
  });

  const accounts = accountsData ?? [];

  const getAccountInfo = (accountId: string) => {
    return accounts.find((account) => account.id === accountId);
  };

  // Use the mutation hook to update inventory count
  const { mutate: updateInventoryCountMutate } = useUpdateInventoryCount();

  const handleCountedQuantityChange = (
    productId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCountedQuantities((prev) => ({
      ...prev,
      [productId]: Number(event.target.value), // Update countedQuantity for specific product
    }));
  };

  const confirmUpdateQuantity = async () => {
    setLoading(true);
    try {
      if (!inventoryCounts?.id) {
        throw new Error('Thiếu ID của inventory count');
      }

      // Chuyển định dạng startTime và endTime về HH:mm
      const formatToHHmm = (timeString?: string) => {
        if (!timeString) return '00:00';
        return timeString.split(':').slice(0, 2).join(':'); // Lấy HH:mm
      };

      const { inventoryCountDetails } = inventoryCounts;

      const updatedData = {
        note: inventoryCounts.note,
        date: inventoryCounts.date,
        startTime: formatToHHmm(inventoryCounts.startTime),
        endTime: formatToHHmm(inventoryCounts.endTime),
        inventoryCountDetails:
          inventoryCountDetails?.map((detail) => ({
            id: detail.id,
            countedQuantity: countedQuantities[detail.id || ''] ?? 0,
            note: detail.note,
            // accountId: detail.accountId,
            inventoryId: detail.inventoryId,
            errorTicketId: detail.errorTicketId,
          })) || [],
      };

      await updateInventoryCountMutate(
        {
          id: inventoryCounts.id,
          inventoryCount: updatedData,
        },
        {
          onSuccess: () => {
            const nextStatus = currentStatus + 1;
            if (nextStatus < statusLabels.length) {
              setCurrentStatus(nextStatus);
              //   if (nextStatus === 1) {
              //     router.push(
              //       `/inventory-counts/adjustment?id=${inventoryCounts.id}`
              //     );
              //   }
            }
            setOpen(false);
          },
          onError: (error) => {
            console.error('Lỗi khi cập nhật inventory count:', error);
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật inventory count:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className='flex items-center space-x-2'>
      {statusLabels.map((label, index) => {
        const isActive = index === currentStatus;
        const isCompleted = index < currentStatus;

        const getButtonStyle = (index: number) => {
          if (index === 0) {
            return cn(
              'rounded-3xl text-red-500 border-2 border-red-500',
              isActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white hover:bg-slate-50'
            );
          }
          if (index === 1) {
            return cn(
              'rounded-3xl text-yellow-500 border-2 border-yellow-500',
              isActive
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-white hover:bg-slate-50'
            );
          }
          if (index === 2) {
            return cn(
              'rounded-3xl text-green-400 border-2 border-green-400',
              isActive
                ? 'bg-green-400 text-white hover:bg-green-500'
                : 'bg-white hover:bg-slate-50'
            );
          }
          return 'rounded-3xl border';
        };

        const handleButtonClick = (index: number) => {
          if (index === 0) {
            if (currentStatus === 0) {
              setOpen(true);
            }
          } else if (index === 1) {
            setOpenDialog(true);
          } else if (index === 2) {
            console.log('Status 2 clicked');
          }
        };

        return (
          <div key={index}>
            <Button
              size='sm'
              disabled={!isActive}
              onClick={() => isActive && handleButtonClick(index)}
              className={cn(
                getButtonStyle(index),
                'transition-all duration-300 flex items-center gap-1'
              )}
            >
              {isCompleted && (
                <CheckCircle size={16} className='text-green-500' />
              )}
              {label}
            </Button>

            {/*  */}

            {openDialog && index === 1 && (
              <InventoryCountAdjustmentDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={confirmUpdateQuantity}
                inventoryCounts={inventoryCounts}
                onSuccessNextStep={() => {
                  const nextStatus = currentStatus + 1;
                  if (nextStatus < statusLabels.length) {
                    setCurrentStatus(nextStatus);
                  }
                }}
              />
            )}
          </div>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='p-6 bg-white rounded-lg shadow-xl max-w-3xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-gray-900'>
              Cập nhật số lượng đếm
            </DialogTitle>
          </DialogHeader>

          {/* Form Fields Section */}
          <div className='space-y-4'>
            {/* Code Field */}
            <div>
              <label
                htmlFor='code'
                className='text-sm font-medium text-gray-700'
              >
                Mã số
              </label>
              <input
                id='code'
                type='text'
                value={inventoryCounts?.code || ''}
                disabled
                className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Note Field */}
            <div>
              <label
                htmlFor='note'
                className='text-sm font-medium text-gray-700'
              >
                Ghi chú
              </label>
              <textarea
                id='note'
                value={inventoryCounts?.note || ''}
                disabled
                className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Date and Time Fields in a row */}
            <div className='grid grid-cols-2 gap-4'>
              {/* Date Field */}
              <div>
                <label
                  htmlFor='date'
                  className='text-sm font-medium text-gray-700'
                >
                  Ngày
                </label>
                <input
                  id='date'
                  type='date'
                  value={inventoryCounts?.date || ''}
                  disabled
                  className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Start Time Field */}
              <div>
                <label
                  htmlFor='startTime'
                  className='text-sm font-medium text-gray-700'
                >
                  Giờ bắt đầu
                </label>
                <input
                  id='startTime'
                  type='time'
                  value={inventoryCounts?.startTime || ''}
                  disabled
                  className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* End Time Field */}
              <div>
                <label
                  htmlFor='endTime'
                  className='text-sm font-medium text-gray-700'
                >
                  Giờ kết thúc
                </label>
                <input
                  id='endTime'
                  type='time'
                  value={inventoryCounts?.endTime || ''}
                  disabled
                  className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Counted Quantity Field (Editable) */}
              {/* <div>
          <label htmlFor='countedQuantity' className='text-sm font-medium text-gray-700'>
            Số lượng đếm
          </label>
          <input
            id='countedQuantity'
            type='number'
            value={countedQuantity}
            onChange={handleCountedQuantityChange}
            className='mt-2 w-full p-2.5 border border-blue-500 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500'
          />
        </div> */}
            </div>
          </div>

          {/* Inventory Count Details */}
          <div className='mt-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Chi tiết kiểm kho
            </h3>
            <div className='overflow-x-auto bg-gray-50 p-4 rounded-lg'>
              <table className='min-w-full table-auto'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                      Sản phẩm
                    </th>
                    <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                      Mã lô
                    </th>
                    <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                      Nhân viên
                    </th>
                    <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                      Số lượng dự kiến
                    </th>
                    <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                      Số lượng đếm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryCounts.inventoryCountDetails?.map((detail) => {
                    const account = getAccountInfo(detail.accountId || '');

                    return (
                      <tr key={detail.id} className='border-b'>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {detail.productName || 'Không có thông tin'}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {detail.batchCode || 'Không có thông tin'}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {account
                            ? `${account.profile.lastName} ${account.profile.firstName}`
                            : 'Không có thông tin'}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-700'>
                          {detail.expectedQuantity}
                        </td>
                        <td className='px-4 py-2'>
                          <input
                            type='number'
                            value={countedQuantities[detail.id || ''] || ''}
                            onChange={(e) =>
                              handleCountedQuantityChange(detail.id || '', e)
                            }
                            className='w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-6 flex justify-end space-x-4'>
            <Button
              variant='ghost'
              onClick={() => setOpen(false)}
              className='px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
            >
              Hủy
            </Button>
            <Button
              onClick={confirmUpdateQuantity}
              disabled={loading}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
            >
              {loading ? (
                <Loader2 className='animate-spin' size={16} />
              ) : (
                'Xác nhận'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatusStepper;
