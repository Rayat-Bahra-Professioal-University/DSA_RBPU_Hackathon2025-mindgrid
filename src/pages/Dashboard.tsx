import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'inProgress' | 'fixed';
  photoURL?: string;
  createdAt: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'reports'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      setReports(reportsData);
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      setReports(reports.filter(r => r.id !== reportId));
      toast.success(t('reportDeleted'));
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/report/${report.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('edit')}
                    </Button>
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
