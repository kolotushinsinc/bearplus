import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationState } from '../../types';

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.type = 'info'; // можно добавить поле isRead в типы
      }
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  markAsRead,
} = notificationSlice.actions;

// Utility action creators
export const showSuccessNotification = (title: string, message: string, duration?: number) =>
  addNotification({
    type: 'success',
    title,
    message,
    duration,
  });

export const showErrorNotification = (title: string, message: string, duration?: number) =>
  addNotification({
    type: 'error',
    title,
    message,
    duration,
  });

export const showWarningNotification = (title: string, message: string, duration?: number) =>
  addNotification({
    type: 'warning',
    title,
    message,
    duration,
  });

export const showInfoNotification = (title: string, message: string, duration?: number) =>
  addNotification({
    type: 'info',
    title,
    message,
    duration,
  });

export default notificationSlice.reducer;