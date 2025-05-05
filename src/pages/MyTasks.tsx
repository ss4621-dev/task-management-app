
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Navigate } from 'react-router-dom';
import { TaskStatus, TaskPriority } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/Tasks/TaskCard';
import TaskDetail from '@/components/Tasks/TaskDetail';
import TaskForm from '@/components/Tasks/TaskForm';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

const MyTasks: React.FC = () => {
  const { user, users, isAuthenticated } = useAuth();
  const { 
    getTasksByAssignee, 
    updateTask, 
    updateTaskStatus,
    isLoading 
  } = useTasks();
  
  // States
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user) return null;
  
  const myTasks = getTasksByAssignee(user.id);
  
  // Filtered tasks based on active tab
  const filteredTasks = activeTab === 'all' 
    ? myTasks 
    : myTasks.filter(task => task.status === activeTab);
  
  const todoCount = myTasks.filter(task => task.status === 'todo').length;
  const inProgressCount = myTasks.filter(task => task.status === 'in-progress').length;
  const reviewCount = myTasks.filter(task => task.status === 'review').length;
  const completedCount = myTasks.filter(task => task.status === 'completed').length;
  
  const selectedTaskData = selectedTask 
    ? myTasks.find(t => t.id === selectedTask) 
    : null;
  
  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const handleUpdateTask = async (formData: any) => {
    if (!selectedTaskData) return;
    
    await updateTask(selectedTaskData.id, {
      ...formData,
      dueDate: formData.dueDate.toISOString(),
    });
    setIsEditDialogOpen(false);
  };
  
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTaskStatus(taskId, status);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">Manage and track your assigned tasks</p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as TaskStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="all">
            All Tasks ({myTasks.length})
          </TabsTrigger>
          <TabsTrigger value="todo">
            To Do ({todoCount})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="review">
            Review ({reviewCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {activeTab === 'all' 
                  ? 'You have no assigned tasks' 
                  : `You have no ${activeTab.replace('-', ' ')} tasks`
                }
              </p>
              {activeTab !== 'all' && (
                <Button variant="link" onClick={() => setActiveTab('all')}>
                  View all tasks
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <Dialog key={task.id}>
                  <DialogTrigger asChild>
                    <div onClick={() => setSelectedTask(task.id)}>
                      <TaskCard 
                        task={task} 
                        assignee={getUserById(task.assignedTo)} 
                      />
                    </div>
                  </DialogTrigger>
                  {selectedTaskData && selectedTaskData.id === task.id && (
                    <DialogContent className="max-w-lg">
                      <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle>Task Details</DialogTitle>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Update Task</DialogTitle>
                            </DialogHeader>
                            <TaskForm 
                              initialData={selectedTaskData} 
                              onSubmit={handleUpdateTask} 
                              isLoading={isLoading} 
                            />
                          </DialogContent>
                        </Dialog>
                      </DialogHeader>
                      <TaskDetail 
                        task={selectedTaskData} 
                        creator={getUserById(selectedTaskData.createdBy)} 
                        assignee={getUserById(selectedTaskData.assignedTo)} 
                      />
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-sm font-medium mb-3">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={selectedTaskData.status === 'todo' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTaskData.id, 'todo')}
                            disabled={selectedTaskData.status === 'todo'}
                            size="sm"
                          >
                            To Do
                          </Button>
                          <Button
                            variant={selectedTaskData.status === 'in-progress' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTaskData.id, 'in-progress')}
                            disabled={selectedTaskData.status === 'in-progress'}
                            size="sm"
                          >
                            In Progress
                          </Button>
                          <Button
                            variant={selectedTaskData.status === 'review' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTaskData.id, 'review')}
                            disabled={selectedTaskData.status === 'review'}
                            size="sm"
                          >
                            Review
                          </Button>
                          <Button
                            variant={selectedTaskData.status === 'completed' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTaskData.id, 'completed')}
                            disabled={selectedTaskData.status === 'completed'}
                            size="sm"
                          >
                            Completed
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
