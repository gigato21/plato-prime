import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from '@/redux/slices/authSlice';
import { getApiUrls } from '@/config/api';

const IntegrationSetup = () => {
  const API_URLS = getApiUrls();
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

  const [formData, setFormData] = useState({
    subDomain: '',
    name: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: formData.name,
          userId: userId,
          subDomain: formData.subDomain
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la configuración inicial');
      }

      const result = await response.json();

      dispatch(login({
        ...currentUserData,
        subDomain: formData.subDomain,
        localId: result.localId,
        businessName: formData.name
      }));

      toast.success("Configuración inicial completada");
      navigate('/');
    } catch (error) {
      toast.error(error.message || "Error en la configuración inicial");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-cartaai-white text-center mb-8">
        Configuración Inicial para Integración
      </h1>
      
      <div className="max-w-md mx-auto glass-container p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="subDomain" className="text-cartaai-white">
              Subdominio
            </Label>
            <Input
              id="subDomain"
              value={formData.subDomain}
              onChange={(e) => setFormData(prev => ({ ...prev, subDomain: e.target.value }))}
              className="glass-input text-cartaai-white mt-1"
              placeholder="Ej: mirestaurante"
              required
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-cartaai-white">
              Nombre del Negocio
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="glass-input text-cartaai-white mt-1"
              placeholder="Ej: Mi Restaurante S.A.C."
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            Crear Configuración
          </Button>
        </form>
      </div>
    </div>
  );
};

export default IntegrationSetup; 