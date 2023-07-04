import { DrawingManager, GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';
import React, { useContext, useRef } from 'react';
import { VehiclesContext } from '../../context/vehiclesContext';
import VehicleCard from '../VehicleCard';
import './style.css';

const libraries = ['drawing'];

const Map = () => {
  const mapRef = useRef();
  const polygonRefs = useRef([]);
  const activePolygonIndex = useRef();
  const drawingManagerRef = useRef();
  const { polygons, setPolygons, data, mapCenter, setMapCenter, mapZoom, setMapZoom, currentMarker, setCurrentMarker } =
    useContext(VehiclesContext);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
    language: 'en',
  });

  const polygonOptions = {
    fillColor: '#2196F3',
    fillOpacity: 0.5,
    strokeWeight: 2,
    strokeColor: '#2196F3',
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1,
  };

  const drawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [window.google?.maps?.drawing?.OverlayType?.POLYGON],
    },
  };

  const handleMarkerClick = (event, id) => {
    console.log(id);
    const newCenter = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    const newZoom = 15;
    setMapCenter(newCenter);
    setMapZoom(newZoom);
  };

  const onLoadMap = (map) => {
    mapRef.current = map;
  };

  const onLoadPolygon = (polygon, index) => {
    polygonRefs.current[index] = polygon;
  };

  const onClickPolygon = (index) => {
    activePolygonIndex.current = index;
  };

  const onLoadDrawingManager = (drawingManager) => {
    drawingManagerRef.current = drawingManager;
  };

  const onOverlayComplete = ($overlayEvent) => {
    drawingManagerRef.current.setDrawingMode(null);
    if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const newPolygon = $overlayEvent.overlay
        .getPath()
        .getArray()
        .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

      // start and end point should be same for valid geojson
      const startPoint = newPolygon[0];
      newPolygon.push(startPoint);
      $overlayEvent.overlay?.setMap(null);
      setPolygons([...polygons, newPolygon]);
    }
  };

  const onDeleteDrawing = () => {
    const filtered = polygons.filter((polygon, index) => index !== activePolygonIndex.current);
    setPolygons(filtered);
  };

  const onEditPolygon = (index) => {
    const polygonRef = polygonRefs.current[index];
    if (polygonRef) {
      const coordinates = polygonRef
        .getPath()
        .getArray()
        .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

      const allPolygons = [...polygons];
      allPolygons[index] = coordinates;
      setPolygons(allPolygons);
    }
  };

  return isLoaded ? (
    <div className="App" style={{ position: 'relative' }}>
      {drawingManagerRef.current && (
        <div onClick={onDeleteDrawing} title="Delete shape" className="delete-button">
          Delete
        </div>
      )}
      <GoogleMap
        mapContainerClassName="App-map"
        zoom={mapZoom}
        center={mapCenter}
        onLoad={onLoadMap}
        onTilesLoaded={() => setMapCenter(null)}
      >
        <DrawingManager
          onLoad={onLoadDrawingManager}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
        {polygons.map((iterator, index) => (
          <Polygon
            key={index}
            onLoad={(event) => onLoadPolygon(event, index)}
            onMouseDown={() => onClickPolygon(index)}
            onMouseUp={() => onEditPolygon(index)}
            onDragEnd={() => onEditPolygon(index)}
            options={polygonOptions}
            paths={iterator}
            draggable
            editable
          />
        ))}
        {data.map((vehicle) => (
          <React.Fragment key={vehicle.id}>
            <Marker position={vehicle.location} onClick={handleMarkerClick} />
            {currentMarker === vehicle.id && (
              <InfoWindow
                options={{ minWidth: '10rem' }}
                position={vehicle.location}
                onCloseClick={() => setCurrentMarker(null)}
              >
                <div className="info-window ">
                  <VehicleCard vehicle={vehicle} />
                </div>
              </InfoWindow>
            )}
          </React.Fragment>
        ))}
      </GoogleMap>
    </div>
  ) : null;
};

export default Map;
