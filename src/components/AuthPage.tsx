
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Recycle, Building2, User, MapPin, Phone } from 'lucide-react';

const AuthPage = () => {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'customer' | 'company';

    const success = await login(email, password, role);
    
    if (!success) {
      setError('Invalid credentials or wrong role selected');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const role = formData.get('role') as 'customer' | 'company';

    const success = await signup(email, password, name, role, phone, address);
    
    if (!success) {
      setError('User already exists with this email');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">EcoWaste</h1>
          <p className="text-white/80">Smart Waste Management Solution</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome
            </CardTitle>
            <CardDescription>Choose your account type and continue</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email"
                      required 
                      className="bg-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      name="password" 
                      type="password" 
                      placeholder="Enter your password"
                      required 
                      className="bg-white/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>I am a:</Label>
                    <RadioGroup name="role" defaultValue="customer" className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-2 border-transparent hover:border-emerald-200 transition-colors">
                        <RadioGroupItem value="customer" id="customer-login" />
                        <Label htmlFor="customer-login" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium">Customer</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border-2 border-transparent hover:border-cyan-200 transition-colors">
                        <RadioGroupItem value="company" id="company-login" />
                        <Label htmlFor="company-login" className="flex items-center gap-2 cursor-pointer">
                          <Building2 className="h-4 w-4 text-cyan-600" />
                          <span className="text-sm font-medium">Company</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-2 transition-all duration-200 hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      name="name" 
                      type="text" 
                      placeholder="Enter your full name"
                      required 
                      className="bg-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email"
                      required 
                      className="bg-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input 
                      id="signup-phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="Enter your phone number"
                      required 
                      className="bg-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <Input 
                      id="signup-address" 
                      name="address" 
                      type="text" 
                      placeholder="Enter your complete address"
                      required 
                      className="bg-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      name="password" 
                      type="password" 
                      placeholder="Create a password"
                      required 
                      className="bg-white/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>I am a:</Label>
                    <RadioGroup name="role" defaultValue="customer" className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-2 border-transparent hover:border-emerald-200 transition-colors">
                        <RadioGroupItem value="customer" id="customer-signup" />
                        <Label htmlFor="customer-signup" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium">Customer</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border-2 border-transparent hover:border-cyan-200 transition-colors">
                        <RadioGroupItem value="company" id="company-signup" />
                        <Label htmlFor="company-signup" className="flex items-center gap-2 cursor-pointer">
                          <Building2 className="h-4 w-4 text-cyan-600" />
                          <span className="text-sm font-medium">Company</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 transition-all duration-200 hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
