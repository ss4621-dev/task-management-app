
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user) return null;
  
  const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase();
  
  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge 
                variant="outline" 
                className={
                  user.role === 'admin'
                    ? "bg-purple-100 text-purple-800 mt-2"
                    : user.role === 'manager'
                    ? "bg-blue-100 text-blue-800 mt-2"
                    : "bg-gray-100 text-gray-800 mt-2"
                }
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            
            <div className="w-full space-y-2 pt-4">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-destructive hover:text-destructive"
              onClick={logout}
            >
              Log Out
            </Button>
          </CardFooter>
        </Card>
        
        {/* Notification Preferences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Task Assignments</h4>
                  <p className="text-sm text-muted-foreground">
                    When you are assigned to a new task
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="task-assignments"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Task Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    When a task you created is updated
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="task-updates"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Task Completions</h4>
                  <p className="text-sm text-muted-foreground">
                    When tasks are marked as completed
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="task-completions"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Due Date Reminders</h4>
                  <p className="text-sm text-muted-foreground">
                    Reminder about upcoming task deadlines
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="due-date-reminders"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Team Member Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    When team members join or leave
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="team-member-updates"
                    defaultChecked={false}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
