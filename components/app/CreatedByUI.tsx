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
    <div className='flex items-center'>
      <Avatar>
        <AvatarImage src={avatarUrl || 'https://github.com/shadcn.png'} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-1'>
        <div>{fullName}</div>
        <div>{group}</div>
      </div>
    </div>
  );
};

export default CreatedByUI;
