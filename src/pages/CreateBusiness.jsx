import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProgressSteps from '@/components/create-business/ProgressSteps';
import BasicInfoStep from '@/components/create-business/BasicInfoStep';
import LocationContactStep from '@/components/create-business/LocationContactStep';
import CriticalConfigStep from '@/components/create-business/CriticalConfigStep';
import TaxConfigStep from '@/components/create-business/TaxConfigStep';
import NextStepsModal from '@/components/create-business/NextStepsModal';
import { createBusiness } from '@/services/businessService';
import { login } from '@/redux/slices/authSlice';

const CreateBusiness = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userId = useSelector((state) => state.auth.userData?.id);
  const currentUserData = useSelector((state) => ({
    accessToken: state.auth.accessToken,
    _id: state.auth.userData?.id,
    name: state.auth.userData?.name,
    email: state.auth.userData?.email,
    phone: state.auth.userData?.phone,
    role: state.auth.role
  }));
  const [currentStep, setCurrentStep] = useState(1);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [formData, setFormData] = useState({
    subdominio: '',
    linkDominio: '',
    localId: '',
    localNombreComercial: '',
    localDescripcion: '',
    localDireccion: '',
    localDepartamento: '',
    localProvincia: '',
    localDistrito: '',
    localTelefono: '',
    localWpp: '',
    phoneCountryCode: '+51',
    wppCountryCode: '+51',
    localAceptaDelivery: "1",
    localAceptaRecojo: "1",
    localAceptaPagoEnLinea: "1",
    localSoloPagoEnLinea: "0",
    localPorcentajeImpuesto: 18,
  });

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.subdominio || formData.subdominio.length < 3 || formData.subdominio.length > 20) {
          toast.error("El subdominio debe tener entre 3 y 20 caracteres");
          return false;
        }
        if (!formData.linkDominio || formData.linkDominio.length < 3 || formData.linkDominio.length > 60) {
          toast.error("El dominio debe tener entre 3 y 60 caracteres");
          return false;
        }
        if (!formData.localNombreComercial || formData.localNombreComercial.length < 3 || formData.localNombreComercial.length > 50) {
          toast.error("El nombre comercial debe tener entre 3 y 50 caracteres");
          return false;
        }
        if (formData.localDescripcion && formData.localDescripcion.length > 255) {
          toast.error("La descripción no puede exceder los 255 caracteres");
          return false;
        }
        break;
      case 2:
        if (!formData.localDireccion || formData.localDireccion.length > 255) {
          toast.error("La dirección es requerida y no puede exceder los 255 caracteres");
          return false;
        }
        if (!formData.localDepartamento) {
          toast.error("El departamento es requerido");
          return false;
        }
        if (!formData.localProvincia) {
          toast.error("La provincia es requerida");
          return false;
        }
        if (!formData.localDistrito) {
          toast.error("El distrito es requerido");
          return false;
        }
        if (!formData.localTelefono || formData.localTelefono.length > 15) {
          toast.error("El teléfono es requerido y no puede exceder los 15 caracteres");
          return false;
        }
        if (!formData.localWpp || formData.localWpp.length > 15) {
          toast.error("El WhatsApp es requerido y no puede exceder los 15 caracteres");
          return false;
        }
        break;
      case 3:
        // Critical config validations are boolean and don't need explicit validation
        break;
      case 4:
        if (typeof formData.localPorcentajeImpuesto !== 'number' || formData.localPorcentajeImpuesto < 0) {
          toast.error("El porcentaje de impuesto debe ser un número válido");
          return false;
        }
        break;
    }
    return true;
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      const businessData = {
        subdominio: formData.subdominio,
        linkDominio: formData.linkDominio,
        localNombreComercial: formData.localNombreComercial,
        localDescripcion: formData.localDescripcion,
        localDireccion: formData.localDireccion,
        localDepartamento: formData.localDepartamento,
        localProvincia: formData.localProvincia,
        localDistrito: formData.localDistrito,
        localTelefono: formData.phoneCountryCode + ' ' + formData.localTelefono,
        localWpp: formData.wppCountryCode + ' ' + formData.localWpp,
        localAceptaRecojo: formData.localAceptaRecojo === "1",
        localAceptaPagoEnLinea: formData.localAceptaPagoEnLinea === "1",
        localPorcentajeImpuesto: Number(formData.localPorcentajeImpuesto),
        estaAbiertoParaDelivery: true,
        estaAbiertoParaRecojo: true
      };

      const result = await createBusiness(businessData, accessToken, userId);
      
      dispatch(login({ 
        ...currentUserData,
        localId: result.business.localId,
        subDomain: businessData.subdominio,
        businessName: businessData.localNombreComercial
      }));

      toast.success("Negocio creado exitosamente");
      setShowNextSteps(true);
    } catch (error) {
      toast.error(error.message || "Error al crear el negocio");
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-cartaai-white text-center mb-8">
        Configure su Negocio
      </h1>
      
      <div className="max-w-4xl mx-auto glass-container p-6">
        <ProgressSteps currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 1 && (
            <BasicInfoStep 
              data={formData} 
              updateData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <LocationContactStep
              data={formData}
              updateData={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <CriticalConfigStep
              data={formData}
              updateData={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <TaxConfigStep
              data={formData}
              updateData={updateFormData}
            />
          )}
        </div>

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <Button 
              onClick={handlePreviousStep}
              variant="outline"
              className="text-cartaai-white border-cartaai-white/20 hover:bg-cartaai-white/5"
            >
              Anterior
            </Button>
          )}
          <div className="flex-1" />
          <Button 
            onClick={handleNextStep}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            {currentStep === 4 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      </div>

      <NextStepsModal 
        isOpen={showNextSteps} 
        onClose={() => {
          setShowNextSteps(false);
          navigate('/');
        }} 
      />
    </div>
  );
};

export default CreateBusiness;
