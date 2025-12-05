import { useEffect, useState } from 'react';
import RestaurantInfo from './RestaurantInfo';
import OrderSettings from './OrderSettings';
import PaymentInfo from './PaymentInfo';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import ServiceOptions from './restaurant/ServiceOptions';
import SaveButton from './restaurant/SaveButton';
import { toast } from 'sonner';

const RestaurantManagement = ({ activeSection }) => {
  const API_URLS = getApiUrls();
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const [businessData, setBusinessData] = useState(null);
  
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    branchName: '',
    phoneCountryCode: '51',
    pickupInStore: true,
    dineIn: true,
    delivery: true,
    freeShipping: false,
    disableStore: false,
    minOrder: 20,
    prepTime: 30,
    restaurantImage: 'https://res.cloudinary.com/dkdsfv4ov/image/upload/v1730463938/cartaai/Logo_Carta_AI_590x400_tj64ro.jpg',
    coverImage: 'https://res.cloudinary.com/dkdsfv4ov/image/upload/v1730463938/cartaai/Banner_Carta_AI_2000x1000_h6ue8p.jpg',
    estaAbiertoParaSalon: false,
    localPermiteBoleta: false,
    localPermiteFactura: false,
  });

  const [whatsappData, setWhatsappData] = useState({
    countryCode: '51',
    whatsappPhone: ''
  });

  useEffect(() => {
    if (subDomain && localId) {
      fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/?subDomain=${subDomain}&localId=${localId}`)
        .then(response => response.json())
        .then(data => {
          setBusinessData((prevData) => ({
            ...prevData,
            ...data.data,
          }));

          const phoneNumber = data.data.localTelefono || '';
          const phoneCountryCode = phoneNumber.startsWith('+') ? 
            phoneNumber.slice(0, 3) : '51';
          const phone = phoneNumber.startsWith('+') ? 
            phoneNumber.slice(3) : phoneNumber;

          setRestaurantData((prevData) => ({
            ...prevData,
            name: data.data.localNombreComercial || '',
            description: data.data.localDescripcion || '',
            address: data.data.localDireccion || '',
            phone: phone,
            branchName: data.data.branchName || '',
            phoneCountryCode: phoneCountryCode,
            pickupInStore: data.data.localPickupInStore === 'true',
            dineIn: data.data.localDineIn === 'true',
            delivery: data.data.localDelivery === 'true',
            freeShipping: data.data.localFreeShipping === 'true',
            disableStore: data.data.localDisableStore === 'true',
            minOrder: data.data.localMinOrder || 20,
            prepTime: data.data.localPrepTime || 30,
            restaurantImage: data.data.localLogo || prevData.restaurantImage,
            coverImage: data.data.localImagen || prevData.coverImage,
            localMontoMinimo: data.data.localMontoMinimo,
            localTiempoMinimoDelivery: data.data.localTiempoMinimoDelivery,
            estaAbiertoParaDelivery: data.data.estaAbiertoParaDelivery === true,
            estaAbiertoParaRecojo: data.data.estaAbiertoParaRecojo === true,
            estaAbiertoParaProgramarPedidos: data.data.estaAbiertoParaProgramarPedidos === true,
            localPagoTransferenciaMenuOnline: data.data.localPagoTransferenciaMenuOnline === true,
            localAceptaTarjetaPorDelivery: data.data.localAceptaTarjetaPorDelivery === true,
            localAceptaEfectivoPorDelivery: data.data.localAceptaEfectivoPorDelivery === true,
            estaAbiertoParaSalon: data.data.estaAbiertoParaSalon === true,
            localPermiteBoleta: data.data.localPermiteBoleta === true,
            localPermiteFactura: data.data.localPermiteFactura === true,
          }));


          const whatsappNumber = data.data.localWpp || '';
          const whatsappCountryCode = whatsappNumber.startsWith('+') ? 
            whatsappNumber.slice(0, 3) : '51';
          const whatsappPhone = whatsappNumber.startsWith('+') ? 
            whatsappNumber.slice(3) : whatsappNumber;

          setWhatsappData({
            countryCode: whatsappCountryCode,
            whatsappPhone: whatsappPhone
          });

          setPaymentData({
            cuentasBancarias: data.data.cuentasBancarias || []
          });
        })
        .catch(error => {
          console.error('Error al obtener los datos de la empresa:', error);
          toast.error('Error al obtener los datos de la empresa');
        });
    }
  }, [subDomain, localId]);

  const [paymentData, setPaymentData] = useState({
    cuentasBancarias: []
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isActiveError, setIsActiveError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsSaved(false);
    setIsActiveError(false);
    setIsLoading(true);
    
    const formData = new FormData();
    
    if (restaurantData.restaurantImageFile) {
      formData.append('logo', restaurantData.restaurantImageFile);
    }
    if (restaurantData.coverImageFile) {
      formData.append('cover', restaurantData.coverImageFile);
    }

    const mappedData = {
      localNombreComercial: restaurantData.name,
      localDescripcion: restaurantData.description,
      branchName: restaurantData.branchName,
      localDireccion: restaurantData.address,
      localTelefono: `${restaurantData.phoneCountryCode}${restaurantData.phone}`,
      localMontoMinimo: restaurantData.localMontoMinimo,
      localTiempoMinimoDelivery: restaurantData.localTiempoMinimoDelivery,
      localLogo: restaurantData.restaurantImage,
      localImagen: restaurantData.coverImage,
      localWpp: `${whatsappData.countryCode}${whatsappData.whatsappPhone}`,
      localAceptaEfectivoPorDelivery: restaurantData.localAceptaEfectivoPorDelivery === true,
      cuentasBancarias: paymentData.cuentasBancarias || [],
      estaAbiertoParaDelivery: restaurantData.estaAbiertoParaDelivery === true,
      estaAbiertoParaRecojo: restaurantData.estaAbiertoParaRecojo === true,
      estaAbiertoParaProgramarPedidos: restaurantData.estaAbiertoParaProgramarPedidos === true,
      localPagoTransferenciaMenuOnline: restaurantData.localPagoTransferenciaMenuOnline === true,
      localAceptaTarjetaPorDelivery: restaurantData.localAceptaTarjetaPorDelivery === true,
      estaAbiertoParaSalon: restaurantData.estaAbiertoParaSalon === true,
      localPermiteBoleta: restaurantData.localPermiteBoleta === true,
      localPermiteFactura: restaurantData.localPermiteFactura === true,
    };

    formData.append('data', JSON.stringify(mappedData));

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/update/${subDomain}/${localId}`, {
        method: 'PATCH',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }
      setIsSaved(true);
      toast.success('Datos actualizados correctamente');
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);

    } catch (error) {
      setIsActiveError(true);
      console.error('Error en la solicitud:', error);
      toast.error('Error al actualizar los datos');
      
      setTimeout(() => {
        setIsActiveError(false);
      }, 3000);

    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (name) => {
    setRestaurantData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="space-y-8 p-6 text-cartaai-white">
      {activeSection === 'info' && (
        <div className="space-y-8 animate-fade-in">
          <RestaurantInfo 
            restaurantData={restaurantData} 
            setRestaurantData={setRestaurantData}
            whatsappData={whatsappData}
            setWhatsappData={setWhatsappData}
          />
        </div>
      )}
      
      {activeSection === 'config' && (
        <div className="animate-fade-in">
          <OrderSettings 
            restaurantData={restaurantData} 
            setRestaurantData={setRestaurantData} 
          />
        </div>
      )}
      
      {activeSection === 'staff' && (
        <div className="animate-fade-in">
          <ServiceOptions 
            restaurantData={restaurantData}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>
      )}
      
      {activeSection === 'payments' && (
        <div className="animate-fade-in">
          <PaymentInfo
            paymentData={paymentData}
            setPaymentData={setPaymentData}
          />
        </div>
      )}

      <SaveButton 
        onSave={handleSave}
        isSaved={isSaved}
        isActiveError={isActiveError}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RestaurantManagement; 