import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function Map() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Pothole Map</h1>

      <Card className="card-elevated text-center py-20">
        <MapPin className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h2 className="mb-4">Interactive Map Coming Soon</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're working on an interactive map that will show all reported potholes in your area. 
          This feature will include real-time status updates and location-based filtering.
        </p>
        <div className="mt-8 p-6 bg-muted rounded-xl max-w-md mx-auto">
          <p className="text-lg">
            <strong>Next Steps:</strong> Configure Firebase in <code className="bg-background px-2 py-1 rounded">src/lib/firebase.ts</code> to enable map visualization.
          </p>
        </div>
      </Card>
    </div>
  );
}
