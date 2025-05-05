
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Navigate } from 'react-router-dom';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const Team: React.FC = () => {
  const { user, users, isAuthenticated } = useAuth();
  const { getTasksByAssignee } = useTasks();
  
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user) return null;
  
  const userTasks = selectedMember 
    ? getTasksByAssignee(selectedMember.id)
    : [];
    
  const todoTasksCount = userTasks.filter(t => t.status === 'todo').length;
  const inProgressTasksCount = userTasks.filter(t => t.status === 'in-progress').length;
  const reviewTasksCount = userTasks.filter(t => t.status === 'review').length;
  const completedTasksCount = userTasks.filter(t => t.status === 'completed').length;
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">View your team members and their workload</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((member) => {
          const memberTasks = getTasksByAssignee(member.id);
          const activeTasks = memberTasks.filter(t => t.status !== 'completed').length;
          const completedTasks = memberTasks.filter(t => t.status === 'completed').length;
          
          const initials = member.name
            .split(" ")
            .map(name => name[0])
            .join("")
            .toUpperCase();
            
          return (
            <Card 
              key={member.id} 
              className={cn(
                "cursor-pointer transition hover:shadow-md",
                member.id === user.id && "border-primary/50"
              )}
              onClick={() => setSelectedMember(member)}
            >
              <CardHeader className="flex flex-row items-start space-y-0 gap-4 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {member.name}
                    {member.id === user.id && (
                      <span className="ml-2 text-xs align-middle text-muted-foreground">(You)</span>
                    )}
                  </CardTitle>
                  <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Active Tasks</p>
                    <p className="font-medium text-lg">{activeTasks}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Completed</p>
                    <p className="font-medium text-lg">{completedTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
            <DialogDescription>
              View details and task statistics
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>
                    {selectedMember.name
                      .split(" ")
                      .map(name => name[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <Badge variant="outline" className={getRoleBadgeColor(selectedMember.role)}>
                    {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Task Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">To Do</p>
                    <p className="text-xl font-medium">{todoTasksCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">In Progress</p>
                    <p className="text-xl font-medium">{inProgressTasksCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Review</p>
                    <p className="text-xl font-medium">{reviewTasksCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Completed</p>
                    <p className="text-xl font-medium">{completedTasksCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setSelectedMember(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
