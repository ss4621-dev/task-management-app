
import React from 'react';
import { format } from 'date-fns';
import { Task, User } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onClick?: () => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  assignee, 
  onClick,
  className
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };
  
  const statusColors = {
    'todo': "bg-gray-100 text-gray-800",
    'in-progress': "bg-purple-100 text-purple-800",
    'review': "bg-yellow-100 text-yellow-800",
    'completed': "bg-green-100 text-green-800"
  };
  
  const statusLabels = {
    'todo': "To Do",
    'in-progress': "In Progress",
    'review': "In Review",
    'completed': "Completed"
  };

  const cardClassName = cn(
    "cursor-pointer transition-all hover:shadow-md",
    task.status === 'completed' ? "task-completed" : `task-priority-${task.priority}`,
    className
  );
  
  return (
    <Card className={cardClassName} onClick={onClick}>
      <CardHeader className="p-4 pb-2 gap-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
          {task.status === 'completed' && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <Badge variant="outline" className={statusColors[task.status]}>
            {statusLabels[task.status]}
          </Badge>
        </div>
        <CardDescription className="mt-1 line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-2 flex justify-between items-center text-sm text-muted-foreground">
        <div>
          {isOverdue ? (
            <span className="text-red-500 font-medium">
              Overdue: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          ) : (
            <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          )}
        </div>
        {assignee && (
          <div className="flex items-center gap-1">
            <span className="text-xs">Assigned to:</span>
            <span className="font-medium">{assignee.name}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
