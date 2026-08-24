import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/authContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Building2, Store, User } from 'lucide-react';

export function Login() {
  const { loginAsRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  const handleLogin = (role: 'company' | 'distributor' | 'partner') => {
    loginAsRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Kiosk Management Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full justify-start h-14 text-base" 
            variant="outline"
            onClick={() => handleLogin('company')}
          >
            <Building2 className="mr-4 h-5 w-5 text-indigo-600" />
            Continue as Company
          </Button>
          
          <Button 
            className="w-full justify-start h-14 text-base" 
            variant="outline"
            onClick={() => handleLogin('distributor')}
          >
            <Store className="mr-4 h-5 w-5 text-emerald-600" />
            Continue as Distributor
          </Button>

          <Button 
            className="w-full justify-start h-14 text-base" 
            variant="outline"
            onClick={() => handleLogin('partner')}
          >
            <User className="mr-4 h-5 w-5 text-amber-600" />
            Continue as Partner
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
