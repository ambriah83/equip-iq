
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, ExternalLink, Loader2 } from 'lucide-react';

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

const BillingTab = () => {
  const { toast } = useToast();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const plans = [
    { id: 'basic', name: 'Basic', price: '$29/month', description: 'Essential features for small operations' },
    { id: 'professional', name: 'Professional', price: '$99/month', description: 'Advanced features for growing businesses' },
    { id: 'enterprise', name: 'Enterprise', price: '$299/month', description: 'Full-featured solution for large organizations' }
  ];

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionInfo(data);
      toast({
        title: "Subscription Status Updated",
        description: "Your subscription information has been refreshed.",
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan }
      });
      
      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>Manage your subscription and billing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Subscription Status */}
        <div className="p-4 border rounded-lg bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Current Subscription</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSubscription}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Refresh Status
            </Button>
          </div>
          
          {subscriptionInfo.subscribed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
                <span className="font-medium capitalize">
                  {subscriptionInfo.subscription_tier} Plan
                </span>
              </div>
              {subscriptionInfo.subscription_end && (
                <p className="text-sm text-gray-600">
                  Renews on {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
                </p>
              )}
              <Button 
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="mt-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant="secondary">No Active Subscription</Badge>
              <p className="text-sm text-gray-600">
                Subscribe to unlock premium features and support.
              </p>
            </div>
          )}
        </div>

        {/* Plan Selection */}
        {!subscriptionInfo.subscribed && (
          <div>
            <Label htmlFor="plan">Select Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {plan.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">
              {plans.find(p => p.id === selectedPlan)?.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!subscriptionInfo.subscribed ? (
            <Button 
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <CreditCard className="h-4 w-4" />
              Subscribe Now
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <CreditCard className="h-4 w-4" />
              Change Plan
            </Button>
          )}
        </div>

        {/* Available Plans Display */}
        <div>
          <h3 className="font-medium mb-3">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`p-4 border rounded-lg ${
                  subscriptionInfo.subscription_tier === plan.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{plan.name}</h4>
                  {subscriptionInfo.subscription_tier === plan.id && (
                    <Badge className="bg-blue-500">Current</Badge>
                  )}
                </div>
                <p className="text-lg font-bold text-blue-600 mb-1">{plan.price}</p>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
