'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn-base/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn-base/DropdownMenu';
import { Link, useRouter } from '@/lib/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { useAuth } from '../providers/AuthProvider';
import { logout } from '@/services/authService';

const AvatarButton = () => {
  const lang = useCurrentLanguage();
  const t = useTranslations();
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none hover:opacity-90 px-2 rounded-full'>
        <Avatar className='h-9 w-9 select-none'>
          {
            <AvatarImage
              src={
                currentUser?.profile.avatarUrl ||
                'https://github.com/shadcn.png'
              }
            />
          }
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-4'>
        <Link href={'/settings'} locale={lang}>
          <DropdownMenuItem>{t('Sidebar.settings')}</DropdownMenuItem>
        </Link>
        <div onClick={handleLogout}>
          <DropdownMenuItem>{t('Sidebar.logout')}</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarButton;
