import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Wrench, 
  MapPin, 
  TicketIcon, 
  Sparkles, 
  Settings, 
  LogOut 
} from '../../lib/icons';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { name: 'Equipment', icon: Wrench, path: '/app/equipment' },
    { name: 'Locations', icon: MapPin, path: '/app/locations' },
    { name: 'Tickets', icon: TicketIcon, path: '/app/tickets' },
    { name: 'AI Chat', icon: Sparkles, path: '/app/ai' },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link 
        to={item.path} 
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
          isActive 
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-slate-50 dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col h-screen p-4 flex-shrink-0">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <Sparkles className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EquipIQ</h1>
      </div>
      
      <nav className="flex-grow space-y-1">
        {navItems.map(item => (
          <NavLink key={item.name} item={item} />
        ))}
      </nav>
      
      <div className="space-y-1">
        <Link 
          to="/app/settings" 
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
            location.pathname === '/app/settings'
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        
        <button 
          onClick={() => logout()} 
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;