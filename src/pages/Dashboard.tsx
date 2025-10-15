import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2, Edit, Plus, Star, MessageSquare, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Report {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'inProgress' | 'fixed';
  photoURL?: string;
  createdAt: string;
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1>{t('myReports')}</h1>
        <Button size="lg" className="btn-large" onClick={() => navigate('/report')}>
          <Plus className="w-5 h-5 mr-2" />
          {t('reportPothole')}
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card className="card-elevated text-center py-16">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-4">No Reports Yet</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Start making a difference by reporting your first pothole!
          </p>
          <Button size="lg" onClick={() => navigate('/report')}>
            {t('reportPothole')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const statusInfo = getStatusBadge(report.status);
            
            return (
              <Card key={report.id} className="card-elevated overflow-hidden">
                {report.photoURL && (
                  <img 
                    src={report.photoURL} 
                    alt="Pothole" 
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="text-lg font-medium">{report.location}</span>
                    </div>
                    <Badge variant={statusInfo.variant as any} className="text-sm">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex gap-2">
                    {report.status === 'fixed' && !report.rating && (
                      <Dialog open={feedbackDialog === report.id} onOpenChange={(open) => setFeedbackDialog(open ? report.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Star className="w-4 h-4 mr-2" />
                            {t('giveFeedback')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('submitFeedback')}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>{t('rating')}</Label>
                              <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Button
                                    key={star}
                                    type="button"
                                    variant={feedbackForm.rating >= star ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                  >
                                    <Star className="w-5 h-5" fill={feedbackForm.rating >= star ? 'currentColor' : 'none'} />
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label>{t('feedback')}</Label>
                              <Textarea
                                value={feedbackForm.feedback}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                placeholder={t('feedbackPlaceholder')}
                                className="mt-2"
                              />
                            </div>
                            <Button onClick={() => submitFeedback(report.id)} className="w-full">
                              {t('submit')}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {report.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{report.rating}/5</span>
                      </div>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
