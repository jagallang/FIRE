import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

// 대한민국 중심 좌표
const center = {
  lat: 36.5,
  lng: 127.5
};

const WildfireMap = ({ wildfireData = [] }) => {
  const [selectedFire, setSelectedFire] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">지도 로딩 중...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={7}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
      }}
    >
      {wildfireData.map((fire) => (
        <Marker
          key={fire.id}
          position={{ lat: fire.latitude, lng: fire.longitude }}
          onClick={() => setSelectedFire(fire)}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      ))}

      {selectedFire && (
        <InfoWindow
          position={{ lat: selectedFire.latitude, lng: selectedFire.longitude }}
          onCloseClick={() => setSelectedFire(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-lg mb-2">{selectedFire.location}</h3>
            <p><strong>발생일:</strong> {selectedFire.date}</p>
            <p><strong>피해면적:</strong> {selectedFire.area}ha</p>
            <p><strong>원인:</strong> {selectedFire.cause}</p>
            {selectedFire.casualties && (
              <p><strong>인명피해:</strong> {selectedFire.casualties}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default WildfireMap;
