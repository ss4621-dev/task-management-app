
import React from 'react';
import { format } from 'date-fns';
import { Task, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TaskDetailProps {
  task: Task;
  creator?: User;
  assignee?: User;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, creator, assignee }) => {
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <Badge variant="outline" className={statusColors[task.status]}>
            {statusLabels[task.status]}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
          <p className={isOverdue ? "text-red-500 font-medium" : ""}>
            {format(new Date(task.dueDate), 'MMMM d, yyyy')}
            {isOverdue && " (Overdue)"}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
          <p>{format(new Date(task.createdAt), 'MMMM d, yyyy')}</p>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
        <p className="whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
      </div>
      
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {creator && (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
              <p>{creator.name}</p>
            </div>
          </div>
        )}
        
        {assignee && (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
              <p>{assignee.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
