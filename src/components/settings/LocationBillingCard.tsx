
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, ExternalLink, Loader2, Building, Users, Edit2, Save, X } from 'lucide-react';

interface LocationBillingInfo {
  id: string;
  stripe_payment_method_id: string | null;
  card_last_four: string | null;
  card_brand: string | null;
  billing_name: string | null;
  is_default: boolean;
}

interface LocationBillingCardProps {
  location: {
    id: string;
    name: string;
    ownership_type: string;
  };
}

const LocationBillingCard: React.FC<LocationBillingCardProps> = ({ location }) => {
  const { toast } = useToast();
  const [billingInfo, setBillingInfo] = useState<LocationBillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [billingName, setBillingName] = useState('');

  const loadBillingInfo = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('location_billing')
        .select('*')
        .eq('location_id', location.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setBillingInfo(data);
      setBillingName(data?.billing_name || '');
    } catch (error) {
      console.error('Error loading billing info:', error);
      toast({
        title: "Error",
        description: "Failed to load billing information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupPayment = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('setup-location-payment', {
        body: { 
          location_id: location.id,
          location_name: location.name,
          billing_name: billingName || location.name
        }
      });
      
      if (error) throw error;
      
      // Open Stripe setup in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error setting up payment:', error);
      toast({
        title: "Error",
        description: "Failed to setup payment method.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBillingName = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('location_billing')
        .update({ billing_name: billingName })
        .eq('location_id', location.id);
      
      if (error) throw error;
      
      setBillingInfo(prev => prev ? { ...prev, billing_name: billingName } : null);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Billing name updated successfully.",
      });
    } catch (error) {
      console.error('Error updating billing name:', error);
      toast({
        title: "Error",
        description: "Failed to update billing name.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingInfo();
  }, [location.id]);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {location.ownership_type === 'corporate' ? (
              <Building className="h-5 w-5 text-blue-500" />
            ) : (
              <Users className="h-5 w-5 text-green-500" />
            )}
            <CardTitle className="text-lg">{location.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {location.ownership_type}
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadBillingInfo}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Refresh
          </Button>
        </div>
        <CardDescription>Payment method configuration for this location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Billing Name Section */}
        <div className="space-y-2">
          <Label htmlFor="billing-name">Billing Name</Label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Input
                  id="billing-name"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  placeholder="Enter billing name"
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  onClick={handleUpdateBillingName}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setBillingName(billingInfo?.billing_name || '');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">
                  {billingInfo?.billing_name || location.name}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Payment Method Status */}
        <div className="p-3 border rounded-lg bg-slate-50">
          {billingInfo?.stripe_payment_method_id ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Payment Method Active
                </Badge>
              </div>
              {billingInfo.card_last_four && (
                <p className="text-sm text-gray-600">
                  {billingInfo.card_brand?.toUpperCase()} ending in {billingInfo.card_last_four}
                </p>
              )}
              {billingInfo.is_default && (
                <Badge variant="outline" className="text-xs">
                  Default Payment Method
                </Badge>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant="secondary">No Payment Method</Badge>
              <p className="text-sm text-gray-600">
                Set up a payment method for this location to enable billing.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSetupPayment}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <CreditCard className="h-4 w-4" />
            {billingInfo?.stripe_payment_method_id ? 'Update Payment Method' : 'Setup Payment Method'}
          </Button>
        </div>

        {/* Tech Information */}
        <div className="pt-3 border-t">
          <p className="text-xs text-gray-500">
            <strong>For Technicians:</strong> Use the payment method configured for this specific location when processing equipment-related charges.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationBillingCard;
