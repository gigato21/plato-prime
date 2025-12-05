import { useEffect, useState } from 'react';
import { getDrivers, deleteDriver } from '../services/driversService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import EditDriverForm from './EditDriverForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    loadDrivers();
    loadCompanies();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await getDrivers();
      const sortedDrivers = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setDrivers(sortedDrivers);
    } catch (error) {
      console.error('Error al cargar conductores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await fetch('delivery/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDriver(driverToDelete._id);
      await loadDrivers(); // Recargar la lista
      setDriverToDelete(null); // Cerrar el diálogo
    } catch (error) {
      console.error('Error al eliminar conductor:', error);
    }
  };

  if (loading) return <div className="text-white">Cargando...</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Nombre</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Teléfono</TableHead>
            <TableHead className="text-white">Vehículo</TableHead>
            <TableHead className="text-white">Placa</TableHead>
            <TableHead className="text-white">Empresa</TableHead>
            <TableHead className="text-white">Estado</TableHead>
            <TableHead className="text-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver._id}>
              <TableCell className="text-white">{`${driver.firstName} ${driver.lastName}`}</TableCell>
              <TableCell className="text-white">{driver.email}</TableCell>
              <TableCell className="text-white">{driver.phone}</TableCell>
              <TableCell className="text-white">{driver.vehicleModel}</TableCell>
              <TableCell className="text-white">{driver.licensePlate}</TableCell>
              <TableCell className="text-white">{driver.company?.name || 'Sin empresa'}</TableCell>
              <TableCell className="text-white">{driver.active ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setEditingDriver(driver)}
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    onClick={() => setDriverToDelete(driver)}
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingDriver && (
        <EditDriverForm
          driver={editingDriver}
          companies={companies}
          isOpen={!!editingDriver}
          onClose={() => setEditingDriver(null)}
          onSuccess={loadDrivers}
        />
      )}

      <AlertDialog open={!!driverToDelete} onOpenChange={() => setDriverToDelete(null)}>
        <AlertDialogContent className="glass-container-no-blur">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              ¿Estás seguro que deseas eliminar al conductor {driverToDelete?.firstName} {driverToDelete?.lastName}? 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-button bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/20 text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="glass-button bg-red-500/20 hover:bg-red-500/30 border-red-500/20 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DriversList; 