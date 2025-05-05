
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, TaskPriority, TaskStatus, User } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { useNotifications } from "./NotificationContext";

// Sample tasks for demonstration purposes
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Create project proposal",
    description: "Draft a comprehensive project proposal for the new client",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: "high",
    status: "todo",
    createdBy: "user-1",
    assignedTo: "user-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Design user interface mockups",
    description: "Create wireframes and mockups for the new application",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    priority: "medium",
    status: "in-progress",
    createdBy: "user-2",
    assignedTo: "user-3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task-3",
    title: "Implement authentication system",
    description: "Develop the user authentication and authorization system",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    priority: "high",
    status: "todo",
    createdBy: "user-1",
    assignedTo: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task-4",
    title: "Conduct code review",
    description: "Review and provide feedback on the latest pull request",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago (overdue)
    priority: "low",
    status: "review",
    createdBy: "user-2",
    assignedTo: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task-5",
    title: "Update documentation",
    description: "Update API documentation with the latest endpoints",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: "medium",
    status: "completed",
    createdBy: "user-3",
    assignedTo: "user-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByAssignee: (userId: string) => Task[];
  getTasksByCreator: (userId: string) => Task[];
  getOverdueTasks: () => Task[];
  assignTask: (taskId: string, userId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Failed to parse saved tasks:", error);
        // Fallback to sample tasks
        setTasks(sampleTasks);
        localStorage.setItem("tasks", JSON.stringify(sampleTasks));
      }
    } else {
      // Save sample tasks to localStorage
      localStorage.setItem("tasks", JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const createTask = async (newTaskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask: Task = {
        ...newTaskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully");
      
      // Create notification for task assignment
      if (newTask.assignedTo !== newTask.createdBy) {
        createNotification({
          type: "task-assigned",
          taskId: newTask.id,
          message: `You've been assigned a new task: ${newTask.title}`
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        throw new Error("Task not found");
      }
      
      const oldTask = tasks[taskIndex];
      const updatedTask: Task = {
        ...oldTask,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      setTasks(newTasks);
      
      toast.success("Task updated successfully");
      
      // Create notification for reassignment
      if (updates.assignedTo && updates.assignedTo !== oldTask.assignedTo) {
        createNotification({
          type: "task-updated",
          taskId,
          message: `You've been assigned a task: ${updatedTask.title}`
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskToDelete = tasks.find(t => t.id === taskId);
      if (!taskToDelete) {
        throw new Error("Task not found");
      }
      
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted successfully");
      
      // Create notification for deleted tasks
      if (taskToDelete.assignedTo !== user?.id) {
        createNotification({
          type: "task-deleted",
          taskId,
          message: `A task assigned to you was deleted: ${taskToDelete.title}`
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const getTasksByAssignee = (userId: string) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  const getTasksByCreator = (userId: string) => {
    return tasks.filter(task => task.createdBy === userId);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.status !== 'completed' && new Date(task.dueDate) < now
    );
  };

  const assignTask = async (taskId: string, userId: string) => {
    await updateTask(taskId, { assignedTo: userId });
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const task = getTaskById(taskId);
    
    await updateTask(taskId, { status });
    
    // Create notification for completed tasks
    if (status === "completed" && task && task.assignedTo !== task.createdBy) {
      createNotification({
        type: "task-completed",
        taskId,
        message: `Task completed: ${task.title}`
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByAssignee,
        getTasksByCreator,
        getOverdueTasks,
        assignTask,
        updateTaskStatus
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
