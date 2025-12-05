import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DomainSection = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <Label htmlFor="subdominio" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
          Subdominio
        </Label>
        <Input
          id="subdominio"
          name="subdominio"
          value={data.subdominio || ''}
          onChange={handleChange}
          className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
          placeholder="Ej: pizzafeliz"
        />
        <p className="text-xs sm:text-sm dark:text-gray-200 text-gray-700 mt-1">
          Tu menú estará disponible en: {data.subdominio || 'ejemplo'}.cartaai.com
        </p>
      </div>

      <div>
        <Label htmlFor="dominio" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
          Dominio
        </Label>
        <Input
          id="dominio"
          name="dominio"
          value={data.dominio || ''}
          onChange={handleChange}
          className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
          placeholder="Ej: pizzafeliz.com"
        />
      </div>

      <div>
        <Label htmlFor="linkDominio" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
          Link del Dominio
        </Label>
        <Input
          id="linkDominio"
          name="linkDominio"
          value={data.linkDominio || ''}
          onChange={handleChange}
          className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
          placeholder="Ej: https://pizzafeliz.com"
        />
      </div>
    </div>
  );
};

export default DomainSection;