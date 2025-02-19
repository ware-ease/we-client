'use client';
import { Button } from '@/app/_components/shadcn-base/Button';
import { Input } from '@/app/_components/shadcn-base/Input';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import LanguageSelector from '@/app/_components/LanguageSelector';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { login } from '@/lib/services/authService';

const Login = () => {
  const t = useTranslations();
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginMutation = useMutation({
    mutationFn: (loginCredentials: unknown) => {
      return login(loginCredentials);
    },
    onSuccess: () => {
      toast.success(t('Toast.success'), {
        autoClose: 3000,
      });
      router.push(`/${t('Languages.this')}/dashboard`);
    },
    onError: () => {
      toast.error(t('Toast.error'), {
        autoClose: 3000,
      });
    },
  });

  const handleLoginClick = async () => {
    loginMutation.mutate({ username, password });
  };

  return (
    <div>
      <div className='flex flex-col items-center bg-white px-12 py-16 rounded-2xl bg-opacity-80 relative'>
        <div className='absolute top-0 right-0 m-4'>
          <LanguageSelector />
        </div>
        <div className='flex flex-col items-center gap-4 mb-8'>
          <div className='font-bold text-5xl'>WareEase</div>
          <div className='text-3xl'>{t('Login.welcome')}</div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-[0.25rem]'>
            <div>{t('Login.username')}</div>
            <Input
              className='w-96 rounded-xl h-12 bg-white bg-opacity-95 md:text-md'
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-[0.25rem]'>
            <div>{t('Login.password')}</div>
            <Input
              className='w-96 rounded-xl h-12 bg-white bg-opacity-95 md:text-md'
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='flex justify-end w-full'>
            <div>{t('Login.forgot')}</div>
          </div>
          <div className='flex justify-center gap-4 w-full'>
            <Button
              className='font-semibold w-full rounded-xl h-12 text-md'
              onClick={() => handleLoginClick()}
              disabled={loginMutation.isPending}
            >
              {t('Login.login')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
