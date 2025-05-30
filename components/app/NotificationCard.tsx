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
import { useEffect, useState } from 'react';
import { Link } from '@/lib/i18n/routing';

type CardProps = React.ComponentProps<typeof Card>;

const getUrlFromNotification = (notification: Notification) => {
  if (notification.type === NotificationType.GOOD_REQUEST_CREATED) {
    return `/warehouses/${notification.warehouseId}/requests?status=0`;
  }
  if (notification.type === NotificationType.GOOD_REQUEST_UPDATED) {
    return `/warehouses/${notification.warehouseId}/requests?status=1`;
  }
  if (notification.type === NotificationType.GOOD_REQUEST_CONFIRMED) {
    return `/requests`;
  }
  if (notification.type === NotificationType.GOOD_REQUEST_REJECTED) {
    return `/requests`;
  }
  return '';
};

export function NotificationCard({ className, ...props }: CardProps) {
  const { currentUser } = useAuth();
  const { notifications, markAllAsRead } = useNotifications(currentUser?.id);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [showUnread, setShowUnread] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    // Sort notifications by timestamp (descending)
    const sortedNotifications = [...notifications].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    // Filter based on showUnread
    setFilteredNotifications(
      showUnread
        ? sortedNotifications.filter((n) => !n.read)
        : sortedNotifications
    );
    // Reset displayCount when switching tabs
    setDisplayCount(10);
  }, [notifications, showUnread]);

  const loadMoreNotifications = () => {
    setDisplayCount((prev) => prev + 10);
  };

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
            Tất cả
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4 h-[60vh] overflow-y-auto'>
        <div>
          {filteredNotifications.length !== 0 ? (
            filteredNotifications
              .slice(0, showUnread ? undefined : displayCount)
              .map((notification, index) => (
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
                    <p className='text-xs text-gray-400'>
                      {new Date(notification.timestamp).toLocaleString(
                        'vi-VN',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </Link>
              ))
          ) : (
            <div className='flex items-center justify-center h-full font-medium'>
              Chưa có thông báo mới.
            </div>
          )}
        </div>
        {!showUnread && displayCount < filteredNotifications.length && (
          <Button
            className='w-full mt-4'
            variant='default'
            onClick={loadMoreNotifications}
          >
            Tải thêm
          </Button>
        )}
      </CardContent>
      {showUnread && filteredNotifications.length !== 0 && (
        <CardFooter>
          <Button className='w-full' onClick={markAllAsRead}>
            <Check /> Đánh dấu tất cả đã đọc
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
