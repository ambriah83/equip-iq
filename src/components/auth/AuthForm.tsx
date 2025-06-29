
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

interface AuthFormProps {
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
  keepSignedIn: boolean;
  setKeepSignedIn: (keep: boolean) => void;
  loading: boolean;
  onSignUp: (e: React.FormEvent) => void;
  onSignIn: (e: React.FormEvent) => void;
}

const AuthForm = ({
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
  keepSignedIn,
  setKeepSignedIn,
  loading,
  onSignUp,
  onSignIn
}: AuthFormProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-center">Welcome</CardTitle>
        <CardDescription className="text-slate-400 text-center">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup">Start Free Trial</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              companyName={companyName}
              setCompanyName={setCompanyName}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={onSignUp}
            />
          </TabsContent>

          <TabsContent value="signin">
            <SignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              keepSignedIn={keepSignedIn}
              setKeepSignedIn={setKeepSignedIn}
              loading={loading}
              onSubmit={onSignIn}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
