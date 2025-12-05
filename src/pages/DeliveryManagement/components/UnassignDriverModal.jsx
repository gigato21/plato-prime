import { useState } from "react";
import { useSelector } from "react-redux";
import SelectLocalsModal from "@/pages/MenuManager/components/SelectLocalsModal";

export const UnassignDriverModal = ({ 
    handleUnassignDriver, 
    isLoading, 
    error, 
    onClose, 
    isOpen,
    driver
}) => {
    const [isLocalsModalOpen, setIsLocalsModalOpen] = useState(false);
    const [selectedLocalIds, setSelectedLocalIds] = useState([]);
    const localId = useSelector(state => state.auth.localId);
    const subDomain = useSelector(state => state.auth.subDomain);

    const handleConfirm = async () => {
        try {
            // Determinar qué localIds usar
            let localIdsToUse;
            
            if (localId === "-1") {
                // Validar que se haya seleccionado al menos un local
                if (selectedLocalIds.length === 0) {
                    // Abrir el modal de selección de locales si no hay locales seleccionados
                    setIsLocalsModalOpen(true);
                    return;
                }
                localIdsToUse = selectedLocalIds;
            } else {
                // Si no estamos en localId -1, usamos el localId proporcionado
                localIdsToUse = [localId];
            }
            
            // Llamamos a la función de callback con los localIds
            handleUnassignDriver(driver._id, localIdsToUse);
            onClose();
        } catch (error) {
            console.error("Error al desasignar conductor:", error);
        }
    };

    const handleLocalsSelected = (selectedLocals) => {
        setSelectedLocalIds(selectedLocals);
    };

    if(!isOpen || !driver) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="glass-container rounded-lg p-6 w-full max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h1 className="text-xl font-bold mb-4">Desasignar conductor de local</h1>
                
                <div className="mb-6">
                    <div className="p-4 border border-red-300 rounded-lg bg-red-50/10">
                        <p className="font-medium text-lg mb-1">{driver.firstName} {driver.lastName}</p>
                        <p className="text-gray-600">{driver.phone}</p>
                        {driver.vehicleModel && (
                            <p className="text-sm text-gray-500 mt-1">
                                Vehículo: {driver.vehicleModel} {driver.licensePlate ? `(${driver.licensePlate})` : ''}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Botón para abrir el modal de selección de locales (solo si localId es -1) */}
                {localId === "-1" && (
                    <div className="mb-4">
                        <button
                            onClick={() => setIsLocalsModalOpen(true)}
                            className="w-full p-2 glass-button-blue rounded-md"
                        >
                            {selectedLocalIds.length > 0 
                                ? `${selectedLocalIds.length} local(es) seleccionado(s)` 
                                : "Seleccionar locales"}
                        </button>
                        {selectedLocalIds.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                Haz clic en el botón para cambiar la selección
                            </p>
                        )}
                    </div>
                )}
                
                <div className="mt-6 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="glass-button-blue px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={isLoading || (localId === "-1" && selectedLocalIds.length === 0)}
                        className={`px-4 py-2 rounded-md text-white ${isLoading || (localId === "-1" && selectedLocalIds.length === 0) ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isLoading ? 'Desasignando...' : 'Desasignar conductor'}
                    </button>
                </div>
                
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </div>

            {/* Modal de selección de locales */}
            <SelectLocalsModal
                isOpen={isLocalsModalOpen}
                onClose={() => setIsLocalsModalOpen(false)}
                onConfirm={handleLocalsSelected}
                title="Seleccionar locales para desasignar conductor"
            />
        </div>
    );
}; 