'use client';
import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import { useUpdateBatch } from '@/hooks/queries/batchQueries';
import { Batch } from '@/types/batch';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type UpdateBatchDialogProps = {
  batch: Batch;
};

const UpdateBatchDialog: React.FC<UpdateBatchDialogProps> = ({ batch }) => {
  const t = useTranslations();
  const { mutate: updateBatch } = useUpdateBatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState({
    productName: batch.productName || '',
    code: batch.code || '',
    inboundDate: batch.inboundDate || '',
    mfgDate: batch.mfgDate || '',
    expDate: batch.expDate || '',
  });

  useEffect(() => {
    setFormData({
      productName: batch.productName || '',
      code: batch.code || '',
      inboundDate: batch.inboundDate || '',
      mfgDate: batch.mfgDate || '',
      expDate: batch.expDate || '',
    });
  }, [batch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = () => {
    if (!formData.productName || !formData.code || !formData.inboundDate) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const updatedBatch: Batch = {
      ...batch,
      productName: formData.productName,
      code: formData.code,
      inboundDate: formData.inboundDate,
      mfgDate: formData.mfgDate,
      expDate: formData.expDate,
    };

    updateBatch(
      { id: batch.id, batch: updatedBatch },
      {
        onSuccess: () => {
          toast.success('Cập nhật lô hàng thành công!');
          if (dialogRef.current) {
            dialogRef.current.close();
          }
        },
        onError: () => {
          toast.error('Không thể cập nhật lô hàng.');
        },
      }
    );
  };

  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Edit className='text-yellow-600 h-5 w-5 hover:cursor-pointer' />
        </DialogTrigger>

        <DialogContent
          className='flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold text-gray-800'>
              Chỉnh sửa lô hàng
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            {/* --- THÔNG TIN LÔ HÀNG --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin lô hàng
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label
                    htmlFor='productName'
                    className='text-sm text-gray-500'
                  >
                    Tên sản phẩm
                  </Label>
                  <Input
                    id='productName'
                    name='productName'
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                <div>
                  <Label htmlFor='code' className='text-sm text-gray-500'>
                    Mã lô hàng
                  </Label>
                  <Input
                    id='code'
                    name='code'
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                <div>
                  <Label
                    htmlFor='inboundDate'
                    className='text-sm text-gray-500'
                  >
                    Ngày nhập
                  </Label>
                  <Input
                    id='inboundDate'
                    name='inboundDate'
                    type='date'
                    value={formData.inboundDate}
                    onChange={handleInputChange}
                    required
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                <div>
                  <Label htmlFor='mfgDate' className='text-sm text-gray-500'>
                    Ngày sản xuất
                  </Label>
                  <Input
                    id='mfgDate'
                    name='mfgDate'
                    type='date'
                    value={formData.mfgDate}
                    onChange={handleInputChange}
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                <div>
                  <Label htmlFor='expDate' className='text-sm text-gray-500'>
                    Hạn sử dụng
                  </Label>
                  <Input
                    id='expDate'
                    name='expDate'
                    type='date'
                    value={formData.expDate}
                    onChange={handleInputChange}
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='mt-6 flex justify-end space-x-4'>
            <DialogClose asChild>
              <Button
                variant='secondary'
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                {t('Dialog.cancel')}
              </Button>
            </DialogClose>
            <Button
              className='px-4 py-2 transition-colors'
              onClick={handleUpdateClick}
            >
              {t('Dialog.yes.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateBatchDialog;
