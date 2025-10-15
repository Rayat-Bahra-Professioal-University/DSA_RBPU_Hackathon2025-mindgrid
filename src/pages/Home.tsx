import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';

interface Report {
  id: string;
  status: 'pending' | 'inProgress' | 'fixed';
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    fixed: 0,
    inProgress: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for reports to calculate live stats
    const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];

      setStats({
        total: reports.length,
        fixed: reports.filter(r => r.status === 'fixed').length,
        inProgress: reports.filter(r => r.status === 'inProgress').length,
        pending: reports.filter(r => r.status === 'pending').length
      });
      setLoading(false);
    }, (error) => {
      console.error('Error fetching stats:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statsData = [
    { 
      icon: MapPin, 
      label: t('totalReports'), 
      value: loading ? '...' : stats.total.toLocaleString(), 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      iconBg: 'bg-blue-500'
    },
    { 
      icon: CheckCircle, 
      label: t('fixed'), 
      value: loading ? '...' : stats.fixed.toLocaleString(), 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      iconBg: 'bg-green-500'
    },
    { 
      icon: Clock, 
      label: t('inProgress'), 
      value: loading ? '...' : stats.inProgress.toLocaleString(), 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      iconBg: 'bg-yellow-500'
    },
    { 
      icon: AlertTriangle, 
      label: t('pending'), 
      value: loading ? '...' : stats.pending.toLocaleString(), 
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      iconBg: 'bg-red-500'
    },
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
            {user && userData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Card className="inline-block px-10 py-5 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 border-primary/30 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                    <p className="text-2xl md:text-3xl font-bold">
                      Welcome, <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{userData.name}</span>
                    </p>
                    <Sparkles className="w-7 h-7 text-accent animate-pulse" />
                  </div>
                </Card>
              </motion.div>
            )}
            
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

      {/* Stats Section - Real-time from Firebase */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Statistics</h2>
            <p className="text-lg text-muted-foreground">Real-time data synced with Firebase</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={`card-elevated text-center p-8 ${stat.bgColor} border-transparent hover:scale-105 transition-transform duration-300`}>
                  <div className={`w-16 h-16 ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <motion.div 
                    className={`text-5xl font-bold mb-3 ${stat.color}`}
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-lg font-medium text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live updates from Firebase</span>
              </div>
            </motion.div>
          )}
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
