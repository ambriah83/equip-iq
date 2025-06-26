
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Phone number formatting utility
const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  return value;
};

const PersonalInfoTab = () => {
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useLocalStorage('personal-info', {
    firstName: 'Current',
    lastName: 'User',
    email: 'user@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Operations Hub Inc.',
    position: 'Operations Manager'
  });

  const handleSavePersonalInfo = () => {
    toast({
      title: "Personal Information Updated",
      description: "Your personal information has been saved successfully.",
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPersonalInfo({ ...personalInfo, phone: formatted });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={handlePhoneChange}
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={personalInfo.company}
            onChange={(e) => setPersonalInfo({...personalInfo, company: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={personalInfo.position}
            onChange={(e) => setPersonalInfo({...personalInfo, position: e.target.value})}
          />
        </div>
        <Button onClick={handleSavePersonalInfo}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;
