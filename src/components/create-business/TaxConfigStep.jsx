import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const TaxConfigStep = ({ data, updateData }) => {
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'localPorcentajeImpuesto') {
      const numValue = parseFloat(value);
      if (numValue < 0 || numValue > 100) {
        toast({
          title: "Valor inválido",
          description: "El porcentaje debe estar entre 0 y 100",
          variant: "destructive",
        });
        return;
      }
    }
    
    updateData({ ...data, [name]: value });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold dark:text-gray-200 text-gray-700">
        Configuración de Impuestos
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label 
            htmlFor="localPorcentajeImpuesto" 
            className="text-sm sm:text-base dark:text-gray-200 text-gray-700"
          >
            Porcentaje de Impuesto (IGV)
          </Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Configura el porcentaje de impuesto que se aplicará a los productos. En Perú, el IGV estándar es 18%.
          </p>
          <Input
            id="localPorcentajeImpuesto"
            name="localPorcentajeImpuesto"
            type="number"
            step="0.01"
            value={data.localPorcentajeImpuesto || '18'}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default TaxConfigStep;