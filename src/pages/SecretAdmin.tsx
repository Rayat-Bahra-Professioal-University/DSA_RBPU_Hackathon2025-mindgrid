import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Shield, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SecretAdmin() {
  const { t } = useTranslation();
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in as admin
  if (user && userData?.role === 'admin') {
    navigate('/admin');
    return null;
  }

  // Redirect if logged in as user
  if (user && userData?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check secret code first
    if (secretCode !== 'CITYCARE_ADMIN_2025') {
      toast.error('Invalid access code');
      return;
    }
    
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      toast.success(t('adminLoginSuccessful'));
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error(t('adminAccountNotFound'));
      } else if (error.code === 'auth/wrong-password') {
        toast.error(t('incorrectPassword'));
      } else if (error.code === 'auth/invalid-email') {
        toast.error(t('invalidEmailAddress'));
      } else {
        toast.error(t('loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background indian-flag-bg-subtle flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="card-gradient p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold mb-2 text-gradient"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Secure Admin Access
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Authorized personnel only
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Secret Code Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Label htmlFor="secretCode" className="text-base font-semibold">
                Access Code
              </Label>
              <Input
                id="secretCode"
                type="password"
                required
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300 mt-2"
                placeholder="Enter access code"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Label htmlFor="email" className="text-base font-semibold">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300 mt-2"
                placeholder="admin@citycare.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Label htmlFor="password" className="text-base font-semibold">
                {t('password')}
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300 pr-12"
                  placeholder={t('enterYourPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-4"
            >
              <Button 
                type="submit" 
                className="w-full btn-large shadow-2xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('signingInAdmin')}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    Secure Login
                  </div>
                )}
              </Button>

              <Button 
                type="button"
                variant="outline" 
                className="w-full btn-large border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t('backToHome')}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Restricted Access</p>
                <p>This area is restricted to authorized CityCare administrators only. Unauthorized access is prohibited.</p>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
