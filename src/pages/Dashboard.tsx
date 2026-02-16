import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2, Edit, Plus, Star, MessageSquare, Bell, Search, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface Report {
  id: string;
  uniqueId?: string;
  location: string;
  description: string;
  problemType?: string;
  status: 'pending' | 'inProgress' | 'fixed';
  photoURL?: string;
  createdAt: string;
  updatedAt?: string;
  rating?: number | null;
  feedback?: string | null;
  statusNotificationSent?: boolean;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDialog, setFeedbackDialog] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, feedback: '' });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Report | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (userData?.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, userData, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      // Real-time listener for reports
      const q = query(collection(db, 'reports'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        
        // Check for status changes and show notifications
        reportsData.forEach(report => {
          if (report.status === 'fixed' && !report.statusNotificationSent) {
            toast.success(`Your report at "${report.location}" has been fixed! 🎉`);
            setNotifications(prev => [...prev, `Report at "${report.location}" marked as fixed`]);
            // Mark notification as sent
            updateDoc(doc(db, 'reports', report.id), { statusNotificationSent: true });
          }
        });
        
        setReports(reportsData);
        setLoading(false);
      }, (error) => {
        console.error('Real-time error:', error);
        toast.error(t('error'));
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      toast.success(t('reportDeleted'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const submitFeedback = async (reportId: string) => {
    if (feedbackForm.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    try {
      await updateDoc(doc(db, 'reports', reportId), {
        rating: feedbackForm.rating,
        feedback: feedbackForm.feedback.trim(),
        feedbackAt: new Date().toISOString()
      });
      toast.success(t('feedbackSubmitted'));
      setFeedbackDialog(null);
      setFeedbackForm({ rating: 0, feedback: '' });
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'destructive', label: t('statusPending') },
      inProgress: { variant: 'default', label: t('statusInProgress') },
      fixed: { variant: 'default', label: t('statusFixed') }
    };
    
    return variants[status] || variants.pending;
  };

  const trackProblem = async () => {
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setIsTracking(true);
    try {
      // Search for report by uniqueId
      const reportsQuery = query(collection(db, 'reports'), where('uniqueId', '==', trackingId.trim()));
      const querySnapshot = await getDocs(reportsQuery);
      
      if (querySnapshot.empty) {
        toast.error('No report found with this tracking ID');
        setTrackingResult(null);
      } else {
        const report = querySnapshot.docs[0].data() as Report;
        setTrackingResult({ ...report, id: querySnapshot.docs[0].id });
        toast.success('Report found!');
      }
    } catch (error) {
      toast.error('Error tracking report');
      setTrackingResult(null);
    } finally {
      setIsTracking(false);
    }
  };

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Tracking ID copied to clipboard!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background indian-flag-bg-subtle">
      <div className="container mx-auto container-padding section-padding">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">{t('myReports')}</h1>
            <p className="text-base text-muted-foreground">{t('trackAndManage')}</p>
          </div>
          <Button 
            size="lg" 
            className="btn-large shadow-2xl hover:shadow-primary/25" 
            onClick={() => navigate('/report')}
          >
            <Plus className="w-6 h-6 mr-3" />
            {t('reportPothole')}
          </Button>
        </motion.div>

        {/* Problem Tracking Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="card-gradient p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{t('trackYourProblem')}</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="trackingId" className="text-sm font-medium mb-2 block">
                  {t('enterTrackingId')}
                </Label>
                <Input
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g., CC1703123456ABC12"
                  className="h-12"
                />
              </div>
              <Button
                onClick={trackProblem}
                disabled={isTracking}
                className="h-12 px-8"
              >
                {isTracking ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {t('track')}
                  </>
                )}
              </Button>
            </div>

            {trackingResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/5 border border-primary/20 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{t('reportFound')}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">{t('trackingId')}</span>
                      <code className="bg-primary/10 px-2 py-1 rounded text-sm font-mono">
                        {trackingResult.uniqueId}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyTrackingId(trackingResult.uniqueId || '')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge {...getStatusBadge(trackingResult.status)}>
                    {getStatusBadge(trackingResult.status).label}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('problemType')}</span>
                    <p className="text-muted-foreground capitalize">{trackingResult.problemType || t('notSpecified')}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('location')}:</span>
                    <p className="text-muted-foreground">{trackingResult.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('reported')}</span>
                    <p className="text-muted-foreground">
                      {new Date(trackingResult.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">{t('lastUpdated')}</span>
                    <p className="text-muted-foreground">
                      {new Date(trackingResult.updatedAt || trackingResult.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {trackingResult.description && (
                  <div className="mt-4">
                    <span className="font-medium text-sm">{t('description')}</span>
                    <p className="text-muted-foreground text-sm mt-1">{trackingResult.description}</p>
                  </div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>

      {reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-gradient text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">{t('noReportsYet')}</h3>
            <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
              {t('startMakingDifference')}
            </p>
            <Button 
              size="lg" 
              className="btn-large shadow-2xl hover:shadow-primary/25"
              onClick={() => navigate('/report')}
            >
              <Plus className="w-6 h-6 mr-3" />
              {t('reportPothole')}
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, index) => {
            const statusInfo = getStatusBadge(report.status);
            
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="card-gradient overflow-hidden group hover:scale-105 transition-all duration-300">
                  {report.photoURL && (
                    <div className="relative overflow-hidden">
                      <img 
                        src={report.photoURL} 
                        alt="City Problem" 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-base font-semibold line-clamp-1">{report.location}</span>
                      </div>
                      <Badge 
                        variant={statusInfo.variant as any} 
                        className="text-sm font-medium px-3 py-1"
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                    
                    <div className="flex gap-3">
                      {report.status === 'fixed' && !report.rating && (
                        <Dialog open={feedbackDialog === report.id} onOpenChange={(open) => setFeedbackDialog(open ? report.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                              <Star className="w-4 h-4 mr-2" />
                              {t('giveFeedback')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold">{t('submitFeedback')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <Label className="text-base font-semibold">{t('rating')}</Label>
                                <div className="flex gap-2 mt-3">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Button
                                      key={star}
                                      type="button"
                                      variant={feedbackForm.rating >= star ? 'default' : 'outline'}
                                      size="sm"
                                      className="w-12 h-12 rounded-xl"
                                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                    >
                                      <Star className="w-5 h-5" fill={feedbackForm.rating >= star ? 'currentColor' : 'none'} />
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-base font-semibold">{t('feedback')}</Label>
                                <Textarea
                                  value={feedbackForm.feedback}
                                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                  placeholder={t('feedbackPlaceholder')}
                                  className="mt-3 min-h-24"
                                />
                              </div>
                              <Button 
                                onClick={() => submitFeedback(report.id)} 
                                className="w-full btn-large"
                              >
                                {t('submit')}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {report.rating && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold text-yellow-700">{report.rating}/5</span>
                        </div>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="hover:scale-105 transition-transform duration-300"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
