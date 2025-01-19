import React from 'react';
import { SidebarTrigger } from './SideBar';
import LanguageSelector from './LanguageSelector';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import NotificationButton from './NotificationButton';

const Nav = () => {
  // const t = useTranslations();

  return (
    <div className='flex w-full h-12 flex-grow-1 items-center justify-between'>
      <SidebarTrigger className='p-5' />
      <div className='flex items-center h-full mr-6 space-x-2'>
        <LanguageSelector size={20} />
        <NotificationButton size={20} />
        <Avatar className='h-9 w-9'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Nav;
