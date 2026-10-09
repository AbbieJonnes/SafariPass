import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const youAreHereIcon = new L.DivIcon({
  className: '',
  html: '<div style="background:#0F766E;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #0F766E;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RouteMap() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState('');
  const watchIdRef = useRef(null);

  useEffect(() => {
    axiosInstance.get('/subscriptions/')
      .then((res) => {
        if (res.data.length > 0) setSubscription(res.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocationError('');
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? 'Location access denied. Allow it in your browser to see your live position.'
            : 'Could not get your location.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center text-gray-400 py-12">Loading...</p>
      </div>
    );
  }

  const route = subscription && typeof subscription.route === 'object' ? subscription.route : null;

  if (!subscription || !route) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="text-gray-500">You don't have an active subscription with route details yet.</p>
        </div>
      </div>
    );
  }

  const hasCoords = route.origin_lat && route.origin_lng && route.destination_lat && route.destination_lng;

  if (!hasCoords) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-2xl text-gray-400 mb-3" />
          <p className="text-gray-500">This route doesn't have map coordinates yet.</p>
        </div>
      </div>
    );
  }

  const origin = [parseFloat(route.origin_lat), parseFloat(route.origin_lng)];
  const destination = [parseFloat(route.destination_lat), parseFloat(route.destination_lng)];
  const center = position || origin;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Route Map</h1>
        <p className="text-gray-500 mb-4">
          {route.origin} <FontAwesomeIcon icon={faLocationDot} className="text-xs mx-1 text-gray-400" /> {route.destination}
        </p>

        {locationError && (
          <div className="bg-yellow-50 text-yellow-700 text-sm rounded-lg px-4 py-3 mb-4">
            {locationError}
          </div>
        )}

        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: '500px' }}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={origin}>
              <Popup>Origin: {route.origin}</Popup>
            </Marker>
            <Marker position={destination}>
              <Popup>Destination: {route.destination}</Popup>
            </Marker>
            <Polyline positions={[origin, destination]} pathOptions={{ color: '#0F2A43', dashArray: '6 8' }} />
            {position && (
              <Marker position={position} icon={youAreHereIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RouteMap;
