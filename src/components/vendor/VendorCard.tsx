
import React from 'react';
import { Star, Edit, Phone, MessageSquare, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface Vendor {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  isFirstChoice: boolean;
  rating: number;
  lastContacted: string;
  preferredContact: 'phone' | 'text' | 'email';
  communicationLog: any[];
}

interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onCall: (vendor: Vendor) => void;
  onText: (vendor: Vendor) => void;
  onEmail: (vendor: Vendor) => void;
  onToggleFirstChoice: (id: string) => void;
  renderStars: (rating: number, vendorId?: string, editable?: boolean) => React.ReactNode;
  getPreferredContactIcon: (preferredContact: string) => React.ReactNode;
}

const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onEdit,
  onCall,
  onText,
  onEmail,
  onToggleFirstChoice,
  renderStars,
  getPreferredContactIcon
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      {vendor.isFirstChoice && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-2 right-2 z-10">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Top Choice Vendor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{vendor.name}</CardTitle>
            <Badge variant="outline" className="mb-2">
              {vendor.type}
            </Badge>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(vendor.rating, vendor.id, true)}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-slate-600">Preferred:</span>
              {getPreferredContactIcon(vendor.preferredContact)}
              <span className="text-sm capitalize">{vendor.preferredContact}</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => onEdit(vendor)}>
            <Edit size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-600">Contact</p>
            <p className="text-sm font-medium">{vendor.phone}</p>
            <p className="text-sm text-slate-600">{vendor.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Address</p>
            <p className="text-sm font-medium">{vendor.address}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Notes</p>
            <p className="text-sm">{vendor.notes}</p>
          </div>
          {vendor.communicationLog.length > 0 && (
            <div>
              <p className="text-sm text-slate-600">Recent Contact</p>
              <p className="text-xs text-slate-500">
                {vendor.communicationLog[0].type} on {vendor.communicationLog[0].date}
              </p>
            </div>
          )}
          <div className="pt-2 border-t">
            <p className="text-xs text-slate-500">Last contacted: {vendor.lastContacted}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onCall(vendor)}>
              <Phone size={16} className="mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onText(vendor)}>
              <MessageSquare size={16} className="mr-1" />
              Text
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onEmail(vendor)}>
              <Mail size={16} className="mr-1" />
              Email
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={vendor.isFirstChoice ? "default" : "outline"}
                    onClick={() => onToggleFirstChoice(vendor.id)}
                  >
                    <Star size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{vendor.isFirstChoice ? 'Remove from Top Choice' : 'Make Top Choice'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
