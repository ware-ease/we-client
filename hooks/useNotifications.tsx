// hooks/useNotifications.ts
import { useEffect, useState, useCallback } from 'react';
import {
  ref,
  onChildAdded,
  push,
  update,
  off,
  DataSnapshot,
} from 'firebase/database';
import { database } from '@/lib/firebase/config'; // Replace with your actual Firebase app export

export enum NotificationType {
  GOOD_REQUEST_CREATED = 1,
  GOOD_REQUEST_UPDATED = 2,
  GOOD_REQUEST_REJECTED = 3,
  GOOD_REQUEST_CONFIRMED = 4,
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: number;
  warehouseId: string;
  timestamp: number;
  read: boolean;
}

interface NotificationInput {
  message: string;
  warehouseId: string;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    const notifRef = ref(database, `notifications/${userId}`);

    const listener = onChildAdded(notifRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      const notification: Notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        warehouseId: data.warehouseId,
        timestamp: data.timestamp,
        read: data.read,
      };
      setNotifications((prev) => {
        const alreadyExists = prev.some((n) => n.id === data.id);
        if (alreadyExists) return prev;
        return [{ ...notification }, ...prev];
      });
    });

    return () => off(notifRef, 'child_added', listener);
  }, [userId]);

  const sendNotification = useCallback(
    async (targetUserId: string, notification: NotificationInput) => {
      const notifRef = ref(database, `notifications/${targetUserId}`);
      await push(notifRef, {
        ...notification,
        timestamp: Date.now(),
        read: false,
      });
    },
    []
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!userId) return;
      const notifRef = ref(
        database,
        `notifications/${userId}/${notificationId}`
      );
      await update(notifRef, { read: true });
    },
    [userId]
  );

  return {
    notifications,
    sendNotification,
    markAsRead,
  };
}
