import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'inProgress' | 'fixed';
  photoURL?: string;
  createdAt: string;
  userName?: string;
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && userData?.role !== 'admin') {
      navigate('/');
    }
  }, [userData, authLoading, navigate]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchReports();
    }
  }, [userData]);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reports'));
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

  const updateStatus = async (reportId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: newStatus
      });
      setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus as any } : r));
      toast.success(t('reportUpdated'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

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
        <div className="p-6 border-b">
          <h2 className="text-2xl">{t('allReports')}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-lg font-semibold">{t('location')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('description')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('status')}</th>
                <th className="text-left p-4 text-lg font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-muted/50">
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
