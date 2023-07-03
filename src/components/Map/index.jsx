import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import React, { useCallback, useContext, useRef } from 'react';
import { VehiclesContext } from '../../context/vehiclesContext';
import './style.css';

const Map = () => {
  const { path, setPath, data, mapCenter, setMapCenter, mapZoom, setMapZoom } = useContext(VehiclesContext);

  const handleMarkerClick = (event) => {
    const newCenter = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    const newZoom = 15;
    setMapCenter(newCenter);
    setMapZoom(newZoom);
  };
  const polygonRef = useRef(null);
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
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener('set_at', onEdit),
        path.addListener('insert_at', onEdit),
        path.addListener('remove_at', onEdit)
      );
    },
    [onEdit]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonRef.current = null;
  }, []);

  console.log('The path state is', path);
  console.log(process.env.REACT_APP_GOOGLE_API_KEY);
  return (
    <div className="App">
      <LoadScript id="script-loader" googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} language="en" region="us">
        <GoogleMap
          mapContainerClassName="App-map"
          center={mapCenter}
          zoom={mapZoom}
          version="weekly"
          onLoad={onMapLoad}
        >
          <Polygon
            editable
            draggable
            path={path}
            onMouseUp={onEdit}
            onDragEnd={onEdit}
            onLoad={onLoad}
            onUnmount={onUnmount}
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
