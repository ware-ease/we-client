'use client';
import PasswordStrength, {
  checkPasswordStrength,
} from '@/components/app/PasswordStrength';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';
import { changePassword } from '@/services/accountService';
import { ChangePasswordRequest } from '@/types/request/account';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const t = useTranslations();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const changePasswordMutation = useMutation({
    mutationFn: (password: ChangePasswordRequest) => {
      const res = changePassword(password);
      return res;
    },
    onSuccess: () => {
      toast.success(t('Toast.success'), {
        autoClose: 3000,
      });
      router.push(`/${t('Languages.this')}/login`);
    },
    onError: () => {
      toast.error(t('Toast.error'), {
        autoClose: 3000,
      });
    },
  });

  const handleChangePasswordConfirm = () => {
    if (checkPasswordStrength(newPassword) < 5) {
      const errorMessage = 'Mật khẩu chưa đủ mạnh';
      toast.error(errorMessage, {
        autoClose: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      const errorMessage = 'Mật khẩu không khớp';
      toast.error(errorMessage, {
        autoClose: 3000,
      });
      return;
    }

    const password: ChangePasswordRequest = {
      oldPassword: oldPassword,
      password: newPassword,
    };
    changePasswordMutation.mutate(password);
  };

  return (
    <div className='flex-col w-full'>
      <div className='p-4 text-xl text-primary border-b-2'>
        <div>{t('Settings.account')}</div>
      </div>
      <div className='flex px-4'>
        <div className='p-4 flex flex-col gap-3 w-1/2'>
          <div className='flex'>
            <div className='flex items-center w-2/5'>{t('Login.username')}</div>
            <Input className='border-gray-300 w-3/5' />
          </div>
          <div className='relative h-full w-full'>
            <Button
              disabled
              className='bg-red-700 hover:bg-red-950 absolute bottom-0 right-0'
            >
              {t('Settings.update')}
            </Button>
          </div>
        </div>
        <div className='p-4 flex flex-col gap-3 w-1/2'>
          <div className='flex'>
            <div className='flex items-center w-2/5'>Mật khẩu hiện tại</div>
            <Input
              type='password'
              className='border-gray-300 w-3/5'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className='flex'>
            <div className='flex items-center w-2/5'>{t('Login.password')}</div>
            <div className='flex flex-col w-3/5 space-y-2'>
              <Input
                type='password'
                className='border-gray-300'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordStrength password={newPassword} />
            </div>
          </div>
          <div className='flex'>
            <div className='flex items-center w-2/5'>
              {t('Settings.confirmPassword')}
            </div>
            <Input
              type='password'
              className='border-gray-300 w-3/5'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className='w-full text-right'>
            <Button
              onClick={() => handleChangePasswordConfirm()}
              className='bg-red-700 hover:bg-red-950'
            >
              {t('Settings.update')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
