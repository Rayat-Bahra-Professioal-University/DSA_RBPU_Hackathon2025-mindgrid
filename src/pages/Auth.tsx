import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Lock, Mail, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
  adminCode: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const isAdminMode = searchParams.get('admin') === 'true';
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: ''
  });

  const { t } = useTranslation();
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const validation = signupSchema.safeParse(formData);
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }
        
        await signup(formData.email.trim(), formData.password, formData.name.trim(), formData.adminCode);
      } else {
        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }
        
        await login(formData.email.trim(), formData.password);
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.code || 'An error occurred';
      if (errorMessage.includes('invalid-credential')) {
        toast.error(isSignup ? 'Failed to create account. Please try again.' : 'Invalid email or password');
      } else if (errorMessage.includes('email-already-in-use')) {
        toast.error('Email already in use. Please login instead.');
      } else if (errorMessage.includes('weak-password')) {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else {
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md p-8 card-elevated transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isSignup ? t('signupTitle') : t('loginTitle')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('name')}
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-lg h-14"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="text-lg h-14"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {t('password')}
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="text-lg h-14"
            />
          </div>

          {isSignup && isAdminMode && (
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                {t('adminCode')}
              </Label>
              <Input
                id="adminCode"
                type="password"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                className="text-lg h-14"
                placeholder={t('adminCodeHint')}
                required
              />
              <p className="text-sm text-amber-500 font-medium">{t('adminCodeHint')}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full btn-large transition-all duration-200 hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : isSignup ? t('signup') : t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-lg text-muted-foreground">
            {isSignup ? t('alreadyHaveAccount') : t('dontHaveAccount')}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSignup(!isSignup);
              setFormData({ name: '', email: '', password: '', adminCode: '' });
            }}
            className="text-lg w-full h-12 transition-all duration-200 hover:scale-[1.02]"
            type="button"
          >
            {isSignup ? t('login') : t('signup')}
          </Button>
          
          {isSignup && !isAdminMode && (
            <div className="pt-4 border-t border-border mt-4">
              <Button
                variant="link"
                onClick={() => navigate('/auth?mode=signup&admin=true')}
                className="text-sm text-muted-foreground hover:text-amber-500"
                type="button"
              >
                🔐 Admin Registration
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
