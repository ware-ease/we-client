import React from 'react';
import { SidebarTrigger } from '../shadcn-base/SideBar';
// import LanguageSelector from './LanguageSelector';
import NotificationButton from './NotificationButton';
import AvatarButton from './AvatarButton';

const Nav = () => {
  // const t = useTranslations();

  return (
    <div className='flex w-full h-[48px] flex-grow-1 items-center justify-between'>
      <SidebarTrigger className='p-5' />
      <div className='flex items-center h-full mr-6 space-x-2'>
        {/* <LanguageSelector size={20} /> */}
        <NotificationButton size={20} />
        <AvatarButton />
      </div>
    </div>
  );
};

export default Nav;
