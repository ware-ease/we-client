'use client';
import { TranslatedMessage } from '@/components/app/TranslatedMessage';
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/shadcn-base/RadioGroup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-base/Select';
import {
  useAddAccount,
  useGroups,
  useWarehouses,
} from '@/hooks/queries/accountQueries';
import { CreateAccount } from '@/types/account';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { MultiSelect } from '../shadcn-base/MultiSelect';

const AddAccountDialog = () => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    sex: 'male',
    nationality: '',
    groupId: '',
    warehouseIds: [] as string[],
  });
  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    phone: '',
  }); // Track errors for multiple fields

  const { mutate: addAccount } = useAddAccount();
  const { data: groupsData } = useGroups();
  const { data: warehousesData } = useWarehouses();

  const groups = groupsData || [];
  const warehouses = warehousesData || [];

  // Helper function to validate username
  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]{3,16}$/;
    return usernameRegex.test(username);
  };

  // Helper function to validate email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to validate phone
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{9,11}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Truncate input if it exceeds 64 characters (except for username, which has its own limit)
    const truncatedValue =
      name !== 'userName' && value.length > 64 ? value.slice(0, 64) : value;

    setFormData((prev) => ({ ...prev, [name]: truncatedValue }));

    // Validate fields on change
    const newErrors = { ...errors };
    if (name === 'userName') {
      newErrors.userName = !validateUsername(truncatedValue)
        ? 'Tên người dùng phải có từ 3-16 ký tự và chỉ chứa chữ cái và số.'
        : '';
    } else if (name === 'email') {
      newErrors.email = !validateEmail(truncatedValue)
        ? 'Email phải là địa chỉ email hợp lệ.'
        : '';
    } else if (name === 'phone') {
      newErrors.phone = !validatePhone(truncatedValue)
        ? 'Số điện thoại phải là số và có độ dài từ 9-11 ký tự.'
        : '';
    }
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    // Check required fields
    if (
      !formData.userName ||
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.groupId
    ) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    // Validate all fields
    const newErrors = {
      userName: !validateUsername(formData.userName)
        ? 'Tên người dùng phải có từ 3-16 ký tự và không chứa ký tự đặc biệt.'
        : '',
      email: !validateEmail(formData.email)
        ? 'Email phải là địa chỉ email hợp lệ.'
        : '',
      phone: !validatePhone(formData.phone)
        ? 'Số điện thoại phải là số hợp lệ.'
        : '',
    };

    if (newErrors.userName || newErrors.email || newErrors.phone) {
      setErrors(newErrors);
      if (newErrors.userName) toast.error(newErrors.userName);
      else if (newErrors.email) toast.error(newErrors.email);
      else if (newErrors.phone) toast.error(newErrors.phone);
      return;
    }

    // Validate length of other fields (should already be truncated)
    const fieldsToCheck = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      nationality: formData.nationality,
    };
    for (const [fieldName, value] of Object.entries(fieldsToCheck)) {
      if (value.length > 64) {
        toast.error(`${fieldName} không được vượt quá 64 ký tự.`);
        return;
      }
    }

    const accountData: CreateAccount = {
      username: formData.userName,
      email: formData.email,
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address || '',
        sex: formData.sex === 'male',
        nationality: formData.nationality || '',
        avatarUrl: '',
      },
      groupId: formData.groupId,
      warehouseIds: formData.warehouseIds,
    };

    addAccount(accountData, {
      onSuccess: () => {
        setOpen(false);
        // Reset form
        setFormData({
          userName: '',
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          sex: 'male',
          nationality: '',
          groupId: '',
          warehouseIds: [],
        });
        setErrors({ userName: '', email: '', phone: '' }); // Reset errors
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
            {t('Dialog.title.accountCreate')}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 space-y-6 text-sm text-gray-800'>
          {/* --- THÔNG TIN TÀI KHOẢN --- */}
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>
              Thông tin tài khoản
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm text-gray-500' htmlFor='userName'>
                  {t('Login.username')}
                </Label>
                <Input
                  id='userName'
                  name='userName'
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg ${
                    errors.userName ? 'border-red-500' : ''
                  }`}
                />
                {errors.userName && (
                  <p className='text-red-500 text-xs mt-1'>{errors.userName}</p>
                )}
              </div>
              <div>
                <Label className='text-sm text-gray-500' htmlFor='email'>
                  {t('Settings.email')}
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                )}
              </div>
            </div>
          </div>
          {/* --- THÔNG TIN CÁ NHÂN --- */}
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>
              Thông tin cá nhân
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm text-gray-500' htmlFor='lastName'>
                  {t('Settings.lastname')}
                </Label>
                <Input
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>
              <div>
                <Label className='text-sm text-gray-500' htmlFor='firstName'>
                  {t('Settings.firstname')}
                </Label>
                <Input
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>
              <div>
                <Label className='text-sm text-gray-500' htmlFor='phone'>
                  {t('Settings.phone')}
                </Label>
                <Input
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                />
                {errors.phone && (
                  <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
                )}
              </div>
              <div>
                <Label className='text-sm text-gray-500' htmlFor='nationality'>
                  {t('Settings.nation')}
                </Label>
                <Input
                  id='nationality'
                  name='nationality'
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>
              <div>
                <Label className='text-sm text-gray-500'>
                  {t('Settings.sex')}
                </Label>
                <RadioGroup
                  className='flex space-x-4 mt-1'
                  value={formData.sex}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sex: value })
                  }
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='male' id='male' />
                    <Label htmlFor='male'>{t('Settings.male')}</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='female' id='female' />
                    <Label htmlFor='female'>{t('Settings.female')}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className='col-span-2'>
                <Label className='text-sm text-gray-500' htmlFor='address'>
                  {t('Settings.address')}
                </Label>
                <Input
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>
            </div>
          </div>
          {/* --- NHÓM NGƯỜI DÙNG --- */}
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>
              Nhóm người dùng
            </h3>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, groupId: value })
              }
              value={formData.groupId}
            >
              <SelectTrigger className='w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'>
                <SelectValue placeholder='Chọn nhóm người dùng' />
              </SelectTrigger>
              <SelectContent>
                {groups
                  .filter((group) => group.name !== 'Admin')
                  .map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {/* --- KHO --- */}
          {['2', '3'].includes(formData.groupId) && (
            <div className='p-4'>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Kho
              </h3>
              <MultiSelect
                options={warehouses.map((warehouse) => ({
                  value: warehouse.id,
                  label: warehouse.name,
                }))}
                onValueChange={(values) => {
                  setFormData((prev) => ({
                    ...prev,
                    warehouseIds: values,
                  }));
                }}
                defaultValue={formData.warehouseIds ?? []}
                placeholder='Chọn kho'
                maxCount={3}
              />
            </div>
          )}
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
          >
            {t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountDialog;
