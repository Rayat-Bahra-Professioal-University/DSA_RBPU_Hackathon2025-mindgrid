import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    { icon: MapPin, label: t('totalReports'), value: '1,234', color: 'text-primary' },
    { icon: CheckCircle, label: t('fixed'), value: '856', color: 'text-success' },
    { icon: Clock, label: t('inProgress'), value: '234', color: 'text-accent' },
    { icon: AlertTriangle, label: t('pending'), value: '144', color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-large text-xl"
                onClick={() => navigate('/report')}
              >
                <MapPin className="w-6 h-6 mr-2" />
                {t('reportPothole')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-large text-xl"
                onClick={() => navigate('/map')}
              >
                {t('viewMap')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-elevated text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="mb-4">Spot a Pothole</h3>
              <p className="text-lg text-muted-foreground">
                Notice a dangerous pothole on the road? Take a photo with your phone.
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-accent-foreground">2</span>
              </div>
              <h3 className="mb-4">Report It</h3>
              <p className="text-lg text-muted-foreground">
                Fill out a simple form with location and description. Upload your photo.
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-success-foreground">3</span>
              </div>
              <h3 className="mb-4">Track Progress</h3>
              <p className="text-lg text-muted-foreground">
                Monitor the status of your report and see when it gets fixed!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-primary-foreground">Ready to Make a Difference?</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of citizens helping to improve road safety in our community.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="btn-large text-xl"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
}
