import { useState, useEffect } from 'react';
import { getApiUrls } from '../config/api';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";

export const getModifiers = async (accessToken, subDomain, localId) => {
  const API_URLS = getApiUrls();
  if(!subDomain) subDomain = useSelector((state) => state.auth.subDomain);
  if(!localId) localId = useSelector((state) => state.auth.localId);
  if(!accessToken) accessToken = useSelector((state) => state.auth.accessToken);
  
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/get-all/${subDomain}/${localId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    if (!response.ok) throw new Error('Error al obtener modificadores');
    return response.json();
  } catch (error) {
    console.error('Error fetching modifiers:', error);
    return [];
  }
};

export const useModifiers = () => {
  const API_URLS = getApiUrls();
  const accessToken = useSelector(state => state.auth.accessToken);
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const queryClient = useQueryClient();
  const [modifiers, setModifiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedModifier, setExpandedModifier] = useState(null);

  const { data: modifiersData = [] } = useQuery({
    queryKey: ['modifiers', subDomain, localId],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener los modificadores');
      const data = await response.json();
      return data;
    }
  });

  useEffect(() => {
    setModifiers(modifiersData);
  }, [modifiersData]);

  const toggleExpandModifier = (id) => {
    setExpandedModifier(expandedModifier === id ? null : id);
  };

  return {
    modifiers,
    filteredModifiers: modifiers.filter(mod => 
      mod.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    currentModifiers: modifiers
      .filter(mod => mod.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice((currentPage - 1) * 10, currentPage * 10),
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    expandedModifier,
    toggleExpandModifier,
  };
};
