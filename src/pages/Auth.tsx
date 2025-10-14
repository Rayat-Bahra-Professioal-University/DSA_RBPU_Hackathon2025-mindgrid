import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Lock, Mail, User, Shield } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
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
        await signup(formData.email, formData.password, formData.name, formData.adminCode);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 card-elevated">
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

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('adminCode')}
              </Label>
              <Input
                id="adminCode"
                type="text"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                className="text-lg h-14"
                placeholder={t('adminCodeHint')}
              />
              <p className="text-sm text-muted-foreground">{t('adminCodeHint')}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full btn-large"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignup ? t('signup') : t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-lg text-muted-foreground">
            {isSignup ? t('alreadyHaveAccount') : t('dontHaveAccount')}
          </p>
          <Button
            variant="link"
            onClick={() => setIsSignup(!isSignup)}
            className="text-lg"
          >
            {isSignup ? t('login') : t('signup')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
