'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn-base/Avatar';

interface CreatedByUIProps {
  avatarUrl?: string;
  group: string;
  fullName: string;
}

const CreatedByUI: React.FC<CreatedByUIProps> = ({
  avatarUrl,
  group,
  fullName,
}) => {
  return (
    <div className='flex items-center text-xs space-x-2'>
      <Avatar className='h-8 w-8'>
        <AvatarImage src={avatarUrl || 'https://github.com/shadcn.png'} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-[0.1rem]'>
        <div className='text-sm font-medium'>{fullName}</div>
        <div className='text-xs text-slate-600'>{group}</div>
      </div>
    </div>
  );
};

export default CreatedByUI;
