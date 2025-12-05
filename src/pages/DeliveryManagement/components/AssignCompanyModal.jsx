import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Loader, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AssignCompanyModal = ({
  isOpen,
  onClose,
  availableCompanies = [],
  isLoading = false,
  onSubmit
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ companyId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ companyId: "" });
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.companyId) {
      setError("Por favor selecciona una empresa");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData.companyId);
      toast({
        title: "Éxito",
        description: "Empresa asignada correctamente",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al asignar la empresa",
        variant: "destructive",
      });
      console.error("Error al asignar empresa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Modal backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-overlay"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className="bg-[#151515] border border-white/10 rounded-lg shadow-xl max-w-md w-full p-6 mx-4 modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Asignar Empresa de Entrega</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company" className="text-white">Selecciona una empresa</Label>
              <div className="mt-1.5">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : availableCompanies.length > 0 ? (
                  <select
                    id="company"
                    className="w-full bg-[#212121] text-white border border-white/10 rounded-md py-2 px-3"
                    value={formData.companyId}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                  >
                    <option value="">Seleccionar empresa</option>
                    {availableCompanies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-400 text-sm py-2">No hay empresas disponibles para asignar</p>
                )}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="glass-button"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="glass-button-blue"
              disabled={isSubmitting || isLoading || availableCompanies.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  Asignando...
                </>
              ) : (
                "Asignar Empresa"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCompanyModal; 