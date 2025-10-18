import { useState, useEffect, useRef } from 'react';
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
import { MapPin, Upload, Camera, CheckCircle, Trash2, Construction, Droplets, AlertTriangle, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { sendEmailNotification } from '@/lib/emailClient';

export default function Report() {
  const { t } = useTranslation();
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    problemType: 'city-problem'
  });

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const problemTypes = [
    { id: 'pothole', label: 'Road Problem', icon: AlertTriangle, color: 'text-orange-500' },
    { id: 'garbage', label: 'Garbage', icon: Trash2, color: 'text-red-500' },
    { id: 'construction', label: 'Construction Issue', icon: Construction, color: 'text-yellow-500' },
    { id: 'drainage', label: 'Poor Drainage', icon: Droplets, color: 'text-blue-500' }
  ];

  // Common Indian cities for autocomplete
  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
    'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Vijayawada', 'Kolhapur', 'Amritsar',
    'Noida', 'Ranchi', 'Howrah', 'Coimbatore', 'Raipur', 'Jabalpur', 'Gwalior', 'Chandigarh', 'Tiruchirappalli',
    'Mysore', 'Bhubaneswar', 'Kochi', 'Bhavnagar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Amravati',
    'Nanded', 'Kolhapur', 'Sangli', 'Malegaon', 'Ulhasnagar', 'Jalgaon', 'Akola', 'Latur', 'Ahmadnagar',
    'Dhule', 'Ichalkaranji', 'Parbhani', 'Jalna', 'Bhusawal', 'Panvel', 'Satara', 'Beed', 'Yavatmal',
    'Kamptee', 'Gondia', 'Chandrapur', 'Achalpur', 'Osmanabad', 'Nandurbar', 'Wardha', 'Udgir', 'Aurangabad',
    'Amalner', 'Akot', 'Pandharpur', 'Shirpur', 'Parli', 'Pachora', 'Jalgaon', 'Bhusawal', 'Malkapur',
    'Hoshiarpur', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Batala', 'Moga', 'Abohar',
    'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Fazilka', 'Kapurthala', 'Sunam',
    'Nabha', 'Zira', 'Nakodar', 'Gurdaspur', 'Faridkot', 'Sangrur', 'Fatehgarh Sahib', 'Rupnagar', 'Mansa'
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Please login to report a city problem');
        navigate('/auth');
      } else if (userData?.role === 'admin') {
        toast.error('Admins cannot report problems');
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

  const triggerFileInput = () => {
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Location autocomplete functions
  const handleLocationChange = (value: string) => {
    setFormData({ ...formData, location: value });
    
    if (value.length > 1) {
      const filtered = indianCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setFormData({ ...formData, location });
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          if (data.locality && data.city) {
            setFormData({ 
              ...formData, 
              location: `${data.locality}, ${data.city}, ${data.principalSubdivision}` 
            });
            toast.success('Location detected successfully!');
          } else {
            setFormData({ 
              ...formData, 
              location: `${latitude}, ${longitude}` 
            });
            toast.success('Coordinates detected successfully!');
          }
        } catch (error) {
          toast.error('Failed to get location name. Using coordinates instead.');
          setFormData({ 
            ...formData, 
            location: `${position.coords.latitude}, ${position.coords.longitude}` 
          });
        }
        setIsGettingLocation(false);
      },
      (error) => {
        toast.error('Failed to get your location. Please enter manually.');
        setIsGettingLocation(false);
      }
    );
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to report a city problem');
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

      // Generate unique ID for the report
      const uniqueId = `CC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Add report to Firestore
      await addDoc(collection(db, 'reports'), {
        uniqueId,
        userId: user.uid,
        userName: userData?.name || 'Anonymous',
        userEmail: user.email || '',
        location: formData.location.trim(),
        description: formData.description.trim(),
        problemType: formData.problemType,
        photoURL,
        status: 'pending',
        rating: null,
        feedback: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Send email confirmation
      try {
        const emailSent = await sendEmailNotification({
          userName: userData?.name || 'Anonymous',
          userEmail: user.email || '',
          uniqueId,
          location: formData.location.trim(),
          problemType: formData.problemType
        });
        
        if (emailSent) {
          toast.success(`Report submitted successfully! Your unique ID is: ${uniqueId}. Email notification sent!`);
        } else {
          toast.success(`Report submitted successfully! Your unique ID is: ${uniqueId}.`);
        }
      } catch (error) {
        console.error('Email sending error:', error);
        toast.success(`Report submitted successfully! Your unique ID is: ${uniqueId}.`);
      }

      setFormData({ location: '', description: '', problemType: 'city-problem' });
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
          <p className="text-base text-muted-foreground mb-6">
            Please login to report a city problem
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            {t('login')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background indian-flag-bg-subtle">
      <div className="container mx-auto container-padding section-padding max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gradient">{t('reportFormTitle')}</h1>
          <p className="text-base text-muted-foreground">Help improve your city by reporting problems like garbage, construction issues, poor drainage, and road problems</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-gradient">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Problem Type Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Problem Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {problemTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, problemType: type.id })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        formData.problemType === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <type.icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                      <p className="text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="location" className="text-base font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  {t('location')}
                </Label>
                <div className="relative">
                  <Input
                    ref={locationInputRef}
                    id="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => formData.location.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="h-12 rounded-lg border-2 focus:border-primary transition-all duration-300 pr-20"
                    placeholder="e.g., Hoshiarpur, Punjab or click GPS button"
                  />
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary border-0"
                    size="sm"
                  >
                    {isGettingLocation ? (
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Location Suggestions Dropdown */}
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLocation(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-primary/5 border-b border-border/50 last:border-b-0 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Start typing city name for autocomplete or use GPS button to detect current location
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="description" className="text-base font-semibold">
                  {t('description')}
                </Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-32 rounded-lg border-2 focus:border-primary transition-all duration-300"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>


              <div className="space-y-4">
                <Label htmlFor="photo" className="text-base font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Camera className="w-4 h-4 text-accent" />
                  </div>
                  {t('uploadPhoto')} <span className="text-sm text-muted-foreground">(Optional)</span>
                </Label>
                
                {imagePreview ? (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div 
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-border rounded-2xl p-16 text-center hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                    >
                      <Upload className="w-16 h-16 mx-auto mb-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <p className="text-xl text-muted-foreground mb-6">
                        Click to upload or drag and drop your photo
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        className="btn-large hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileInput();
                        }}
                      >
                        Choose File
                      </Button>
                    </div>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full btn-large shadow-2xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    {t('submit')}
                  </div>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
