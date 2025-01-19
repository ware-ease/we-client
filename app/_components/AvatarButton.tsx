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
import { useCurrentLanguage } from '@/lib/useCurrentLanguage';

const AvatarButton = () => {
  const lang = useCurrentLanguage();
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none hover:opacity-90 p-2 rounded-full'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='https://github.com/shadcn.png' />
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
