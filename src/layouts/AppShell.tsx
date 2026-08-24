import React from 'react';
import BannerNoBg from "../assets/BannerNoBg.png";
import { useAuth } from '../app/authContext';
import { LogOut, Bell, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/utils';
import { useNotification } from '../mock/notificationContext';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface AppShellProps {
  navigation: NavItem[];
  title: string;
  children: React.ReactNode;
}

export function AppShell({ navigation, title, children }: AppShellProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { notifications, markAsRead } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  const myNotifications = notifications.filter(n => n.recipientId === user?.id || n.recipientId === user?.role);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-10">
        <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800">
  <div className="flex flex-col items-start">
    <img
      src={BannerNoBg}
      alt="Kiosk Manager"
      className="h-auto w-44 object-contain mb-3"
    />

    <div>
      <p className="text-white font-bold text-lg leading-tight">
        Kiosk Manager
      </p>

      <p className="text-slate-4500 text-base font-medium mt-1">
        {title} Admin
      </p>
    </div>
  </div>
</div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </div>
          <nav className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {item.icon && (
                    <span className="mr-3 flex-shrink-0 h-5 w-5">
                      {item.icon}
                    </span>
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-slate-300" />
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-900 capitalize">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="text-slate-400 hover:text-slate-500 relative focus:outline-none"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-md">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {myNotifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                    ) : (
                      myNotifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                            !notification.isRead ? "bg-indigo-50/50" : ""
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm text-slate-900">{notification.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <button 
              onClick={logout}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
