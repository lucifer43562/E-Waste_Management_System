
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Star, Phone, Navigation, AlertCircle } from 'lucide-react';

const NearbyCompanies = () => {
  const { nearbyCompanies, updateNearbyCompanies } = useAuth();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'loading'>('prompt');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = () => {
    setLocationPermission('loading');
    
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLocationPermission('granted');
        updateNearbyCompanies(location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Check if location permission is already granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        }
      });
    }
  }, []);

  if (locationPermission === 'prompt') {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-emerald-700 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Nearby Waste Management Companies
          </CardTitle>
          <CardDescription>Allow location access to find companies near you</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Navigation className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Location Access Required</h3>
          <p className="text-gray-600 mb-6">
            We need your location to show nearby waste management companies in your area.
          </p>
          <Button 
            onClick={requestLocation}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Allow Location Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (locationPermission === 'loading') {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-emerald-700 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Nearby Waste Management Companies
          </CardTitle>
          <CardDescription>Getting your location...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Locating nearby companies...</p>
        </CardContent>
      </Card>
    );
  }

  if (locationPermission === 'denied') {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-emerald-700 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Nearby Waste Management Companies
          </CardTitle>
          <CardDescription>Location access denied</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Location Access Denied</h3>
          <p className="text-gray-600 mb-6">
            We cannot show nearby companies without location access. Please enable location in your browser settings and try again.
          </p>
          <Button 
            onClick={requestLocation}
            variant="outline"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-emerald-700 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Nearby Waste Management Companies
        </CardTitle>
        <CardDescription>
          Companies available in your area
          {userLocation && (
            <span className="text-xs text-emerald-600 ml-2">
              • Location detected
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nearbyCompanies.map((company) => (
            <div key={company.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{company.distance} away</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{company.rating}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {company.services.map((service, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-emerald-100 text-emerald-800 text-xs"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyCompanies;
