/**
 * Browser Local Notification Utilities
 * Handles desktop/mobile web notifications with sound & fallbacks.
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.warn('Could not request notification permission:', error);
    return 'denied';
  }
}

export function sendLocalNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    silent?: boolean;
  }
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon || 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/heart.svg',
      tag: options?.tag,
      silent: options?.silent ?? false
    });

    // Auto-close after 6 seconds
    setTimeout(() => {
      try {
        notification.close();
      } catch {
        // ignore
      }
    }, 6000);

    return true;
  } catch (error) {
    console.warn('Failed to send browser notification:', error);
    return false;
  }
}
