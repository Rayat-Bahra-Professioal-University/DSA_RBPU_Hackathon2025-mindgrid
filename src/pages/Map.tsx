import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

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

export default function Map() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [center] = useState<[number, number]>([30.7333, 76.7794]); // Chandigarh
  const mapInitialized = useState(false)[0];

  useEffect(() => {
    // Real-time listener for reports
    const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
      const reportsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Generate random coordinates near center if not available
          latitude: data.latitude || center[0] + (Math.random() - 0.5) * 0.1,
          longitude: data.longitude || center[1] + (Math.random() - 0.5) * 0.1,
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

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const container = document.getElementById('map-container');
      if (!container) {
        console.error('Map container not found');
        return;
      }

      // Check if map is already initialized
      if (container.querySelector('.leaflet-container')) {
        return;
      }

      // Initialize map
      const mapInstance = L.map('map-container').setView(center, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
            mapInstance.setView(userPos, 13);
            L.marker(userPos).addTo(mapInstance)
              .bindPopup('You are here')
              .openPopup();
          },
          () => {
            console.log('Unable to get location, using default');
          }
        );
      }

      setMap(mapInstance);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (map) {
        map.remove();
      }
    };
  }, [loading]);

  useEffect(() => {
    if (!map || reports.length === 0) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each report
    reports.forEach((report) => {
      const markerColor = report.status === 'fixed' ? '#10b981' : report.status === 'inProgress' ? '#f59e0b' : '#ef4444';
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${markerColor};
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

      const marker = L.marker([report.latitude!, report.longitude!], { icon: customIcon })
        .addTo(map);

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 1.125rem; margin-bottom: 0.5rem;">${report.location}</h3>
          <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">${report.description}</p>
          ${report.photoURL ? `<img src="${report.photoURL}" alt="Pothole" style="width: 100%; height: 128px; object-fit: cover; border-radius: 0.5rem; margin-top: 0.5rem;" />` : ''}
          <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">Reported by: ${report.userName || 'Anonymous'}</p>
        </div>
      `;

      marker.bindPopup(popupContent);
    });
  }, [map, reports]);

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
        <div id="map-container" style={{ height: '600px', width: '100%' }} className="rounded-xl" />
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
