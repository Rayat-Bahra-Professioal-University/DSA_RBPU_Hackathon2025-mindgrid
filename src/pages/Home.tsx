import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, AlertTriangle, Sparkles, Users, MessageCircle } from 'lucide-react';
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
      <section className="relative section-padding overflow-hidden indian-flag-bg-subtle">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        
        <div className="container mx-auto container-padding relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {user && userData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <Card className="inline-block px-8 py-6 glass-effect shadow-2xl border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground mb-1">{t('welcomeBack')}</p>
                      <p className="text-2xl md:text-3xl font-bold text-gradient">
                        {userData.name}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-gradient">{t('heroTitle')}</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('heroSubtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Report Problem Button - Only for users or redirects to login */}
              {!user ? (
                <Button 
                  size="lg" 
                  className="btn-large text-lg shadow-2xl hover:shadow-primary/25"
                  onClick={() => navigate('/auth')}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('reportPothole')}
                </Button>
              ) : userData?.role !== 'admin' ? (
                <Button 
                  size="lg" 
                  className="btn-large text-lg shadow-2xl hover:shadow-primary/25"
                  onClick={() => navigate('/report')}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('reportPothole')}
                </Button>
              ) : null}


              <Button 
                size="lg" 
                variant="outline" 
                className="btn-large text-lg border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => navigate('/about')}
              >
                <Users className="w-5 h-5 mr-2" />
                {t('learnMore')}
              </Button>
              
              {user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-large text-lg border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={() => navigate(userData?.role === 'admin' ? '/admin' : '/dashboard')}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('viewReports')}
                </Button>
              )}
              
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Real-time from Firebase */}
      <section className="section-padding bg-gradient-to-br from-card via-background to-card/50 indian-flag-bg-subtle">
        <div className="container mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">{t('liveStatistics')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('realTimeData')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`card-gradient text-center p-8 ${stat.bgColor} border-transparent hover:scale-105 transition-all duration-300 group`}>
                  <div className={`w-20 h-20 ${stat.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <motion.div 
                    className={`text-6xl font-bold mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xl font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-success/10 rounded-full border border-success/20">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-success font-medium">{t('liveUpdates')}</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gradient-to-br from-background via-card/30 to-background indian-flag-bg-subtle">
        <div className="container mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">{t('howItWorks')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('simpleSteps')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-bold text-primary-foreground">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{t('spotProblem')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('spotProblemDesc')}
              </p>
            </motion.div>

            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-bold text-accent-foreground">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">{t('reportIt')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('reportItDesc')}
              </p>
            </motion.div>

            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-success to-success/80 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-bold text-success-foreground">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-warning-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-success transition-colors duration-300">{t('trackProgress')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('trackProgressDesc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
