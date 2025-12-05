import { getApiUrls } from "@/config/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SelectLocalsModal from "@/pages/MenuManager/components/SelectLocalsModal";

export const AssignDriveModal = ({ 
    handleAssignDriver, 
    isLoading, 
    error, 
    onClose, 
    isOpen
}) => {
    const url = getApiUrls().SERVICIOS_GENERALES_URL;
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchByPhone, setSearchByPhone] = useState(false);
    const [isLocalsModalOpen, setIsLocalsModalOpen] = useState(false);
    const [selectedLocalIds, setSelectedLocalIds] = useState([]);
    const localId = useSelector(state => state.auth.localId);
    const subDomain = useSelector(state => state.auth.subDomain);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
            const response = await fetch(`${url}/api/v1/delivery/drivers`);
            const data = await response.json();
                setDrivers(data.data);
                setFilteredDrivers(data.data);
            } catch (error) {
                console.error("Error al obtener conductores:", error);
            }
        }
        
        fetchDrivers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredDrivers(drivers);
            return;
        }

        const filtered = drivers.filter(driver => {
            if (searchByPhone) {
                return driver.phone.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase());
            }
        });
        
        setFilteredDrivers(filtered);
    }, [searchTerm, searchByPhone, drivers]);

    const handleSelectDriver = (driver) => {
        setSelectedDriver(driver);
    };

    const handleConfirm = async () => {
        if (selectedDriver) {
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
                
                // Si todo sale bien, llamamos a la función de callback con los localIds
                handleAssignDriver(selectedDriver._id, localIdsToUse);
                onClose();
            } catch (error) {
                console.error("Error al asignar conductor:", error);
            }
        }
    };

    const handleLocalsSelected = (selectedLocals) => {
        setSelectedLocalIds(selectedLocals);
    };

    if(!isOpen) return null;

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
                
                <h1 className="text-xl font-bold mb-4">Asignar conductor a local</h1>
                
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
                
                {/* Barra de búsqueda con switch de dos cajitas */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">
                            Buscar por:
                        </label>
                        <div className="flex rounded-md overflow-hidden border border-blue-300">
                            <button
                                onClick={() => setSearchByPhone(false)}
                                className={`px-3 py-1 text-sm transition-colors duration-200 ${!searchByPhone ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                            >
                                Nombre
                            </button>
                            <button
                                onClick={() => setSearchByPhone(true)}
                                className={`px-3 py-1 text-sm transition-colors duration-200 ${searchByPhone ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                            >
                                Teléfono
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={searchByPhone ? "Buscar por teléfono..." : "Buscar por nombre..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 glass-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                
                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                    {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                            <div 
                                key={driver._id} 
                                className={`p-3 rounded-lg cursor-pointer ${selectedDriver?._id === driver._id 
                                    ? 'border-2 border-blue-500 bg-blue-500/10 shadow-lg' 
                                    : 'glass-container border border-red-300'}`}
                                onClick={() => handleSelectDriver(driver)}
                            >
                                <div className={`${selectedDriver?._id === driver._id ? 'pl-2 border-l-4 border-blue-500' : ''}`}>
                                    <p className="font-medium">{driver.firstName} {driver.lastName}</p>
                                    <p className="text-gray-600">{driver.phone}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No se encontraron conductores</p>
                    )}
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="glass-button-blue px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={(!selectedDriver || isLoading) || (localId === "-1" && selectedLocalIds.length === 0)}
                        className={`px-4 py-2 rounded-md text-white ${(!selectedDriver || isLoading) || (localId === "-1" && selectedLocalIds.length === 0) ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoading ? 'Asignando...' : 'Asignar conductor'}
                    </button>
                </div>
                
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </div>

            {/* Modal de selección de locales */}
            <SelectLocalsModal
                isOpen={isLocalsModalOpen}
                onClose={() => setIsLocalsModalOpen(false)}
                onConfirm={handleLocalsSelected}
                title="Seleccionar locales para asignar conductor"
            />
    </div>
  );
};
