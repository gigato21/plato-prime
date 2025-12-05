import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const countryCodes = [
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+507', country: 'Panamá', flag: '🇵🇦' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+1', country: 'República Dominicana', flag: '🇩🇴' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+1 787', country: 'Puerto Rico', flag: '🇵🇷' },
];

const CountryCodeSelect = ({ value, onChange }) => {
  return (
    <Select value={value || '+52'} onValueChange={onChange}>
      <SelectTrigger className="w-[100px] bg-cartaai-white/10 dark:text-gray-200 text-gray-700 text-sm">
        <SelectValue placeholder={value || '+52'} />
      </SelectTrigger>
      <SelectContent className="bg-cartaai-black dark:text-gray-200 text-gray-700 z-[999]">
        {countryCodes.map((country, index) => (
          <SelectItem key={`${country.code}-${index}`} value={country.code}>
            <div className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              <span>{country.code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryCodeSelect;