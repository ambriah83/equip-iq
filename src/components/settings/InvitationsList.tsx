
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, CheckCircle, XCircle, RefreshCw, MapPin } from 'lucide-react';
import { UserInvitation } from '@/hooks/useUserInvitations';
import { useLocations } from '@/hooks/useLocations';

interface InvitationsListProps {
  invitations: UserInvitation[];
  onCancel: (id: string) => void;
  onResend: (invitation: UserInvitation) => void;
  loading: boolean;
}

const InvitationsList: React.FC<InvitationsListProps> = ({
  invitations,
  onCancel,
  onResend,
  loading
}) => {
  const { locations } = useLocations();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock size={12} className="mr-1" />
          Pending
        </Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle size={12} className="mr-1" />
          Accepted
        </Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle size={12} className="mr-1" />
          Expired
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <XCircle size={12} className="mr-1" />
          Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLocationNames = (locationIds: string[] = []) => {
    if (!locationIds.length) return 'All locations';
    
    return locationIds
      .map(id => locations.find(loc => loc.id === id)?.name || 'Unknown')
      .join(', ');
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading invitations...</div>
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Invitations</CardTitle>
          <CardDescription>No invitations have been sent yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Invitations</CardTitle>
        <CardDescription>Manage pending and sent invitations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{invitation.email}</h3>
                  <p className="text-sm text-gray-500">
                    Role: {invitation.role} • Sent {new Date(invitation.created_at).toLocaleDateString()}
                    {isExpired(invitation.expires_at) && invitation.status === 'pending' && 
                      <span className="text-red-500"> • Expired</span>
                    }
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusBadge(invitation.status)}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>{getLocationNames(invitation.location_access)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {invitation.status === 'pending' && !isExpired(invitation.expires_at) && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResend(invitation)}
                    >
                      <RefreshCw size={16} className="mr-1" />
                      Resend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancel(invitation.id)}
                    >
                      <XCircle size={16} className="mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
                {(invitation.status === 'pending' && isExpired(invitation.expires_at)) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResend(invitation)}
                  >
                    <RefreshCw size={16} className="mr-1" />
                    Resend
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationsList;
