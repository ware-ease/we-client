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
import { useAddCustomer } from '@/hooks/queries/customerQueries';
import { Customer } from '@/types/customer';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { TranslatedMessage } from '../app/TranslatedMessage';

type CustomerFormData = Pick<Customer, 'name' | 'phone' | 'email'>;

const AddCustomerDialog = () => {
  const t = useTranslations();
  const { mutate: addCustomer, isPending } = useAddCustomer();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  }); // Track errors for name and phone only

  // Helper function to validate phone
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{9,11}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Truncate input if it exceeds 64 characters
    const truncatedValue = value.length > 64 ? value.slice(0, 64) : value;

    setFormData((prev) => ({ ...prev, [name]: truncatedValue }));

    // Validate fields on change
    const newErrors = { ...errors };
    if (name === 'name') {
      newErrors.name = !truncatedValue ? 'Tên khách hàng là bắt buộc.' : '';
    } else if (name === 'phone') {
      newErrors.phone = !validatePhone(truncatedValue)
        ? 'Số điện thoại phải là số hợp lệ.'
        : '';
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    // Check required fields
    if (!formData.name || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    // Validate all fields
    const newErrors = {
      name: !formData.name ? 'Tên khách hàng là bắt buộc.' : '',
      phone: !validatePhone(formData.phone)
        ? 'Số điện thoại phải là số hợp lệ.'
        : '',
    };

    if (newErrors.name || newErrors.phone) {
      setErrors(newErrors);
      if (newErrors.name) toast.error(newErrors.name);
      else if (newErrors.phone) toast.error(newErrors.phone);
      return;
    }

    // Call the API to add customer
    addCustomer(formData, {
      onSuccess: () => {
        setFormData({
          name: '',
          phone: '',
          email: '',
        });
        setOpen(false);
        setErrors({ name: '', phone: '' }); // Reset errors
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Management.create' />
        </Button>
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
            Thêm khách hàng mới
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4 space-y-6 text-sm text-gray-800'>
          <h3 className='text-base font-semibold text-gray-700 mb-2'>
            Thông tin khách hàng
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm text-gray-500' htmlFor='name'>
                Tên khách hàng <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
              )}
            </div>
            <div>
              <Label className='text-sm text-gray-500' htmlFor='phone'>
                Số điện thoại<span className='text-red-500'>*</span>
              </Label>
              <Input
                id='phone'
                name='phone'
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
              )}
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
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Đang thêm...' : t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
