// Browser notification utilities for task reminders

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
  return null;
};

export const scheduleTaskReminder = (task, minutesBefore = 60) => {
  const dueDate = new Date(task.dueDate);
  const reminderTime = new Date(dueDate.getTime() - minutesBefore * 60 * 1000);
  const now = new Date();

  if (reminderTime <= now) {
    return null; // Reminder time has passed
  }

  const delay = reminderTime.getTime() - now.getTime();

  return setTimeout(() => {
    showNotification(`Task Due Soon: ${task.title}`, {
      body: `Due in ${minutesBefore} minutes`,
      tag: `task-${task._id}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View Task' },
        { action: 'snooze', title: 'Snooze 15min' },
      ],
    });
  }, delay);
};

export const scheduleOverdueReminder = (task) => {
  const dueDate = new Date(task.dueDate);
  const now = new Date();

  if (dueDate >= now) {
    return null; // Not overdue yet
  }

  // Show overdue notification immediately
  showNotification(`Overdue Task: ${task.title}`, {
    body: 'This task is past its due date',
    tag: `overdue-${task._id}`,
    requireInteraction: true,
  });

  return null;
};

// Check and schedule reminders for all tasks
export const setupTaskReminders = (tasks) => {
  const timers = [];

  tasks.forEach(task => {
    if (task.status !== 'done') {
      // Schedule reminder 1 hour before due date
      const reminderTimer = scheduleTaskReminder(task, 60);
      if (reminderTimer) {
        timers.push(reminderTimer);
      }

      // Check for overdue tasks
      scheduleOverdueReminder(task);
    }
  });

  return timers;
};

// Clean up timers
export const clearReminders = (timers) => {
  timers.forEach(timer => clearTimeout(timer));
};