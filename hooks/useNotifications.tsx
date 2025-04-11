'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  ref,
  onChildAdded,
  push,
  update,
  off,
  DataSnapshot,
  onChildChanged,
} from 'firebase/database';
import { database } from '@/lib/firebase/config';

export enum NotificationType {
  GOOD_REQUEST_CREATED = 0,
  GOOD_REQUEST_UPDATED = 1,
  GOOD_REQUEST_REJECTED = 2,
  GOOD_REQUEST_CONFIRMED = 3,
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

    const handleSnapshot = (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      const notification: Notification = {
        id: snapshot.key!,
        title: data.title,
        message: data.message,
        type: data.type,
        warehouseId: data.warehouseId,
        timestamp: data.timestamp,
        read: data.read,
      };

      setNotifications((prev) => {
        const existing = prev.find((n) => n.id === notification.id);
        if (existing) {
          return prev.map((n) => (n.id === notification.id ? notification : n));
        } else {
          return [notification, ...prev];
        }
      });
    };

    const addedListener = onChildAdded(notifRef, handleSnapshot);
    const changedListener = onChildChanged(notifRef, handleSnapshot);

    return () => {
      off(notifRef, 'child_added', addedListener);
      off(notifRef, 'child_changed', changedListener);
    };
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

  const markAllAsRead = useCallback(async () => {
    if (!userId || notifications.length === 0) return;

    const updates: { [key: string]: boolean } = {};
    notifications.forEach((notification) => {
      if (!notification.read) {
        updates[`${notification.id}/read`] = true;
      }
    });

    const notifRef = ref(database, `notifications/${userId}`);
    await update(notifRef, updates);
  }, [userId, notifications]);

  return {
    notifications,
    sendNotification,
    markAsRead,
    markAllAsRead,
  };
}
