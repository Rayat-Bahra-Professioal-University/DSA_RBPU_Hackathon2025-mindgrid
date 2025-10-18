import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, CheckCircle, Clock, AlertTriangle, Star, Brain, TrendingUp, Users, Zap, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIRecommendations, calculateAIScore } from '@/lib/aiUtils';
import { sendProblemFixedEmail, FixedEmailData } from '@/lib/emailClient';

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
  uniqueId?: string;
  problemType?: string;
  // AI-related fields
  aiScore?: {
    severityScore: number;
    priorityLevel: 'low' | 'medium' | 'high' | 'critical';
    confidenceScore: number;
    riskFactors: string[];
    estimatedUrgency: number;
  };
  priorityLevel?: 'low' | 'medium' | 'high' | 'critical';
  isDuplicate?: boolean;
  duplicateSimilarity?: number;
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && userData?.role !== 'admin') {
      navigate('/');
    }
  }, [userData, authLoading, navigate]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      // Real-time listener for all reports
      const unsubscribe = onSnapshot(collection(db, 'reports'), async (querySnapshot) => {
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        
        // Calculate AI scores for reports that don't have them
        const reportsWithAI = await Promise.all(
          reportsData.map(async (report) => {
            if (!report.aiScore) {
              try {
                const aiScore = await calculateAIScore(
                  report.photoURL || null,
                  report.description,
                  report.problemType || 'pothole',
                  report.location
                );
                return { ...report, aiScore, priorityLevel: aiScore.priorityLevel as 'low' | 'medium' | 'high' | 'critical' };
              } catch (error) {
                console.error('Error calculating AI score:', error);
                return { ...report, aiScore: null, priorityLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical' };
              }
            }
            return report;
          })
        );

        // Sort reports based on AI priority and date
        const sortedReports = reportsWithAI.sort((a, b) => {
          // First sort by AI priority level
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          const aPriority = a.priorityLevel || a.aiScore?.priorityLevel || 'medium';
          const bPriority = b.priorityLevel || b.aiScore?.priorityLevel || 'medium';
          
          if (priorityOrder[aPriority as keyof typeof priorityOrder] !== priorityOrder[bPriority as keyof typeof priorityOrder]) {
            return priorityOrder[bPriority as keyof typeof priorityOrder] - priorityOrder[aPriority as keyof typeof priorityOrder];
          }
          
          // Then by severity score
          const aScore = a.aiScore?.severityScore || 5;
          const bScore = b.aiScore?.severityScore || 5;
          if (aScore !== bScore) {
            return bScore - aScore;
          }
          
          // Finally by date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setReports(sortedReports);
        
        // Generate AI recommendations
        const recommendations = getAIRecommendations(sortedReports);
        setAiRecommendations(recommendations);
        
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
      // Find the report to get user details
      const report = reports.find(r => r.id === reportId);
      
      await updateDoc(doc(db, 'reports', reportId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        statusNotificationSent: false // Reset to send notification to citizen
      });
      
      // Send email notification if status is changed to "fixed"
      if (newStatus === 'fixed' && report) {
        try {
          // Get user data to send email
          const userDoc = await getDoc(doc(db, 'users', report.userId || ''));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            const emailData: FixedEmailData = {
              userName: userData.name || 'Citizen',
              userEmail: userData.email || '',
              uniqueId: report.uniqueId || reportId,
              location: report.location,
              problemType: report.problemType || 'City Problem',
              fixedDate: new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              reportDate: new Date(report.createdAt).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            };
            
            const emailSent = await sendProblemFixedEmail(emailData);
            if (emailSent) {
              toast.success('Status updated and user notified via email!');
            } else {
              toast.success('Status updated (email notification failed)');
            }
          } else {
            toast.success('Status updated');
          }
        } catch (emailError) {
          console.error('Error sending fixed email:', emailError);
          toast.success('Status updated (email notification failed)');
        }
      } else {
        toast.success('Status updated');
      }
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const filteredReports = reports.filter(report => {
    const statusMatch = filterStatus === 'all' || report.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || 
      (report.priorityLevel || report.aiScore?.priorityLevel || 'medium') === filterPriority;
    return statusMatch && priorityMatch;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background indian-flag-bg-subtle">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gradient">{t('smartAdminDashboard')}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{t('intelligentProblemManagement')}</p>
        </motion.div>

        {/* Smart Recommendations */}
        {aiRecommendations && aiRecommendations.suggestedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-purple-800">Smart Recommendations</h2>
              </div>
              <div className="space-y-2">
                {aiRecommendations.suggestedActions.map((action: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Stats with AI Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="card-elevated text-center hover:scale-105 transition-transform duration-300">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
            <div className="text-4xl font-bold mb-2">{stats.total}</div>
            <div className="text-lg text-muted-foreground">{t('totalReports')}</div>
          </Card>

          <Card className="card-elevated text-center hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
            <div className="text-4xl font-bold mb-2">{stats.fixed}</div>
            <div className="text-lg text-muted-foreground">{t('fixed')}</div>
          </Card>

          <Card className="card-elevated text-center hover:scale-105 transition-transform duration-300">
            <Clock className="w-12 h-12 mx-auto mb-4 text-accent" />
            <div className="text-4xl font-bold mb-2">{stats.inProgress}</div>
            <div className="text-lg text-muted-foreground">{t('inProgress')}</div>
          </Card>

          <Card className="card-elevated text-center hover:scale-105 transition-transform duration-300">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <div className="text-4xl font-bold mb-2">{stats.pending}</div>
            <div className="text-lg text-muted-foreground">{t('pending')}</div>
          </Card>
        </motion.div>

        {/* Smart Priority Distribution */}
        {aiRecommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-800">CityCare Priority Distribution</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {aiRecommendations.resourceAllocation.critical}
                  </div>
                  <div className="text-sm text-red-700 font-semibold">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {aiRecommendations.resourceAllocation.high}
                  </div>
                  <div className="text-sm text-orange-700 font-semibold">High</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {aiRecommendations.resourceAllocation.medium}
                  </div>
                  <div className="text-sm text-yellow-700 font-semibold">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {aiRecommendations.resourceAllocation.low}
                  </div>
                  <div className="text-sm text-green-700 font-semibold">Low</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Reports Table with Smart Filtering */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-elevated overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-2xl font-bold">CityCare Reports Management</h2>
                <div className="flex flex-wrap gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('pending')}</SelectItem>
                      <SelectItem value="inProgress">{t('inProgress')}</SelectItem>
                      <SelectItem value="fixed">{t('fixed')}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('filterByPriority')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allPriorities')}</SelectItem>
                      <SelectItem value="critical">{t('critical')}</SelectItem>
                      <SelectItem value="high">{t('high')}</SelectItem>
                      <SelectItem value="medium">{t('medium')}</SelectItem>
                      <SelectItem value="low">{t('low')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
        
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-lg font-semibold flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {t('photo')}
                    </th>
                    <th className="text-left p-4 text-lg font-semibold">{t('reportedBy')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('location')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('description')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('priority')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('score')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('status')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('rating')}</th>
                    <th className="text-left p-4 text-lg font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const priorityLevel = report.priorityLevel || report.aiScore?.priorityLevel || 'medium';
                    const severityScore = report.aiScore?.severityScore || 5;
                    
                    return (
                      <tr key={report.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-4">
                          {report.photoURL ? (
                            <div className="relative group">
                              <img 
                                src={report.photoURL} 
                                alt="Report Photo" 
                                className="w-16 h-16 object-cover rounded-lg border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedPhoto(report.photoURL)}
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="text-white text-xs font-semibold">{t('view')}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">{t('noPhoto')}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{report.userName || 'Anonymous'}</div>
                          {report.isDuplicate && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Duplicate
                            </Badge>
                          )}
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
                              priorityLevel === 'critical' ? 'destructive' :
                              priorityLevel === 'high' ? 'default' :
                              priorityLevel === 'medium' ? 'secondary' : 'outline'
                            }
                            className="font-semibold"
                          >
                            {priorityLevel.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="font-bold text-purple-600">{severityScore}/10</span>
                          </div>
                          {report.aiScore?.confidenceScore && (
                            <div className="text-xs text-muted-foreground">
                              {Math.round(report.aiScore.confidenceScore * 100)}% confidence
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              report.status === 'fixed' ? 'default' : 
                              report.status === 'inProgress' ? 'default' : 
                              'destructive'
                            }
                          >
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
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
                              <SelectItem value="pending">{t('pending')}</SelectItem>
                              <SelectItem value="inProgress">{t('inProgress')}</SelectItem>
                              <SelectItem value="fixed">{t('fixed')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] bg-background rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => setSelectedPhoto(null)}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
              <img 
                src={selectedPhoto} 
                alt="Report Photo" 
                className="w-full h-full object-contain max-h-[90vh]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
