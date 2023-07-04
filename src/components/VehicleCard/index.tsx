import React from 'react';
import Image from '../../assets/images/vehicle.png';
import { VehiclesContext } from '../../context/vehiclesContext';
import './style.css';

type VehicleCardProps = {
  vehicle: any;
};

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const { setMapCenter, setMapZoom, setCurrentMarker } = React.useContext(VehiclesContext);

  const handleOnClick = () => {
    setCurrentMarker(vehicle.id);
    setMapCenter({ lat: vehicle.location.lat, lng: vehicle.location.lng });
    setMapZoom(15);
  };
  return (
    <li key={vehicle.id} onClick={handleOnClick}>
      <div className="card-header">
        <div className="card-icon">
          <img src={Image} width={'60rem'} alt={vehicle.state} />
          <p>Class: {vehicle.class.name}</p>
        </div>
        <p className={vehicle.state}>{vehicle.state}</p>
      </div>
      <div className="card-header">
        <p>Distance: {vehicle.distance}</p>
        <p>
          <b>{vehicle.seats}</b> Seats
        </p>
      </div>
    </li>
  );
};

export default VehicleCard;
