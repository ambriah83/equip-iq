
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Wrench, MessageSquare, FileText, Users, Settings, BarChart3, Package, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
}

const Sidebar = ({ activeSection, onSectionChange, userRole }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'owner', 'manager', 'staff'], path: '/' },
    { id: 'ai-chat', label: 'AI Assistant', icon: MessageSquare, roles: ['admin', 'owner', 'manager', 'staff'] },
    { id: 'locations', label: 'Locations', icon: Building2, roles: ['admin', 'owner', 'manager'] },
    { id: 'equipment', label: 'Equipment', icon: Wrench, roles: ['admin', 'owner', 'manager', 'staff'] },
    { id: 'tickets', label: 'Tickets', icon: Ticket, roles: ['admin', 'owner', 'manager', 'staff'], path: '/tickets' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: FileText, roles: ['admin', 'owner', 'manager'] },
    { id: 'vendors', label: 'Vendors', icon: Package, roles: ['admin', 'owner', 'manager'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin', 'owner'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'owner', 'manager'] },
  ];

  const visibleItems = navigationItems.filter(item => item.roles.includes(userRole));

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else {
      onSectionChange(item.id);
    }
  };

  const isItemActive = (item: typeof navigationItems[0]) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return activeSection === item.id;
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 h-screen p-6 border-r border-slate-700">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">EquipIQ</h1>
        <p className="text-slate-400 text-sm">AI-Powered Equipment Management</p>
      </div>
      
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isItemActive(item)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <p className="text-slate-300 text-sm mb-1">Role: {userRole}</p>
          <p className="text-slate-500 text-xs">Logged in as Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
