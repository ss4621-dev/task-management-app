
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string; // User ID
  assignedTo: string; // User ID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Notification {
  id: string;
  type: 'task-assigned' | 'task-updated' | 'task-completed' | 'task-deleted';
  taskId: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
}
