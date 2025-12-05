import { useState, useEffect } from 'react';
import RestaurantManagement from './RestaurantManagement';
import ApplicationsManagement from './ApplicationsManagement';
import WorkingHours from './WorkingHours';
import Location from '../pages/Location';
import OwnerInfo from './OwnerInfo';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';

const RestaurantSubmodule = ({ selectedModule, selectedSubModule }) => {
  const API_URLS = getApiUrls();
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    if (subDomain && localId) {
      fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/?subDomain=${subDomain}&localId=${localId}`)
        .then(response => response.json())
        .then(data => {
          setBusinessData(data.data);
        })
        .catch(error => {
          console.error('Error al cargar datos:', error);
        });
    }
  }, [subDomain, localId]);

  const renderContent = () => {
    if (selectedModule === 'gestion') {
      return <RestaurantManagement activeSection={selectedSubModule} businessData={businessData} setBusinessData={setBusinessData} />;
    }

    switch (selectedModule) {
      case 'aplicaciones':
        return <ApplicationsManagement />;
      case 'horario':
        return <WorkingHours />;
      case 'ubicacion':
        return <Location />;
      default:
        return <p className="text-cartaai-white">Seleccione un módulo</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="">
        {renderContent()}
      </div>
      {selectedModule === 'gestion' && selectedSubModule === 'info' && (
        <OwnerInfo businessData={businessData} setBusinessData={setBusinessData} />
      )}
    </div>
  );
};

export default RestaurantSubmodule;