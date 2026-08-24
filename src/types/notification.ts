export type NotificationCategory = 'order' | 'revenue' | 'settlement' | 'payment' | 'machine' | 'support' | 'system';

export interface AppNotification {
  id: string;
  recipientId: string; // User ID who should see this
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: string; // e.g. order ID, machine ID
  relatedEntityType?: string;
}
