import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CountryCodeSelect from '../CountryCodeSelect';

const ContactSection = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <Label htmlFor="localTelefono" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
          Teléfono
        </Label>
        <div className="flex mt-1">
          <CountryCodeSelect
            value={data.phoneCountryCode || '+51'}
            onChange={(value) => updateData({ ...data, phoneCountryCode: value })}
          />
          <Input
            id="localTelefono"
            name="localTelefono"
            value={data.localTelefono || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white ml-2 flex-grow text-sm sm:text-base h-8 sm:h-10"
            placeholder="987654321"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="localWpp" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
          WhatsApp
        </Label>
        <div className="flex mt-1">
          <CountryCodeSelect
            value={data.wppCountryCode || '+51'}
            onChange={(value) => updateData({ ...data, wppCountryCode: value })}
          />
          <Input
            id="localWpp"
            name="localWpp"
            value={data.localWpp || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white ml-2 flex-grow text-sm sm:text-base h-8 sm:h-10"
            placeholder="987654321"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="localRedesSociales" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
          Redes Sociales
        </Label>
        <Input
          id="localRedesSociales"
          name="localRedesSociales"
          value={data.localRedesSociales || ''}
          onChange={handleChange}
          className="glass-input dark:text-gray-200 text-gray-700 mt-1 text-sm sm:text-base h-8 sm:h-10"
          placeholder="Instagram: @turestaurante, Facebook: /turestaurante"
        />
      </div>
    </div>
  );
};

export default ContactSection;