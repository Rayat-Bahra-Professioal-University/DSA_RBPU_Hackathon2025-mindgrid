import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Mail, Github } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-card via-background to-card/50 border-t border-border/50 mt-20">
      <div className="container mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">CC</span>
              </div>
              <h3 className="text-xl font-bold text-gradient">CityCare</h3>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>{t('liveUpdates')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">{t('quickLinks')}</h3>
            <div className="space-y-4">
              <Link to="/" className="block text-base text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 group">
                <span className="group-hover:font-semibold transition-all duration-300">{t('home')}</span>
              </Link>
              <Link to="/about" className="block text-base text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 group">
                <span className="group-hover:font-semibold transition-all duration-300">{t('about')}</span>
              </Link>
              <Link to="/report" className="block text-base text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 group">
                <span className="group-hover:font-semibold transition-all duration-300">{t('report')}</span>
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">{t('connectWithUs')}</h3>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/sania-085a8a313/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 shadow-lg">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="mailto:424sania@gmail.com" className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 shadow-lg">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://github.com/Sania1405" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 shadow-lg">
                <Github className="w-6 h-6" />
              </a>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                {t('socialMediaDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-base text-muted-foreground">
              © {currentYear} CityCare. {t('allRightsReserved')}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{t('madeWithLove')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
