'use client';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../shadcn-base/DropdownMenu';
import { Bell } from 'lucide-react';
import { NotificationCard } from './NotificationCard';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '../providers/AuthProvider';

interface NotificationButtonProps {
  size?: number;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  size = 24,
}) => {
  const { currentUser } = useAuth();
  const { notifications } = useNotifications(currentUser?.id);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  console.log(notifications);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='relative outline-none hover:bg-accent p-2 rounded-lg'>
        <Bell size={size} />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 -translate-y-1 translate-x-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[0.625rem] text-white shadow-md leading-[1rem]'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='!border-0 !shadow-none mr-4'>
        <NotificationCard />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationButton;
