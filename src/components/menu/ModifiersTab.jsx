import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Pagination from '../Pagination';
import StatusToggle from './StatusToggle';
import AddModifierModal from './AddModifierModal';
import EditModifierModal from './EditModifierModal';
import EditModifierItemModal from './EditModifierItemModal';
import AddModifierItemModal from './AddModifierItemModal';
import ModifierItemList from './ModifierItemList';
import { useModifiers } from '../../hooks/useModifiers';
import SelectLocalsModal from '../../pages/MenuManager/components/SelectLocalsModal';
import { useSelector } from 'react-redux';
import { useMultipleLocalsUpdate } from '@/hooks/useMultipleLocalsUpdate';
import { getApiUrls } from '@/config/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";

const ModifiersTab = () => {
  const API_URLS = getApiUrls();
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const localId = useSelector(state => state.auth.localId);
  const accessToken = useSelector(state => state.auth.accessToken);
  const queryClient = useQueryClient();
  
  const { 
    modifiers, 
    filteredModifiers, 
    currentModifiers,
    searchTerm, 
    setSearchTerm,
    currentPage, 
    setCurrentPage,
    expandedModifier, 
    toggleExpandModifier,
    handleAddModifier,
    handleEditModifier,
    handleEditModifierItem,
    handleAddModifierItem,
  } = useModifiers();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingModifier, setEditingModifier] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [addingToModifierId, setAddingToModifierId] = useState(null);

  const {
    handleUpdate,
    handleLocalsSelected,
  } = useMultipleLocalsUpdate({
    itemType: pendingStatusUpdate?.type === 'modifier' ? 'modificadores' : 'modificador-items',
    rId: pendingStatusUpdate?.productId,
    invalidateQueries: [['modifiers']]
  });

  const handleModifierClick = (modifier) => {
    setEditingModifier(modifier);
    setIsEditModalOpen(true);
  };

  const handleItemClick = (item, modifierId) => {
    setEditingItem({ ...item, modifierId });
    setIsEditItemModalOpen(true);
  };

  const handleToggleModifierStatus = async (modifier) => {
    if (localId === "-1") {
      setPendingStatusUpdate({
        productId: modifier.rId,
        newStatus: modifier.active === 0 ? 1 : 0,
        type: 'modifier',
        changes: { status: modifier.active === 0 ? 1 : 0 }
      });
      setIsSelectLocalsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/${modifier._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: modifier.active === 0 ? 1 : 0 })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleToggleItemStatus = async (item, modifierId) => {
    if (localId === "-1") {
      setPendingStatusUpdate({
        productId: item.rId,
        newStatus: item.active === 0 ? 1 : 0,
        type: 'item',
        changes: { status: item.active === 0 ? 1 : 0 }
      });
      setIsSelectLocalsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificador-items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: item.active === 0 ? 1 : 0 })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleLocalsSelectedWrapper = (selectedLocals) => {
    if (!pendingStatusUpdate) return;
    handleUpdate(pendingStatusUpdate.changes);
    handleLocalsSelected(selectedLocals);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Buscar grupo de modificadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
          <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Modificador
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cartaai-white">Grupo</TableHead>
            <TableHead className="text-cartaai-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentModifiers.map((modifier) => (
            <React.Fragment key={modifier.id}>
              <TableRow>
                <TableCell 
                  className="text-cartaai-white cursor-pointer hover:bg-cartaai-white/10"
                  onClick={() => handleModifierClick(modifier)}
                >
                  {modifier.name} ({modifier.items?.length || 0})
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-cartaai-white hover:text-cartaai-red" onClick={() => toggleExpandModifier(modifier.id)}>
                      {expandedModifier === modifier.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <StatusToggle
                      isActive={modifier.active === 1}
                      onToggle={() => handleToggleModifierStatus(modifier)}
                    />
                  </div>
                </TableCell>
              </TableRow>
              {expandedModifier === modifier.id && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <ModifierItemList
                      items={modifier.items || []}
                      modifierId={modifier.id}
                      onToggleItemStatus={handleToggleItemStatus}
                      onEditItem={handleItemClick}
                      onAddItem={() => {
                        setAddingToModifierId(modifier.id);
                        setIsAddItemModalOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredModifiers.length / 10)}
        onPageChange={setCurrentPage}
      />

      <AddModifierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddModifier={handleAddModifier}
      />

      <EditModifierModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditModifier={handleEditModifier}
        modifier={editingModifier}
      />

      <EditModifierItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => setIsEditItemModalOpen(false)}
        onEditModifierItem={handleEditModifierItem}
        item={editingItem}
      />

      <AddModifierItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAddItem={(newItem) => {
          handleAddModifierItem(addingToModifierId, newItem);
          setIsAddItemModalOpen(false);
        }}
        modifierId={addingToModifierId}
      />

      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => {
          setIsSelectLocalsModalOpen(false);
          setPendingStatusUpdate(null);
        }}
        onConfirm={handleLocalsSelectedWrapper}
        title="Seleccionar locales para actualizar"
      />
    </div>
  );
};

export default ModifiersTab;