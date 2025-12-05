import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { getApiUrls } from '@/config/api';

const OwnerInfo = ({ businessData, setBusinessData }) => {
  const API_URLS = getApiUrls();
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const [isEditing, setIsEditing] = useState(false);
  const [ownerData, setOwnerData] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: ""
  });

  useEffect(() => {
    if (businessData) {
      setOwnerData({
        ownerName: businessData.ownerName || "",
        ownerEmail: businessData.ownerEmail || "",
        ownerPhone: businessData.ownerPhone || ""
      });
    }
  }, [businessData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      const mappedData = {
        ownerName: ownerData.ownerName,
        ownerEmail: ownerData.ownerEmail,
        ownerPhone: ownerData.ownerPhone
      };

      formData.append('data', JSON.stringify(mappedData));

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/update/${subDomain}/${localId}`, {
        method: 'PATCH',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la información');
      }

      setBusinessData(prev => ({
        ...prev,
        ...mappedData
      }));
      
      toast.success('Información actualizada correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la información');
    }
  };

  const handleCancel = () => {
    setOwnerData({
      ownerName: businessData?.ownerName || "",
      ownerEmail: businessData?.ownerEmail || "",
      ownerPhone: businessData?.ownerPhone || ""
    });
    setIsEditing(false);
  };

  return (
    <div className="mt-8 p-6 bg-cartaai-black/50 rounded-lg">
      <div className="flex justify-between items-center border-b border-cartaai-white/10 pb-2 mb-4">
        <h2 className="text-2xl font-semibold text-cartaai-white">
          INFORMACIÓN SOBRE EL PROPIETARIO
        </h2>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="text-cartaai-white hover:text-cartaai-red hover:bg-cartaai-white/10"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="text-cartaai-white hover:text-cartaai-red hover:bg-cartaai-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="text-cartaai-white hover:text-cartaai-red hover:bg-cartaai-white/10"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-cartaai-white/70 mb-1">
            Nombre del propietario
          </h3>
          {isEditing ? (
            <Input
              name="ownerName"
              value={ownerData.ownerName}
              onChange={handleChange}
              className="glass-input border-none"
            />
          ) : (
            <p className="bg-cartaai-white/10 p-2 rounded text-cartaai-white/50">
              {ownerData.ownerName}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-cartaai-white/70 mb-1">
            Correo electrónico del propietario
          </h3>
          {isEditing ? (
            <Input
              name="ownerEmail"
              value={ownerData.ownerEmail}
              onChange={handleChange}
              type="email"
              className="glass-input border-none"
            />

          ) : (
            <p className="bg-cartaai-white/10 p-2 rounded text-cartaai-white/50">
              {ownerData.ownerEmail}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-cartaai-white/70 mb-1">
            Teléfono del propietario
          </h3>
          {isEditing ? (
            <Input
              name="ownerPhone"
              value={ownerData.ownerPhone}
              onChange={handleChange}
              className="glass-input border-none"
            />

          ) : (
            <p className="bg-cartaai-white/10 p-2 rounded text-cartaai-white/50">
              {ownerData.ownerPhone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;