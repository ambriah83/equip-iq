import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Brain, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AIEffectivenessModal from '@/components/AIEffectivenessModal';

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const [aiEffectiveness, setAiEffectiveness] = useState(0);
  const [showEffectivenessModal, setShowEffectivenessModal] = useState(false);

  useEffect(() => {
    // Calculate AI effectiveness from stored feedback
    const feedback = JSON.parse(localStorage.getItem('aiFeedback') || '[]');
    if (feedback.length > 0) {
      const resolved = feedback.filter((f: any) => f.wasSolved).length;
      setAiEffectiveness(Math.round((resolved / feedback.length) * 100));
    }
  }, []);

  const stats = [
    { title: 'Active Equipment', value: '127', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Pending Issues', value: '8', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Response Time', value: '3.2m', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { 
      title: 'AI Effectiveness', 
      value: `${aiEffectiveness}%`, 
      icon: Brain, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      onClick: () => setShowEffectivenessModal(true)
    },
  ];

  const recentActivity = [
    { type: 'Resolved', item: 'Tanning Bed #3 - Location A', time: '2 minutes ago', status: 'success' },
    { type: 'New Issue', item: 'HVAC System - Location B', time: '15 minutes ago', status: 'warning' },
    { type: 'Escalated', item: 'Water Heater - Location C', time: '1 hour ago', status: 'error' },
    { type: 'Resolved', item: 'Light Therapy Unit #2 - Location A', time: '2 hours ago', status: 'success' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-2">Operations Dashboard</h1>
        <p className="text-blue-100">Real-time overview of your equipment and support operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-shadow ${stat.onClick ? 'cursor-pointer' : ''}`}
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg} relative`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                    {stat.onClick && (
                      <Eye className="h-3 w-3 text-slate-400 absolute -bottom-1 -right-1" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-slate-900">{activity.type}</p>
                      <p className="text-sm text-slate-600">{activity.item}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onSectionChange('ai-chat')}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-blue-900">Start AI Chat</div>
                <div className="text-sm text-blue-600">Get instant help</div>
              </button>
              <button 
                onClick={() => onSectionChange('equipment')}
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-green-900">Add Equipment</div>
                <div className="text-sm text-green-600">Register new device</div>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors cursor-pointer">
                <div className="font-medium text-purple-900">View Reports</div>
                <div className="text-sm text-purple-600">Analytics dashboard</div>
              </button>
              <button 
                onClick={() => onSectionChange('users')}
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-orange-900">Manage Users</div>
                <div className="text-sm text-orange-600">Team permissions</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIEffectivenessModal 
        isOpen={showEffectivenessModal}
        onClose={() => setShowEffectivenessModal(false)}
      />
    </div>
  );
};

export default Dashboard;