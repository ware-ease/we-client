'use client';
import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn-base/Dialog';
import { useUpdateInventoryCount } from '@/hooks/queries/inventoryCountQueries';
import { InventoryCount } from '@/types/inventoryCount';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StatusStepperProps {
  status: number;
  inventoryCounts: InventoryCount;
}

const statusLabels = ['Chờ xử lý', 'Hoàn thành', 'Đã kiểm duyệt'];

const StatusStepper = ({ status, inventoryCounts }: StatusStepperProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status); // Track the current status
  const [inventoryCount, setInventoryCount] = useState<InventoryCount>(); // Inventory count data
  const [countedQuantity, setCountedQuantity] = useState<number>(0); // Track the countedQuantity
  const router = useRouter();

  // Use the mutation hook to update inventory count
  const { mutate: updateInventoryCount } = useUpdateInventoryCount();

  // Fetch inventory count details using inventoryCountId
  const fetchInventoryCount = async () => {
    try {
      // Simulate API call to fetch inventory count details (replace with actual API call)
      const response = await fetch(`/api/inventory-counts/${inventoryCounts}`);
      const data = await response.json();
      if (data.status === 0 && data.data) {
        setInventoryCount(data.data); // Set inventory count data
        setCountedQuantity(
          data.data.inventoryCountDetails[0]?.countedQuantity || 0
        ); // Set initial counted quantity
      } else {
        console.error('Failed to fetch inventory count');
      }
    } catch (error) {
      console.error('Error fetching inventory count:', error);
    }
  };

  useEffect(() => {
    fetchInventoryCount();
  }, [inventoryCounts]);

  const handleNextStep = async () => {
    if (currentStatus === 0) {
      setOpen(true); // Open dialog for "Chờ xử lý" step
    } else if (currentStatus === 1) {
      router.push(`/inventory-counts/adjustment?id=${inventoryCounts}`);
    }
  };

  const handleCountedQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCountedQuantity(Number(event.target.value)); // Update countedQuantity when user types
  };

  const confirmUpdateQuantity = async () => {
    setLoading(true);
    try {
      // Prepare the updated inventory count object
      const updatedInventoryCount = {
        ...inventoryCount,
        inventoryCountDetails: [
          {
            ...inventoryCount?.inventoryCountDetails?.[0], // Use optional chaining
            countedQuantity, // Update countedQuantity
          },
        ],
      };

      // Convert inventoryCountId to string if it's not already
      const inventoryCountIdStr = String(inventoryCounts);

      // Call the API to update inventory count
      await updateInventoryCount({
        id: inventoryCountIdStr, // Pass id as string
        inventoryCount: updatedInventoryCount,
      });

      // Simulate API call delay (for demonstration purposes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Move to the next step
      const nextStatus = currentStatus + 1;
      if (nextStatus < statusLabels.length) {
        setCurrentStatus(nextStatus); // Update current status to next step
        handleNextStep(); // Proceed to the next step
      }
    } finally {
      setLoading(false);
      setOpen(false); // Close the dialog
    }
  };

  return (
    <div className='flex items-center space-x-2'>
      {statusLabels.map((label, index) => (
        <Button
          key={index}
          size='sm'
          variant={index === currentStatus ? 'default' : 'outline'}
          disabled={index < currentStatus}
          onClick={() => index === currentStatus && handleNextStep()}
          className={`transition-all duration-300 ${
            index === currentStatus
              ? 'font-semibold bg-blue-500 text-white'
              : ''
          }`}
        >
          {index < currentStatus ? (
            <CheckCircle size={16} className='mr-1 text-green-500' />
          ) : null}
          {label}
        </Button>
      ))}
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
                value={inventoryCount?.code || ''}
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
                value={inventoryCount?.note || ''}
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
                  value={inventoryCount?.date || ''}
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
                  value={inventoryCount?.startTime || ''}
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
                  value={inventoryCount?.endTime || ''}
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
                      Số lượng dự kiến
                    </th>
                    <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                      Số lượng đếm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryCount?.inventoryCountDetails?.map((detail) => (
                    <tr key={detail.id} className='border-b'>
                      <td className='px-4 py-2 text-sm text-gray-700'>
                        {detail.product?.name || 'Không có thông tin'}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-700'>
                        {detail.product?.brand || 'Không có thông tin'}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-700'>
                        {detail.expectedQuantity}
                      </td>
                      <td className='px-4 py-2'>
                        <input
                          type='number'
                          value={countedQuantity}
                          onChange={handleCountedQuantityChange}
                          className='w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                        />
                      </td>
                    </tr>
                  ))}
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
