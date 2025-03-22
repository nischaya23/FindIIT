import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';

// Map component
const MapComponent = ({ 
  defaultCenter = { lat:26.521421, lng: 80.232133 }, // IITK coord
  defaultZoom = 15,
  items = [], // Array of items to display on map
  onItemSelect,
  height = '500px'
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiLoaded, setApiLoaded] = useState(false);
  const [markerIcons, setMarkerIcons] = useState({
    lost: null,
    found: null
  });
  
  // Fetch API key
  useEffect(() => {
    setApiKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  }, []);

  const handleApiLoad = () => {
    console.log('Maps API has loaded.');
    if (window.google) {
      // Create marker icons once API is loaded
      setMarkerIcons({
        lost: {
          url: '/client/marker/lost-marker2.png',
          scaledSize: new window.google.maps.Size(30, 30)
        },
        found: {
          url: '/client/marker/found-marker2.png',
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });
      setApiLoaded(true);
    }
  };

  const handleMarkerClick = (item) => {
    setSelectedItem(item);
    if (onItemSelect) onItemSelect(item);
  };

  if (!apiKey) return <div>Loading map...</div>;

  return (
    <div style={{ height: '82vh', width: '100%' }}>
      <APIProvider apiKey={apiKey} onLoad={handleApiLoad}>
        <Map
          defaultZoom={defaultZoom}
          defaultCenter={defaultCenter}
          mapId="findIIT-map"
        >
          {apiLoaded && items.map((item) => (
            <Marker
              key={item.id}
              position={{ lat: Number(item.lat), lng: Number(item.lng) }}
              onClick={() => handleMarkerClick(item)}
              icon={item.type === 'lost' ? markerIcons.lost : markerIcons.found}
            />
          ))}

          {selectedItem && (
            <InfoWindow
              position={{ lat: selectedItem.lat, lng: selectedItem.lng }}
              onCloseClick={() => setSelectedItem(null)}
            >
              <div className="info-window">
                <h3>{selectedItem.name}</h3>
                <p>Type: {selectedItem.type}</p>
                <p>{selectedItem.type === 'lost' ? 'Lost on:' : 'Found on:'} {selectedItem.date}</p>
                <button className="found-btn">
                  {selectedItem.type === 'lost' ? 'I found this' : 'This is mine'}
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapComponent;
