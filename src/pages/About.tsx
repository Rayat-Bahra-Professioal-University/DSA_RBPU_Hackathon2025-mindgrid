import { Card } from '@/components/ui/card';
import { AlertTriangle, Users, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center mb-6">About Pothole Watch</h1>
        <p className="text-xl text-center text-muted-foreground mb-16 leading-relaxed">
          A citizen-driven platform to improve road safety and infrastructure maintenance
        </p>

        {/* Mission */}
        <Card className="card-elevated mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that safe roads are a fundamental right for every citizen. Pothole Watch empowers 
                communities to take an active role in identifying and reporting road hazards, creating a 
                transparent system that holds authorities accountable for maintaining our infrastructure.
              </p>
            </div>
          </div>
        </Card>

        {/* The Problem */}
        <Card className="card-elevated mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-destructive rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
            </div>
            <div>
              <h2 className="mb-4">The Problem</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Potholes are more than just an inconvenience—they're a serious safety hazard that causes:
              </p>
              <ul className="space-y-2 text-lg text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Thousands of accidents and injuries every year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Billions in vehicle damage and repairs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Delayed emergency response times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Economic losses due to damaged goods and vehicles</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* How We Help */}
        <Card className="card-elevated mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-success-foreground" />
            </div>
            <div>
              <h2 className="mb-4">How We Help</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Pothole Watch creates a direct line of communication between citizens and authorities:
              </p>
              <ul className="space-y-2 text-lg text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Quick and easy reporting with photos and location data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Real-time tracking of repair progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Community-driven awareness and accountability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Data-driven insights for better infrastructure planning</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Get Involved */}
        <Card className="card-elevated bg-primary text-primary-foreground">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="mb-4 text-primary-foreground">Get Involved</h2>
              <p className="text-lg leading-relaxed opacity-90">
                Every report you submit helps make our roads safer. Join thousands of concerned citizens 
                who are actively working to improve their communities. Together, we can fix the roads and 
                save lives.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
