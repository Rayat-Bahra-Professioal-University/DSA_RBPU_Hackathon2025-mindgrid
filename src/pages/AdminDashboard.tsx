import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, CheckCircle, Clock, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'inProgress' | 'fixed';
  photoURL?: string;
  createdAt: string;
  userName?: string;
  userId?: string;
  rating?: number | null;
  feedback?: string | null;
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && userData?.role !== 'admin') {
      navigate('/');
    }
  }, [userData, authLoading, navigate]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      // Real-time listener for all reports
      const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        setReports(reportsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      }, (error) => {
        console.error('Real-time error:', error);
        toast.error(t('error'));
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userData]);

  const updateStatus = async (reportId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        statusNotificationSent: false // Reset to send notification to citizen
      });
      toast.success(t('reportUpdated'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const filteredReports = filterStatus === 'all' 
    ? reports 
    : reports.filter(r => r.status === filterStatus);

  const stats = {
    total: reports.length,
    fixed: reports.filter(r => r.status === 'fixed').length,
    inProgress: reports.filter(r => r.status === 'inProgress').length,
    pending: reports.filter(r => r.status === 'pending').length,
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
      <h1 className="mb-12">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="card-elevated text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
          <div className="text-4xl font-bold mb-2">{stats.total}</div>
          <div className="text-lg text-muted-foreground">{t('totalReports')}</div>
        </Card>

        <Card className="card-elevated text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
          <div className="text-4xl font-bold mb-2">{stats.fixed}</div>
          <div className="text-lg text-muted-foreground">{t('fixed')}</div>
        </Card>

        <Card className="card-elevated text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-accent" />
          <div className="text-4xl font-bold mb-2">{stats.inProgress}</div>
          <div className="text-lg text-muted-foreground">{t('inProgress')}</div>
        </Card>

        <Card className="card-elevated text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <div className="text-4xl font-bold mb-2">{stats.pending}</div>
          <div className="text-lg text-muted-foreground">{t('pending')}</div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="card-elevated overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl">{t('allReports')}</h2>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatus')}</SelectItem>
              <SelectItem value="pending">{t('statusPending')}</SelectItem>
              <SelectItem value="inProgress">{t('statusInProgress')}</SelectItem>
              <SelectItem value="fixed">{t('statusFixed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-lg font-semibold">{t('reportedBy')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('location')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('description')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('status')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('rating')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="font-medium">{report.userName || 'Anonymous'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">{report.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="line-clamp-2">{report.description}</p>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={
                        report.status === 'fixed' ? 'default' : 
                        report.status === 'inProgress' ? 'default' : 
                        'destructive'
                      }
                    >
                      {t(`status${report.status.charAt(0).toUpperCase() + report.status.slice(1)}`)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {report.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{report.rating}/5</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Select 
                      value={report.status} 
                      onValueChange={(value) => updateStatus(report.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t('statusPending')}</SelectItem>
                        <SelectItem value="inProgress">{t('statusInProgress')}</SelectItem>
                        <SelectItem value="fixed">{t('statusFixed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
