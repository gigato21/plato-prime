import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { toast } from "sonner";

export const useStaffForm = ({ onSuccess, onClose }) => {
  const API_URLS = getApiUrls();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: ''
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/roles`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) throw new Error('Error al obtener roles');
        
        const data = await response.json();
        if (data.type === "1") {
          setRoles(data.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('No se pudieron cargar los roles');
      }
    };

    fetchRoles();
  }, [accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          subDomain
        })
      });

      if (!response.ok) throw new Error('Error al crear usuario');

      const data = await response.json();
      
      if (data.type === "1") {
        toast.success('Usuario creado exitosamente');
        onSuccess(data.data);
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: ''
        });
      } else {
        throw new Error(data.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Error al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    roles,
    isLoading,
    handleInputChange,
    handleRoleChange,
    handleSubmit
  };
};