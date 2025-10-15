import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MapPin, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function Report() {
  const { t } = useTranslation();
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    location: '',
    description: ''
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Please login to report a pothole');
        navigate('/auth');
      } else if (userData?.role === 'admin') {
        toast.error('Admins cannot report potholes');
        navigate('/admin');
      }
    }
  }, [user, userData, authLoading, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to report a pothole');
      navigate('/auth');
      return;
    }

    if (!formData.location.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let photoURL = '';

      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `reports/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Add report to Firestore
      await addDoc(collection(db, 'reports'), {
        userId: user.uid,
        userName: userData?.name || 'Anonymous',
        userEmail: user.email || '',
        location: formData.location.trim(),
        description: formData.description.trim(),
        photoURL,
        status: 'pending',
        rating: null,
        feedback: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success(t('reportSubmitted'));
      setFormData({ location: '', description: '' });
      setImageFile(null);
      setImagePreview('');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Submit error:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check Firestore security rules.');
      } else {
        toast.error(error.message || t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="card-elevated text-center max-w-md p-12">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="mb-4">Login Required</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Please login to report a pothole
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            {t('login')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="mb-8">{t('reportFormTitle')}</h1>

      <Card className="card-elevated">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t('location')}
            </Label>
            <Input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="text-lg h-14"
              placeholder="e.g., Main Street near City Hall"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg">
              {t('description')}
            </Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-lg min-h-32"
              placeholder={t('descriptionPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo" className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {t('uploadPhoto')}
            </Label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-xl"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-4 right-4"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">
                  Click to upload or drag and drop
                </p>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="photo" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full btn-large"
            disabled={loading}
          >
            {loading ? 'Submitting...' : t('submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
