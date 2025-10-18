import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Lock, Mail, User, ArrowRight, CheckCircle, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long')
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { t } = useTranslation();
  const { signup, login, authLoading } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use authLoading from context instead of local loading state
    if (authLoading) return;
    
    setLoading(true);

    try {
      if (isSignup) {
        const validation = signupSchema.safeParse(formData);
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }
        
        await signup(formData.email.trim(), formData.password, formData.name.trim());
        setSignupSuccess(true);
        toast.success('Account created successfully! Please login to continue.');
        // Auto-switch to login after successful signup
        setTimeout(() => {
          setIsSignup(false);
          setFormData({ name: '', email: formData.email, password: '' });
        }, 2000);
      } else {
        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }
        
        await login(formData.email.trim(), formData.password);
        // Navigation will be handled by AuthContext
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.code || 'An error occurred';
      if (errorMessage.includes('invalid-credential')) {
        toast.error(isSignup ? 'Failed to create account. Please try again.' : 'Invalid email or password');
      } else if (errorMessage.includes('email-already-in-use')) {
        toast.error('Email already in use. Please login instead.');
        // Auto-switch to login if email already exists
        setTimeout(() => {
          setIsSignup(false);
          setFormData({ name: '', email: formData.email, password: '' });
        }, 2000);
      } else if (errorMessage.includes('weak-password')) {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else {
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <Card className="card-gradient p-6 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gradient">
              {isSignup ? t('createCitizenAccount') : t('citizenLogin')}
            </h1>
            <p className="text-base text-muted-foreground">
              {isSignup ? t('joinUsToReport') : t('signInToReport')}
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {signupSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success font-medium">{t('accountCreated')}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Buttons */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setIsSignup(false);
                setFormData({ name: '', email: '', password: '' });
                setSignupSuccess(false);
              }}
              className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all duration-300 ${
                !isSignup 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => {
                setIsSignup(true);
                setFormData({ name: '', email: '', password: '' });
                setSignupSuccess(false);
              }}
              className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all duration-300 ${
                isSignup 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('signup')}
            </button>
        </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? 'signup' : 'login'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
          {isSignup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    {t('fullName')}
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300"
                    placeholder={t('enterYourFullName')}
              />
                </motion.div>
          )}

          <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                    <Mail className="w-3 h-3 text-primary" />
                  </div>
                  {t('emailAddress')}
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300"
                  placeholder={t('enterYourEmail')}
            />
          </div>

          <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                    <Lock className="w-3 h-3 text-primary" />
                  </div>
                  {t('password')}
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300"
                  placeholder={t('enterYourPassword')}
            />
          </div>

          <Button 
            type="submit" 
                className="w-full h-12 shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || authLoading}
          >
            {(loading || authLoading) ? (
              <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isSignup ? t('creatingAccount') : t('signingIn')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isSignup ? t('createAccount') : t('signIn')}
                    <ArrowRight className="w-4 h-4" />
              </div>
                )}
          </Button>
            </motion.form>
          </AnimatePresence>

          {/* Admin Login Link - REMOVED for security */}

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-4"
          >
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </Button>
          </motion.div>

      </Card>
      </motion.div>
    </div>
  );
}
