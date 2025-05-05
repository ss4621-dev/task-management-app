
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CheckSquare, 
  ListTodo, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      current: location.pathname === "/"
    },
    {
      name: "My Tasks",
      href: "/tasks/my-tasks",
      icon: CheckSquare,
      current: location.pathname === "/tasks/my-tasks"
    },
    {
      name: "All Tasks",
      href: "/tasks",
      icon: ListTodo,
      current: location.pathname === "/tasks"
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      current: location.pathname === "/team"
    }
  ];
  
  const bottomNavigation = [
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings"
    }
  ];

  const NavLink = ({ item }: { item: typeof navigation[0] }) => (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        item.current
          ? "bg-sidebar-accent text-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.name}</span>
    </Link>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar p-4 border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
          T
        </div>
        <h1 className="text-lg font-bold text-sidebar-foreground">TaskFlow</h1>
      </div>

      <div className="space-y-1 mb-8">
        {navigation.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </div>

      <div className="mt-auto space-y-1">
        {bottomNavigation.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
        <Button
          variant="ghost"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
