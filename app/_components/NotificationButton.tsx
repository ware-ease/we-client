import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './shadcn-base/DropdownMenu';
import { Bell } from 'lucide-react';
import { NotificationCard } from './NotificationCard';

interface NotificationButtonProps {
  size?: number;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  size = 24,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none hover:bg-accent p-2 rounded-lg'>
        <Bell size={size} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='!border-0 !shadow-none mr-4'>
        <NotificationCard />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationButton;
