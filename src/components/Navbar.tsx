import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">PW</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground">Pothole Watch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link to="/about" className="text-lg font-medium hover:text-primary transition-colors">
              {t('about')}
            </Link>
            <Link to="/map" className="text-lg font-medium hover:text-primary transition-colors">
              {t('viewMap')}
            </Link>
            
            {user && (
              <Link to={userData?.role === 'admin' ? '/admin' : '/dashboard'} className="text-lg font-medium hover:text-primary transition-colors">
                {t('dashboard')}
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="w-5 h-5" />
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </Button>

            {user ? (
              <Button onClick={handleLogout} size="lg" variant="outline">
                {t('logout')}
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/auth')} size="lg" variant="outline">
                  {t('login')}
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')} size="lg">
                  {t('signup')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link to="/about" className="block text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('about')}
            </Link>
            <Link to="/map" className="block text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('viewMap')}
            </Link>
            
            {user && (
              <Link 
                to={userData?.role === 'admin' ? '/admin' : '/dashboard'} 
                className="block text-lg font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dashboard')}
              </Link>
            )}

            <Button
              variant="ghost"
              size="lg"
              onClick={toggleLanguage}
              className="w-full justify-start gap-2"
            >
              <Globe className="w-5 h-5" />
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </Button>

            {user ? (
              <Button onClick={handleLogout} size="lg" variant="outline" className="w-full">
                {t('logout')}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button onClick={() => navigate('/auth')} size="lg" variant="outline" className="w-full">
                  {t('login')}
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')} size="lg" className="w-full">
                  {t('signup')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
