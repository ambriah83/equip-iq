
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface PermissionBadgeProps {
  permission: EscalationPermission;
  isAllowed: boolean;
  isCustom?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const permissionLabels: Record<EscalationPermission, string> = {
  can_use_ladder: 'Ladder Use',
  can_handle_electrical: 'Electrical Work',
  can_disassemble_parts: 'Disassembly',
  can_work_at_height: 'Height Work',
  can_handle_chemicals: 'Chemical Handling',
  can_operate_heavy_equipment: 'Heavy Equipment',
  can_access_restricted_areas: 'Restricted Access',
  can_perform_emergency_shutdowns: 'Emergency Shutdowns'
};

const PermissionBadge: React.FC<PermissionBadgeProps> = ({
  permission,
  isAllowed,
  isCustom = false,
  size = 'md'
}) => {
  const label = permissionLabels[permission];
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <Badge
      variant={isAllowed ? 'default' : 'secondary'}
      className={`
        flex items-center gap-1
        ${size === 'sm' ? 'text-xs px-2 py-1' : ''}
        ${size === 'lg' ? 'text-sm px-3 py-2' : ''}
        ${isAllowed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
        ${isCustom ? 'ring-2 ring-blue-200' : ''}
      `}
    >
      {isAllowed ? (
        <ShieldCheck size={iconSize} />
      ) : (
        <ShieldX size={iconSize} />
      )}
      {label}
      {isCustom && <Shield size={iconSize} className="text-blue-600" />}
    </Badge>
  );
};

export default PermissionBadge;
