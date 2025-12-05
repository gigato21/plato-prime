
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrls } from '@/config/api';
import { toast } from "sonner";

export const useMultipleLocalsUpdate = ({ itemType, rId, invalidateQueries = [] }) => {
  const API_URLS = getApiUrls();
  const queryClient = useQueryClient();
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  
  const accessToken = useSelector((state) => state.auth.accessToken);
  const localId = useSelector((state) => state.auth.localId);
  const subDomain = useSelector((state) => state.auth.subDomain);

  const updateMutation = useMutation({
    mutationFn: async ({ localIds, changes }) => {
      if (!rId) {
        throw new Error('rId is required for multiple local updates');
      }

      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/update-multiple-local/${itemType}/${rId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ localIds, changes, subDomain }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Actualización exitosa');
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      setIsSelectLocalsModalOpen(false);
      setPendingUpdate(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar');
    }
  });

  const handleUpdate = (changes) => {
    if (localId === "-1") {
      setIsSelectLocalsModalOpen(true);
      setPendingUpdate(changes);
      return;
    }
    
    if (!rId) {
      console.error('rId is required for updates');
      return;
    }

    updateMutation.mutate({ 
      localIds: [localId], 
      changes 
    });
  };

  const handleLocalsSelected = (selectedLocals) => {
    if (!pendingUpdate || !rId) return;
    
    updateMutation.mutate({
      localIds: selectedLocals,
      changes: pendingUpdate
    });
  };

  return {
    isSelectLocalsModalOpen,
    setIsSelectLocalsModalOpen,
    handleUpdate,
    handleLocalsSelected,
    isLoading: updateMutation.isPending,
    isError: updateMutation.isError,
    error: updateMutation.error,
    isSuccess: updateMutation.isSuccess
  };
};
