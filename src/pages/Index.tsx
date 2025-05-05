
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Navigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/Tasks/TaskCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import TaskForm from '@/components/Tasks/TaskForm';
import TaskDetail from '@/components/Tasks/TaskDetail';
import { 
  CheckCircle, 
  Clock, 
  ListTodo, 
  Plus, 
  UserCircle 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, users, isAuthenticated } = useAuth();
  const { 
    tasks, 
    getTasksByAssignee, 
    getTasksByCreator, 
    getOverdueTasks, 
    createTask, 
    isLoading 
  } = useTasks();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user) return null;
  
  const assignedTasks = getTasksByAssignee(user.id);
  const createdTasks = getTasksByCreator(user.id);
  const overdueTasks = getOverdueTasks().filter(task => task.assignedTo === user.id);
  
  const todoCount = assignedTasks.filter(t => t.status === 'todo').length;
  const inProgressCount = assignedTasks.filter(t => t.status === 'in-progress').length;
  const reviewCount = assignedTasks.filter(t => t.status === 'review').length;
  const completedCount = assignedTasks.filter(t => t.status === 'completed').length;
  
  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const handleCreateTask = async (formData: any) => {
    await createTask({
      ...formData,
      dueDate: formData.dueDate.toISOString(),
      createdBy: user.id,
    });
    setIsCreateDialogOpen(false);
  };
  
  const selectedTaskData = selectedTask 
    ? tasks.find(t => t.id === selectedTask) 
    : null;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} isLoading={isLoading} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoCount}</div>
            <p className="text-xs text-muted-foreground">
              {todoCount === 1 ? 'task' : 'tasks'} waiting to be started
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressCount === 1 ? 'task' : 'tasks'} currently in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Review</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewCount}</div>
            <p className="text-xs text-muted-foreground">
              {reviewCount === 1 ? 'task' : 'tasks'} waiting for review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {completedCount === 1 ? 'task' : 'tasks'} completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">My Tasks</h2>
            <Badge variant="outline" className="px-3">
              {assignedTasks.length}
            </Badge>
          </div>
          <div className="space-y-4 overflow-auto max-h-96 pr-1">
            {assignedTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tasks assigned to you yet
              </p>
            ) : (
              assignedTasks
                .filter(task => task.status !== 'completed')
                .slice(0, 5)
                .map(task => (
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
                        <DialogHeader>
                          <DialogTitle>Task Details</DialogTitle>
                        </DialogHeader>
                        <TaskDetail 
                          task={selectedTaskData} 
                          creator={getUserById(selectedTaskData.createdBy)} 
                          assignee={getUserById(selectedTaskData.assignedTo)} 
                        />
                      </DialogContent>
                    )}
                  </Dialog>
                ))
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-red-500">Overdue Tasks</h2>
            <Badge variant="outline" className="px-3 bg-red-100 text-red-800 hover:bg-red-100">
              {overdueTasks.length}
            </Badge>
          </div>
          <div className="space-y-4 overflow-auto max-h-96 pr-1">
            {overdueTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No overdue tasks. Great job!
              </p>
            ) : (
              overdueTasks.slice(0, 5).map(task => (
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
                      <DialogHeader>
                        <DialogTitle>Task Details</DialogTitle>
                      </DialogHeader>
                      <TaskDetail 
                        task={selectedTaskData} 
                        creator={getUserById(selectedTaskData.createdBy)} 
                        assignee={getUserById(selectedTaskData.assignedTo)} 
                      />
                    </DialogContent>
                  )}
                </Dialog>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
