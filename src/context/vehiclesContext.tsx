import { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import axiosinstance from '../utils/axios';

export const VehiclesContext = createContext({} as any);

export const VehiclesProvider = ({ children }: any) => {
  const [polygons, setPolygons] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 51.452668733334455, lng: -0.14326269851483886 });
  const [mapZoom, setMapZoom] = useState(13);
  const [currentMarker, setCurrentMarker] = useState(null);

  const { isLoading, error, data } = useQuery('vehicles', async () => {
    const response = await axiosinstance.get('');
    return response.data;
  });

  const value = {
    isLoading,
    error,
    data,
    polygons,
    setPolygons,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    currentMarker,
    setCurrentMarker,
  };

  return <VehiclesContext.Provider value={value}>{!isLoading && children}</VehiclesContext.Provider>;
};
