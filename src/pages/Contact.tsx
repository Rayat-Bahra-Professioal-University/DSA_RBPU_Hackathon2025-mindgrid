import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center mb-6">{t('contact')}</h1>
      <p className="text-xl text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
        Have questions or feedback? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <Card className="card-elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                {t('name')}
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-lg h-14"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-lg h-14"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-lg">
                Message
              </Label>
              <Textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="text-lg min-h-40"
                placeholder="How can we help you?"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-large"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="card-elevated">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-2">Email Us</h3>
                <p className="text-lg text-muted-foreground">
                  support@potholewatch.org
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-success-foreground" />
              </div>
              <div>
                <h3 className="mb-2">Call Us</h3>
                <p className="text-lg text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="mb-2">Visit Us</h3>
                <p className="text-lg text-muted-foreground">
                  123 Main Street<br />
                  City Hall, Floor 3<br />
                  Your City, State 12345
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-elevated bg-primary text-primary-foreground">
            <h3 className="mb-4 text-primary-foreground">Office Hours</h3>
            <div className="space-y-2 text-lg opacity-90">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
