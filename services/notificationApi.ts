// services/notificationApi.ts

export type Notification = {
  id: string;
  title: string;
  description: string;
  dueTime: string;
  status: 'PENDING' | 'COMPLETED';
};

//  In-memory "DB" (mock backend state)
let notificationStore: Notification[] = [
  {
    id: '1',
    title: 'Pending Task  Mail Review',
    description:
      'Review Outlook inbox and respond to pending internal emails related to project updates and approvals.',
    dueTime: new Date().toISOString(),
    status: 'PENDING',
  },
  {
    id: '2',
    title: 'Pending Task  Document Verification',
    description:
      'Verify uploaded documents and confirm compliance status for assigned request.',
    dueTime: new Date().toISOString(),
    status: 'PENDING',
  },
];

//  GET notifications (like backend API)
export const getNotifications = async (): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...notificationStore];
};

// REMOVE notification (Cancel)
export const removeNotification = async (id: string) => {
  notificationStore = notificationStore.filter(n => n.id !== id);
};

// ➕ RESEND / ADD notification again
export const resendMailReviewReminder = async () => {
  const exists = notificationStore.some(n => n.id === '1');
  if (exists) return;

  notificationStore.unshift({
    id: '1',
    title: 'Pending Task – Mail Review',
    description:
      'Review Outlook inbox and respond to pending internal emails related to project updates and approvals.',
    dueTime: new Date().toISOString(),
    status: 'PENDING',
  });
};
