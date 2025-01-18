import { Button } from '@/app/_components/Button';
import { Input } from '@/app/_components/Input';
import React from 'react';

const Login = () => {
  return (
    <div>
      <div className='flex flex-col items-center bg-white px-12 py-16 rounded-2xl bg-opacity-80'>
        <div className='flex flex-col items-center gap-4 mb-8'>
          <div className='font-bold text-5xl'>WareEase</div>
          <div className='text-3xl'>Welcome back</div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-[0.25rem]'>
            <div>Username</div>
            <Input
              className='w-96 rounded-xl h-12 bg-white bg-opacity-95 md:text-md'
              placeholder='Enter your username'
            />
          </div>
          <div className='flex flex-col gap-[0.25rem]'>
            <div>Password</div>
            <Input
              className='w-96 rounded-xl h-12 bg-white bg-opacity-95 md:text-md'
              type='password'
              placeholder='Enter your password'
            />
          </div>
          <div className='flex justify-end w-full'>
            <div>Forgot password?</div>
          </div>
          <div className='flex justify-center gap-4 w-full'>
            <Button className='font-semibold w-full rounded-xl h-12 text-md'>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
