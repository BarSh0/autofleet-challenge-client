import React, { useState } from 'react';
import { useQuery } from 'react-query';
import VehicleCard from '../../components/VehicleCard';
import { VehiclesContext } from '../../context/vehiclesContext';
import axiosinstance from '../../utils/axios';
import './style.css';

type Vehicle = {
  id: string;
  state: string;
  distance: number;
  seats: number;
  location: {
    lat: number;
    lng: number;
  };
  class: {
    name: string;
  };
};

const Sidebar = () => {
  const { polygons } = React.useContext(VehiclesContext);
  const [sortedData, setSortedData] = useState<Vehicle[] | null>(null);
  const [, setSortOption] = useState<'default' | 'ascending' | 'descending'>('default');
  const { isLoading, error, data, refetch } = useQuery('vehiclesByPolygon', async () => {
    const response = await axiosinstance.post('by-polygon', { polygons });
    return response.data;
  });

  React.useEffect(() => {
    refetch();
  }, [polygons, refetch]);

  const sortByStatus = (option: 'default' | 'ascending' | 'descending') => {
    let sortedByStatus = [...data];
    if (option === 'default') {
      setSortedData(null);
    } else {
      sortedByStatus.sort((a, b) => {
        if (option === 'ascending') {
          return a.state.localeCompare(b.state);
        } else {
          return b.state.localeCompare(a.state);
        }
      });
      setSortedData(sortedByStatus);
    }
    setSortOption(option);
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error</p>;

  return (
    <div className="sidebar">
      <h3>Selected Vehicles: {data.length}</h3>
      <div className="sidebar-header">
        <button onClick={() => sortByStatus('default')}>DEFAULT</button>
        <button onClick={() => sortByStatus('ascending')}>IN-RIDE</button>
        <button onClick={() => sortByStatus('descending')}>ONLINE</button>
      </div>
      <ul>
        {sortedData
          ? sortedData.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
          : data.map((vehicle: Vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
      </ul>
    </div>
  );
};

export default Sidebar;
