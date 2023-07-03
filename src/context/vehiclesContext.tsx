import axios from 'axios';
import { createContext, useState } from 'react';
import { useQuery } from 'react-query';

export const VehiclesContext = createContext({} as any);

export const VehiclesProvider = ({ children }: any) => {
  const [path, setPath] = useState([
    { lat: 51.475982818027006, lng: -0.1463526032999951 },
    { lat: 51.43727207393747, lng: -0.17426174636640201 },
    { lat: 51.440151216120285, lng: -0.10566885696210448 },
  ]);
  const [mapCenter, setMapCenter] = useState({ lat: 51.452668733334455, lng: -0.14326269851483886 });
  const [mapZoom, setMapZoom] = useState(13);

  const { isLoading, error, data } = useQuery('vehicles', async () => {
    const response = await axios.get('https://autofleet-challenge.onrender.com/');
    return response.data;
  });

  const value = { isLoading, error, data, path, setPath, mapCenter, setMapCenter, mapZoom, setMapZoom };

  return <VehiclesContext.Provider value={value}>{!isLoading && children}</VehiclesContext.Provider>;
};
