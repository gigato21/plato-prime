import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CountryCodeSelect from './CountryCodeSelect';

const WhatsappInfo = ({ whatsappData, setWhatsappData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWhatsappData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeChange = (value) => {
    setWhatsappData(prev => ({ ...prev, countryCode: value }));
  };

  return (
    <div>
      <Label htmlFor="whatsappPhone" className="text-sm font-medium text-cartaai-white/90">WhatsApp del restaurante</Label>
      <div className="flex mt-1.5">
        <CountryCodeSelect
          value={whatsappData.countryCode || '+51'}
          onChange={handleCountryCodeChange}
        />
        <Input
          id="whatsappPhone"
          name="whatsappPhone"
          value={whatsappData.whatsappPhone}
          onChange={handleInputChange}
          placeholder="999968698"
          maxLength={9}
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          className="ml-2 flex-grow bg-transparent border border-cartaai-white/10 text-cartaai-white h-10 rounded-lg
                    transition-all duration-200 placeholder:text-gray-500
                    focus:border-cartaai-white/30 focus:ring-0

                    hover:border-cartaai-white/20"
        />
      </div>
    </div>

  );
};

export default WhatsappInfo;