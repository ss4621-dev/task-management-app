
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Navigate } from 'react-router-dom';
import { TaskStatus, TaskPriority, Task as TaskType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { 
  Filter, 
  Plus, 
  Search, 
  Trash2, 
  Edit 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Tasks: React.FC = () => {
  const { user, users, isAuthenticated } = useAuth();
  const { 
    tasks, 
    createTask, 
    updateTask, 
    deleteTask,
    isLoading 
  } = useTasks();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user) return null;
  
  // Filtered and sorted tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    // Assignee filter
    const matchesAssignee = assigneeFilter === 'all' || task.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  }).sort((a, b) => {
    // Sort by due date (ascending)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  const selectedTaskData = selectedTask 
    ? tasks.find(t => t.id === selectedTask) 
    : null;
  
  const getUserById = (id: string) => users.find(u => u.id === id);
  
  // CRUD Operations
  const handleCreateTask = async (formData: any) => {
    await createTask({
      ...formData,
      dueDate: formData.dueDate.toISOString(),
      createdBy: user.id,
    });
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdateTask = async (formData: any) => {
    if (!selectedTaskData) return;
    
    await updateTask(selectedTaskData.id, {
      ...formData,
      dueDate: formData.dueDate.toISOString(),
    });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    await deleteTask(selectedTask);
    setSelectedTask(null);
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">View, filter, and manage all tasks</p>
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
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search tasks by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select
            value={assigneeFilter}
            onValueChange={(value) => setAssigneeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Assignee</SelectLabel>
                <SelectItem value="all">All Assignees</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No tasks match your filters</p>
          <Button 
            variant="link" 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPriorityFilter('all');
              setAssigneeFilter('all');
            }}
          >
            Clear filters
          </Button>
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
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                          </DialogHeader>
                          <TaskForm 
                            initialData={selectedTaskData} 
                            onSubmit={handleUpdateTask} 
                            isLoading={isLoading} 
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={handleDeleteTask}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </DialogHeader>
                  <TaskDetail 
                    task={selectedTaskData} 
                    creator={getUserById(selectedTaskData.createdBy)} 
                    assignee={getUserById(selectedTaskData.assignedTo)} 
                  />
                </DialogContent>
              )}
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
