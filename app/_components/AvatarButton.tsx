'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './shadcn-base/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './shadcn-base/DropdownMenu';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCurrentLanguage } from '@/lib/hooks/useCurrentLanguage';
import { useAuth } from './providers/AuthProvider';

const AvatarButton = () => {
  const lang = useCurrentLanguage();
  const t = useTranslations();
  const { currentUser } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none hover:opacity-90 px-2 rounded-full'>
        <Avatar className='h-9 w-9 select-none'>
          <AvatarImage src={currentUser?.avatarUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-4'>
        <Link href={'settings'} locale={lang}>
          <DropdownMenuItem>{t('Sidebar.settings')}</DropdownMenuItem>
        </Link>
        <Link href={'logout'} locale={lang}>
          <DropdownMenuItem>{t('Sidebar.logout')}</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarButton;
