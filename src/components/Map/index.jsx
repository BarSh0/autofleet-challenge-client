import { DrawingManager, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { VehiclesContext } from '../../context/vehiclesContext';
import './style.css';

const Map = () => {
  const { path, setPath, data, mapCenter, setMapCenter, mapZoom, setMapZoom } = useContext(VehiclesContext);
  const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);

  const handleMarkerClick = (event) => {
    const newCenter = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    const newZoom = 15;
    setMapCenter(newCenter);
    setMapZoom(newZoom);
  };
  const polygonRef = useRef([]);
  const listenersRef = useRef([]);

  const onMapLoad = useCallback(
    (map) => {
      const nextCenter = map.getCenter();
      const nextZoom = map.getZoom();
      setMapZoom(nextZoom);
      setMapCenter({ lat: nextCenter.lat(), lng: nextCenter.lng() });
    },
    [setMapCenter, setMapZoom]
  );

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  const onLoad = useCallback(
    (polygon) => {
      if (!isPolygonDrawn) {
        setIsPolygonDrawn(true); // Set isPolygonDrawn to true when a polygon is drawn
        polygonRef.current = polygon;
        const path = polygon.getPath();
        onEdit();
        listenersRef.current.push(
          path.addListener('set_at', onEdit),
          path.addListener('insert_at', onEdit),
          path.addListener('remove_at', onEdit)
        );
      }
    },
    [isPolygonDrawn, onEdit]
  );

  const handleDelete = useCallback(() => {
    polygonRef.current.setMap(null);
    polygonRef.current = null;
    listenersRef.current = [];
    setIsPolygonDrawn(false);
    setPath([]);
  }, [setPath]);

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonRef.current = null;
  }, []);

  console.log('The path state is', path);

  return (
    <div className="App">
      <button className="delete-button" onClick={handleDelete} style={{ display: !isPolygonDrawn && 'none' }}>
        Delete
      </button>
      <LoadScript
        id="script-loader"
        libraries={['drawing']}
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        language="en"
        region="us"
      >
        <GoogleMap
          mapContainerClassName="App-map"
          center={mapCenter}
          zoom={mapZoom}
          version="weekly"
          onLoad={onMapLoad}
        >
          <DrawingManager
            drawingMode={isPolygonDrawn ? null : 'polygon'}
            onPolygonComplete={onLoad}
            options={{
              drawingControl: !isPolygonDrawn,
              drawingControlOptions: {
                position: 2,
                drawingModes: ['polygon'],
              },
              polygonOptions: {
                fillColor: '#2196F3',
                fillOpacity: 0.5,
                strokeWeight: 2,
                strokeColor: '#2196F3',
                clickable: true,
                editable: true,
                draggable: true,
                zIndex: 1,
                onUnmount,
              },
            }}
          />
          {data.map((vehicle) => (
            <React.Fragment key={vehicle.id}>
              <Marker position={vehicle.location} onClick={handleMarkerClick} />
            </React.Fragment>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
