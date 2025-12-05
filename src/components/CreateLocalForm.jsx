import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Link, Search } from 'lucide-react';
import { toast } from "sonner";
import { getApiUrls } from '@/config/api';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login } from '../redux/slices/authSlice';

const CreateLocalForm = ({ onClose, onCancel }) => {
  const currentSubDomain = useSelector((state) => state.auth.subDomain); // Obtener subdominio actual del store
  const API_URLS = getApiUrls();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState('choice'); // 'choice', 'new', 'connect', 'select'
  const [formData, setFormData] = useState({
    name: '',
    subDomain: currentSubDomain || '',
    subdominio: currentSubDomain || '',
    linkDominio: '',
    localNombreComercial: '',
    localDescripcion: '',
    localDireccion: '',
    localDepartamento: '',
    localProvincia: '',
    localDistrito: '',
    localTelefono: '',
    localWpp: '',
    localAceptaRecojo: true,
    localAceptaPagoEnLinea: true,
    localPorcentajeImpuesto: 18,
    estaAbiertoParaDelivery: true,
    estaAbiertoParaRecojo: true
  });
  const [locals, setLocals] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const userId = useSelector((state) => state.auth.userData?.id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
      ...prev,
      [name]: value
      };
      
      // Si se está modificando el subdominio, actualizar automáticamente el linkDominio
      if (name === 'subDomain') {
        newData.linkDominio = `${value}.cartaai.pe`;
        newData.subdominio = value; // También actualizamos el subdominio
      }
      
      return newData;
    });
  };

  const searchLocals = async () => {
    if (!formData.subDomain) {
      toast.error('Ingresa un subdominio para buscar');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/locals/${formData.subDomain}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (data.type === "1") {
        setLocals(data.data.filter(local => local.localId !== "-1")); // Filtramos el local -1
        setStep('select');
      } else {
        toast.error('No se encontraron locales con ese subdominio');
      }
    } catch (error) {
      toast.error('Error al buscar locales');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (step === 'new') {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/v2/create-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            subdominio: formData.subDomain,
            linkDominio: formData.linkDominio,
            localNombreComercial: formData.name,
            localDescripcion: formData.localDescripcion,
            localDireccion: formData.localDireccion,
            localDepartamento: formData.localDepartamento,
            localProvincia: formData.localProvincia,
            localDistrito: formData.localDistrito,
            localTelefono: formData.localTelefono,
            localWpp: formData.localWpp,
            localAceptaRecojo: formData.localAceptaRecojo,
            localAceptaPagoEnLinea: formData.localAceptaPagoEnLinea,
            localSoloPagoEnLinea: formData.localSoloPagoEnLinea,
            localPorcentajeImpuesto: formData.localPorcentajeImpuesto,
            estaAbiertoParaDelivery: formData.estaAbiertoParaDelivery,
            estaAbiertoParaRecojo: formData.estaAbiertoParaRecojo
        })
      });

      const data = await response.json();

      if (data.type === "1") {
          dispatch(login({
            isAuthenticated: true,
            accessToken: accessToken,
            _id: userId,
            name: formData.name,
            email: data.data.email,
            phone: data.data.phone,
            role: 'admin',
            subDomain: formData.subDomain,
            localId: data.data.business.localId,
            businessName: formData.name
          }));

        toast.success('Local creado exitosamente');
        onClose();
          navigate('/');
        } else {
          toast.error(data.message || 'Error al crear el local');
        }
      } else {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/new-local`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(
            step === 'new' 
              ? {
                  name: formData.name,
                  userId,
                  subDomain: formData.subDomain
                }
              : {
                  address: selectedLocal.localDireccion,
                  userId,
                  subDomain: selectedLocal.subdominio,
                  localIdToClone: selectedLocal.localId
                }
          )
        });

        const data = await response.json();

        if (data.name) {
          dispatch(login({
            isAuthenticated: true,
            accessToken: accessToken,
            _id: userId,
            name: selectedLocal.localNombreComercial,
            role: 'admin',
            subDomain: selectedLocal.subdominio,
            localId: selectedLocal.localId,
            businessName: selectedLocal.localNombreComercial
          }));

          toast.success('Conexión establecida exitosamente');
          onClose();
          navigate('/');
        } else {
          toast.error(data.message || 'Error al procesar la solicitud');
        }
      }
    } catch (error) {
      toast.error('Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'select') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-cartaai-white">
            Seleccionar Local
          </h2>
          <p className="text-gray-400">
            Elige el local al que deseas conectarte
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {locals.map((local) => (
            <Card
              key={local.localId}
              className={`p-4 cursor-pointer transition-all duration-300 border ${
                selectedLocal?.localId === local.localId
                  ? 'border-cartaai-red bg-cartaai-red/10'
                  : 'border-cartaai-white/10 hover:bg-cartaai-white/5'
              }`}
              onClick={() => setSelectedLocal(local)}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-cartaai-white">
                    {local.localNombreComercial}
                  </h3>
                  <span className="text-sm px-2 py-1 rounded bg-cartaai-white/10 text-cartaai-white">
                    ID: {local.localId}
                  </span>
                </div>
                <p className="text-sm text-cartaai-white/60">
                  {local.localDireccion}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setStep('choice')}
            className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
          >
            Atrás
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedLocal || isSubmitting}
            className="bg-cartaai-red hover:bg-cartaai-red/80"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Conectando...
              </div>
            ) : 'Conectar'}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'choice') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-cartaai-white">
            Crear nuevo local
          </h2>
          <p className="text-gray-400">
            Elige cómo quieres configurar tu local
          </p>
        </div>

        <div className="grid gap-4">
          <Card 
            className="p-4 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
            onClick={() => setStep('new')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-cartaai-red/10 rounded-full">
                <Store className="w-6 h-6 text-cartaai-red" />
              </div>
              <div>
                <h3 className="font-semibold text-cartaai-white">Crear local nuevo</h3>
                <p className="text-sm text-cartaai-white/60">
                  Crea un local completamente nuevo
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
            onClick={() => {
              if (!currentSubDomain) {
                toast.error('Primero debes establecer un subdominio');
                return;
              }
              setFormData(prev => ({...prev, subDomain: currentSubDomain}));
              searchLocals();
              setStep('select');
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-cartaai-red/10 rounded-full">
                <Link className="w-6 h-6 text-cartaai-red" />
              </div>
              <div>
                <h3 className="font-semibold text-cartaai-white">Conectar con local existente</h3>
                <p className="text-sm text-cartaai-white/60">
                  Conecta con un local ya creado usando su subdominio
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'new') {
    return (
      <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="mx-auto bg-cartaai-red/10 p-3 rounded-full w-fit">
            <Store className="w-8 h-8 text-cartaai-red" />
          </div>
          <h2 className="text-2xl font-bold text-cartaai-white">
            Crear nuevo local
          </h2>
        </div>

        <div className="space-y-4">
          {/* Información básica */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-cartaai-white">Nombre comercial</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="glass-input text-cartaai-white"
              placeholder="Ej: Mi Restaurante"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subDomain" className="text-cartaai-white">Subdominio</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="subDomain"
                name="subDomain"
                value={formData.subDomain}
                onChange={handleInputChange}
                className="glass-input text-cartaai-white"
                placeholder="Ej: mirestaurante"
              />
              <span className="text-cartaai-white/60 whitespace-nowrap">
                .cartaai.pe
              </span>
            </div>
            {formData.subDomain && (
              <p className="text-sm text-cartaai-white/60 mt-1">
                Tu dominio será: {formData.linkDominio}
              </p>
            )}
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localDepartamento" className="text-cartaai-white">Departamento *</Label>
              <Select 
                value={formData.localDepartamento} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, localDepartamento: value }))}
              >
                <SelectTrigger className="glass-input text-cartaai-white">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="bg-cartaai-black border-cartaai-white/10">
                  <SelectItem value="Lima">Lima</SelectItem>
                  <SelectItem value="Arequipa">Arequipa</SelectItem>
                  {/* Agregar más departamentos */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localProvincia" className="text-cartaai-white">Provincia *</Label>
              <Select 
                value={formData.localProvincia}
                onValueChange={(value) => setFormData(prev => ({ ...prev, localProvincia: value }))}
              >
                <SelectTrigger className="glass-input text-cartaai-white">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="bg-cartaai-black border-cartaai-white/10">
                  <SelectItem value="Lima">Lima</SelectItem>
                  <SelectItem value="Callao">Callao</SelectItem>
                  {/* Agregar más provincias */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localDistrito" className="text-cartaai-white">Distrito *</Label>
              <Select 
                value={formData.localDistrito}
                onValueChange={(value) => setFormData(prev => ({ ...prev, localDistrito: value }))}
              >
                <SelectTrigger className="glass-input text-cartaai-white">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="bg-cartaai-black border-cartaai-white/10">
                  <SelectItem value="Miraflores">Miraflores</SelectItem>
                  <SelectItem value="San Isidro">San Isidro</SelectItem>
                  {/* Agregar más distritos */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localDireccion" className="text-cartaai-white">Dirección completa *</Label>
            <Input
              id="localDireccion"
              name="localDireccion"
              value={formData.localDireccion}
              onChange={handleInputChange}
              className="glass-input text-cartaai-white"
              placeholder="Ej: Av. Principal 123"
            />
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localTelefono" className="text-cartaai-white">Teléfono</Label>
              <Input
                id="localTelefono"
                name="localTelefono"
                value={formData.localTelefono}
                onChange={handleInputChange}
                className="glass-input text-cartaai-white"
                placeholder="Ej: 987654321"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localWpp" className="text-cartaai-white">WhatsApp</Label>
              <Input
                id="localWpp"
                name="localWpp"
                value={formData.localWpp}
                onChange={handleInputChange}
                className="glass-input text-cartaai-white"
                placeholder="Ej: 987654321"
              />
            </div>
          </div>

          {/* Configuraciones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep('choice')}
            className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
          >
            Atrás
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-cartaai-red hover:bg-cartaai-red/80"
            disabled={!formData.localDireccion || !formData.localDepartamento || 
                     !formData.localProvincia || !formData.localDistrito || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creando...
              </div>
            ) : 'Crear local'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="mx-auto bg-cartaai-red/10 p-3 rounded-full w-fit">
          {step === 'new' ? (
          <Store className="w-8 h-8 text-cartaai-red" />
          ) : (
            <Link className="w-8 h-8 text-cartaai-red" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-cartaai-white">
          {step === 'new' ? 'Crear nuevo local' : 'Conectar con local existente'}
        </h2>
        <p className="text-gray-400">
          {step === 'new' 
            ? 'Ingresa los datos para crear un nuevo local' 
            : 'Ingresa el subdominio del local existente'}
        </p>
      </div>

      <div className="space-y-4">
        {step === 'new' && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-cartaai-white">Nombre del local</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="glass-input text-cartaai-white"
            placeholder="Ej: Mi Restaurante"
          />
        </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="subDomain" className="text-cartaai-white">Subdominio</Label>
          <Input
            id="subDomain"
            name="subDomain"
            value={formData.subDomain}
            onChange={handleInputChange}
            className="glass-input text-cartaai-white"
            placeholder="Ej: mirestaurante"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setStep('choice')}
          className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
        >
          Atrás
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          {step === 'new' ? 'Crear local' : 'Conectar'}
        </Button>
      </div>
    </div>
  );
};

export default CreateLocalForm;