
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, ExternalLink, Loader2, Building, Users } from 'lucide-react';

interface OwnerBillingInfo {
  id: string;
  stripe_customer_id: string | null;
  subscription_active: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  billing_email: string | null;
  company_name: string | null;
}

interface LocationInfo {
  id: string;
  name: string;
  ownership_type: string;
}

const OwnerBillingTab = () => {
  const { toast } = useToast();
  const [billingInfo, setBillingInfo] = useState<OwnerBillingInfo | null>(null);
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBillingInfo = async () => {
    try {
      setIsLoading(true);
      
      // Get current user's billing info
      const { data: billing, error: billingError } = await supabase
        .from('owner_billing')
        .select('*')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (billingError && billingError.code !== 'PGRST116') {
        throw billingError;
      }

      setBillingInfo(billing);

      // Get locations owned by this user
      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .select('id, name, ownership_type')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);

      if (locationError) throw locationError;
      
      setLocations(locationData || []);
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

  const handleSetupBilling = async () => {
    try {
      setIsLoading(true);
      
      // Create billing setup session
      const { data, error } = await supabase.functions.invoke('setup-owner-billing', {
        body: { 
          locations: locations.map(loc => ({ id: loc.id, name: loc.name }))
        }
      });
      
      if (error) throw error;
      
      // Open Stripe setup in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error setting up billing:', error);
      toast({
        title: "Error",
        description: "Failed to setup billing.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('owner-portal');
      
      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast({
        title: "Error",
        description: "Failed to open billing portal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const corporateLocations = locations.filter(loc => loc.ownership_type === 'corporate');
  const franchiseLocations = locations.filter(loc => loc.ownership_type === 'franchise');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner Billing & Locations</CardTitle>
        <CardDescription>Manage your billing and location ownership</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Corporate Locations</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">{corporateLocations.length}</p>
            <p className="text-sm text-blue-700">Company-owned locations</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">Franchise Locations</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">{franchiseLocations.length}</p>
            <p className="text-sm text-green-700">Franchise-owned locations</p>
          </div>
        </div>

        {/* Billing Status */}
        <div className="p-4 border rounded-lg bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Billing Status</h3>
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
          
          {billingInfo ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={billingInfo.subscription_active ? "default" : "secondary"}
                  className={billingInfo.subscription_active ? "bg-green-100 text-green-800" : ""}
                >
                  {billingInfo.subscription_active ? 'Active Subscription' : 'No Active Subscription'}
                </Badge>
                {billingInfo.subscription_tier && (
                  <Badge variant="outline" className="capitalize">
                    {billingInfo.subscription_tier} Plan
                  </Badge>
                )}
              </div>
              
              {billingInfo.subscription_end && (
                <p className="text-sm text-gray-600">
                  {billingInfo.subscription_active ? 'Renews' : 'Expired'} on {new Date(billingInfo.subscription_end).toLocaleDateString()}
                </p>
              )}
              
              {billingInfo.company_name && (
                <p className="text-sm text-gray-600">
                  Company: {billingInfo.company_name}
                </p>
              )}
              
              <Button 
                onClick={handleManageBilling}
                disabled={isLoading}
                className="mt-3"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                No billing information found. Set up billing to manage subscriptions for your locations.
              </p>
              <Button 
                onClick={handleSetupBilling}
                disabled={isLoading || locations.length === 0}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <CreditCard className="h-4 w-4 mr-2" />
                Setup Billing
              </Button>
              {locations.length === 0 && (
                <p className="text-xs text-amber-600">
                  You need to own at least one location to set up billing.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Location List */}
        {locations.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Your Locations</h3>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {location.ownership_type === 'corporate' ? (
                        <Building className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Users className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-medium">{location.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {location.ownership_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerBillingTab;
