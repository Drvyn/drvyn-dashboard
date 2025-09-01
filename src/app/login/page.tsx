"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from 'lucide-react';
import { authApi, setAuthToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleLogin() {
    setError('');
    setLoading(true);
    
    try {
      console.log('🔐 Attempting login with backend API...');
      const response = await authApi.login(username, password);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }
      
      const token = response.data.access_token;
      if (!token) {
        throw new Error('No token returned from server');
      }
      
      console.log('✅ Login successful, token received');
      setAuthToken(token);
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (e: any) {
      console.error('❌ Login failed:', e);
      setError(e?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex items-center gap-2 justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-md">
                <Car className="h-6 w-6 text-primary"/>
              </div>
              <h1 className="text-2xl font-bold text-primary">Drvyn</h1>
            </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleLogin} type="button" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
