
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PermissionsManager } from '@/components/permissions';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}

const PermissionsTab = () => {
  const [users] = useState<User[]>([
    { 
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
      name: 'John Doe', 
      email: 'john@company.com', 
      role: 'admin', 
      status: 'active' 
    },
    { 
      id: 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 
      name: 'Jane Smith', 
      email: 'jane@company.com', 
      role: 'manager', 
      status: 'active' 
    },
    { 
      id: 'c2aaee99-9c0b-4ef8-bb6d-6bb9bd380a33', 
      name: 'Bob Wilson', 
      email: 'bob@company.com', 
      role: 'staff', 
      status: 'inactive' 
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Management</CardTitle>
        <CardDescription>
          Manage escalation permissions for safety-critical tasks by user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users.map((user) => (
            <PermissionsManager
              key={user.id}
              userId={user.id}
              userRole={user.role as UserRole}
              userName={user.name}
              isCurrentUser={user.email === 'user@company.com'} // This would come from actual auth
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
