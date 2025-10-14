import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const getMarkerIcon = (status: string) => {
  const color = status === 'fixed' ? 'green' : status === 'inProgress' ? 'orange' : 'red';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

interface Report {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'inProgress' | 'fixed';
  photoURL?: string;
  userName?: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

function LocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    map.locate().on('locationfound', (e: any) => {
      const pos: LatLngExpression = [e.latitude, e.longitude];
      setPosition(pos);
      map.flyTo(pos, 13);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function Map() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<LatLngExpression>([30.7333, 76.7794]); // Chandigarh

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: LatLngExpression = [position.coords.latitude, position.coords.longitude];
          setCenter(pos);
        },
        () => {
          console.log('Unable to get location, using default');
        }
      );
    }

    // Real-time listener for reports
    const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
      const reportsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const currentCenter = center as [number, number];
        return {
          id: doc.id,
          ...data,
          // Generate random coordinates near center if not available
          latitude: data.latitude || currentCenter[0] + (Math.random() - 0.5) * 0.1,
          longitude: data.longitude || currentCenter[1] + (Math.random() - 0.5) * 0.1,
        };
      }) as Report[];
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reports:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixed':
        return 'default';
      case 'inProgress':
        return 'default';
      default:
        return 'destructive';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1>{t('interactiveMap')}</h1>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>{t('statusPending')}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>{t('statusInProgress')}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>{t('statusFixed')}</span>
          </div>
        </div>
      </div>

      <Card className="card-elevated overflow-hidden">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            {reports.map((report) => {
              const pos: LatLngExpression = [report.latitude!, report.longitude!];
              return (
                <Marker
                  key={report.id}
                  position={pos}
                >
                  <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg">{report.location}</h3>
                      <Badge variant={getStatusColor(report.status) as any} className="mt-1">
                        {t(`status${report.status.charAt(0).toUpperCase() + report.status.slice(1)}`)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{report.description}</p>
                  {report.photoURL && (
                    <img 
                      src={report.photoURL} 
                      alt="Pothole" 
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Reported by: {report.userName || 'Anonymous'}
                  </p>
                </div>
              </Popup>
            </Marker>
            );
          })}
        </MapContainer>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-elevated text-center p-6">
          <div className="text-3xl font-bold text-red-500">{reports.filter(r => r.status === 'pending').length}</div>
          <div className="text-muted-foreground">{t('statusPending')}</div>
        </Card>
        <Card className="card-elevated text-center p-6">
          <div className="text-3xl font-bold text-orange-500">{reports.filter(r => r.status === 'inProgress').length}</div>
          <div className="text-muted-foreground">{t('statusInProgress')}</div>
        </Card>
        <Card className="card-elevated text-center p-6">
          <div className="text-3xl font-bold text-green-500">{reports.filter(r => r.status === 'fixed').length}</div>
          <div className="text-muted-foreground">{t('statusFixed')}</div>
        </Card>
      </div>
    </div>
  );
}
