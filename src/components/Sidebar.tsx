
import React from 'react';
import { Building2, Wrench, MessageSquare, FileText, Users, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
}

const Sidebar = ({ activeSection, onSectionChange, userRole }: SidebarProps) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'owner', 'manager', 'staff'] },
    { id: 'ai-chat', label: 'AI Assistant', icon: MessageSquare, roles: ['admin', 'owner', 'manager', 'staff'] },
    { id: 'locations', label: 'Locations', icon: Building2, roles: ['admin', 'owner', 'manager'] },
    { id: 'equipment', label: 'Equipment', icon: Wrench, roles: ['admin', 'owner', 'manager', 'staff'] },
    { id: 'documents', label: 'Documents', icon: FileText, roles: ['admin', 'owner', 'manager'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin', 'owner'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'owner', 'manager'] },
  ];

  const visibleItems = navigationItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 h-screen p-6 border-r border-slate-700">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Operations Hub</h1>
        <p className="text-slate-400 text-sm">AI-Powered Support</p>
      </div>
      
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                activeSection === item.id
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
