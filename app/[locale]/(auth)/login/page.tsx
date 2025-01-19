import { Button } from '@/app/_components/shadcn-base/Button';
import { Input } from '@/app/_components/shadcn-base/Input';
import { useTranslations } from 'next-intl';
import React from 'react';
import LanguageSelector from '@/app/_components/LanguageSelector';

const Login = () => {
  const t = useTranslations();

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
            />
          </div>
          <div className='flex flex-col gap-[0.25rem]'>
            <div>{t('Login.password')}</div>
            <Input
              className='w-96 rounded-xl h-12 bg-white bg-opacity-95 md:text-md'
              type='password'
              placeholder='Enter your password'
            />
          </div>
          <div className='flex justify-end w-full'>
            <div>{t('Login.forgot')}</div>
          </div>
          <div className='flex justify-center gap-4 w-full'>
            <Button className='font-semibold w-full rounded-xl h-12 text-md'>
              {t('Login.login')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
