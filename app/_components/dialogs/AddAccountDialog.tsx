'use client';
import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/app/_components/shadcn-base/RadioGroup';
import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddAccountDialog = () => {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    sex: 'male',
    nationality: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Perform validation
    if (
      !formData.userName ||
      !formData.password ||
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Submit the form data to your API
    console.log('Submitted data:', formData);
    toast.success('Account created successfully!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Management.create' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-4xl p-6 m-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            {t('Dialog.title.accountCreate')}
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='userName'>{t('Login.username')}</Label>
            <Input
              id='userName'
              name='userName'
              value={formData.userName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='password'>{t('Login.password')}</Label>
            <Input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div>
            <Label htmlFor='email'>{t('Settings.email')}</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='firstName'>{t('Settings.firstname')}</Label>
            <Input
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='lastName'>{t('Settings.lastname')}</Label>
            <Input
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='phone'>{t('Settings.phone')}</Label>
            <Input
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-span-2'>
            <Label htmlFor='address'>{t('Settings.address')}</Label>
            <Input
              id='address'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label>{t('Settings.sex')}</Label>
            <RadioGroup
              className='flex space-x-4'
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
          <div>
            <Label htmlFor='nationality'>{t('Settings.nation')}</Label>
            <Input
              id='nationality'
              name='nationality'
              value={formData.nationality}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter className='mt-6 flex justify-end space-x-4'>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='px-4 py-2 hover:bg-slate-200'
            >
              {t('Dialog.cancel')}
            </Button>
          </DialogClose>
          <Button className='px-4 py-2 rounded-lg' onClick={handleSubmit}>
            {t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountDialog;
