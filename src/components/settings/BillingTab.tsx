
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const BillingTab = () => {
  const { toast } = useToast();
  
  const [billingInfo, setBillingInfo] = useLocalStorage('billing-info', {
    plan: 'Professional',
    billingEmail: 'billing@company.com',
    cardLast4: '4242',
    nextBilling: '2024-01-15'
  });

  const handleSaveBilling = () => {
    toast({
      title: "Billing Information Updated",
      description: "Your billing information has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Manage your subscription and payment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="plan">Current Plan</Label>
          <Select value={billingInfo.plan} onValueChange={(value) => setBillingInfo({...billingInfo, plan: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basic">Basic - $29/month</SelectItem>
              <SelectItem value="Professional">Professional - $99/month</SelectItem>
              <SelectItem value="Enterprise">Enterprise - $299/month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="billingEmail">Billing Email</Label>
          <Input
            id="billingEmail"
            type="email"
            value={billingInfo.billingEmail}
            onChange={(e) => setBillingInfo({...billingInfo, billingEmail: e.target.value})}
          />
        </div>
        <div>
          <Label>Payment Method</Label>
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <span>**** **** **** {billingInfo.cardLast4}</span>
            <Button variant="outline" size="sm">Update Card</Button>
          </div>
        </div>
        <div>
          <Label>Next Billing Date</Label>
          <p className="text-sm text-gray-600">{billingInfo.nextBilling}</p>
        </div>
        <Button onClick={handleSaveBilling}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
