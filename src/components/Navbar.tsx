import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Globe, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'hi' : currentLang === 'hi' ? 'pa' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-bold text-primary-foreground">CC</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              CityCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-base font-semibold hover:text-primary transition-all duration-300 hover:scale-105 relative group">
              {t('home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-base font-semibold hover:text-primary transition-all duration-300 hover:scale-105 relative group">
              {t('about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {user && (
              <Link to={userData?.role === 'admin' ? '/admin' : '/dashboard'} className="text-base font-semibold hover:text-primary transition-all duration-300 hover:scale-105 relative group">
                {t('dashboard')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleLanguage}
              className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              {i18n.language === 'en' ? 'हिंदी' : i18n.language === 'hi' ? 'ਪੰਜਾਬੀ' : 'English'}
            </Button>

            {/* Admin Login Button - REMOVED for security */}

            {user && (
              <Button 
                onClick={handleLogout} 
                size="lg" 
                variant="outline"
                className="border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300 hover:scale-105"
              >
                {t('logout')}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-primary/10 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 bg-card/50 backdrop-blur-sm rounded-2xl mt-4 border border-border/50">
            <Link 
              to="/" 
              className="block text-base font-semibold py-3 px-4 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 hover:scale-105" 
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link 
              to="/about" 
              className="block text-base font-semibold py-3 px-4 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 hover:scale-105" 
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about')}
            </Link>
            
            {user && (
              <Link 
                to={userData?.role === 'admin' ? '/admin' : '/dashboard'} 
                className="block text-base font-semibold py-3 px-4 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dashboard')}
              </Link>
            )}

            <div className="pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleLanguage}
                className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                {i18n.language === 'en' ? 'हिंदी' : i18n.language === 'hi' ? 'ਪੰਜਾਬੀ' : 'English'}
              </Button>

              {/* Admin Login Button - REMOVED for security */}

              {user && (
                <Button 
                  onClick={handleLogout} 
                  size="lg" 
                  variant="outline" 
                  className="w-full mt-3 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
                >
                  {t('logout')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
