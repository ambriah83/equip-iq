
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  keepSignedIn: boolean;
  setKeepSignedIn: (keep: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  keepSignedIn,
  setKeepSignedIn,
  loading,
  onSubmit
}: SignInFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="signin-email" className="text-slate-200">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="signin-password" className="text-slate-200">Password</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-700 border-slate-600 text-white pr-10"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="keep-signed-in"
          checked={keepSignedIn}
          onCheckedChange={(checked) => setKeepSignedIn(checked === true)}
        />
        <Label htmlFor="keep-signed-in" className="text-slate-200 text-sm">
          Keep me signed in
        </Label>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default SignInForm;
