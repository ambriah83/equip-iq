
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  companyName,
  setCompanyName,
  showPassword,
  setShowPassword,
  loading,
  onSubmit
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name" className="text-slate-200">First Name</Label>
          <Input
            id="first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="last-name" className="text-slate-200">Last Name</Label>
          <Input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Doe"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="company-name" className="text-slate-200">Company Name</Label>
        <Input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Your Company"
        />
      </div>
      <div>
        <Label htmlFor="signup-email" className="text-slate-200">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="signup-password" className="text-slate-200">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-700 border-slate-600 text-white pr-10"
            placeholder="8+ chars, 1 uppercase, 1 special char"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Must be 8+ characters with uppercase letter and special character
        </p>
      </div>
      <div>
        <Label htmlFor="confirm-password" className="text-slate-200">Confirm Password</Label>
        <Input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Confirm your password"
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? 'Creating Account...' : 'Start Free Trial'}
      </Button>
      <p className="text-xs text-slate-400 text-center">
        Free 14-day trial • No credit card required
      </p>
    </form>
  );
};

export default SignUpForm;
