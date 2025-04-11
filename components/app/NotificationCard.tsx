'use client';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils/utils';
import { Button } from '../shadcn-base/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';
import { useAuth } from '../providers/AuthProvider';
import {
  Notification,
  NotificationType,
  useNotifications,
} from '@/hooks/useNotifications';
import { useState } from 'react';
import { Link } from '@/lib/i18n/routing';

type CardProps = React.ComponentProps<typeof Card>;

const getUrlFromNotification = (notification: Notification) => {
  if (notification.type === NotificationType.GOOD_REQUEST_CREATED) {
    return `warehouses/${notification.warehouseId}/requests`;
  }
  if (notification.type === NotificationType.GOOD_REQUEST_UPDATED) {
    return `warehouses/${notification.warehouseId}/requests`;
  }
  if (notification.type === NotificationType.GOOD_REQUEST_CONFIRMED) {
    return `requests`;
  }
  if (notification.type === NotificationType.GOOD_REQUEST_REJECTED) {
    return `requests`;
  }

  return '';
};

export function NotificationCard({ className, ...props }: CardProps) {
  const { currentUser } = useAuth();
  const { notifications } = useNotifications(currentUser?.id);
  const [showUnread, setShowUnread] = useState(true);
  console.log(notifications);

  const filteredNotifications = showUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle className='text-lg'>Thông báo</CardTitle>
        <CardDescription>
          <Button
            variant={showUnread ? 'default' : 'outline'}
            onClick={() => setShowUnread(true)}
            className='rounded-2xl mr-3'
          >
            Chưa đọc ({notifications.filter((n) => !n.read).length})
          </Button>
          <Button
            variant={!showUnread ? 'default' : 'outline'}
            onClick={() => setShowUnread(false)}
            className='rounded-2xl'
          >
            Tất cả ({notifications.length})
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <div>
          {filteredNotifications.length !== 0 ? (
            filteredNotifications.map((notification, index) => (
              <Link
                href={getUrlFromNotification(notification)}
                key={index}
                className='mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0'
              >
                <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
                <div className='space-y-1'>
                  <p className='font-medium leading-none'>
                    {notification.title}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {notification.message}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center'>Chưa có thông báo.</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className='w-full'>
          <Check /> Đánh dấu tất cả đã đọc
        </Button>
      </CardFooter>
    </Card>
  );
}
