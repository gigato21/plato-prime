import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const AddressSearch = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error al buscar sugerencias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    const location = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    onLocationSelect(location);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    toast.success('Ubicación encontrada');
  };

  return (
    <div className="relative flex gap-2">
      <div className="flex-1">
        <Input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Buscar dirección..."
          className="glass-input"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSuggestions(false)}>
            <div 
              className="absolute z-50 w-full mt-1 bg-cartaai-black border border-cartaai-white/20 rounded-lg shadow-xl max-h-[300px] overflow-y-auto"
              style={{ top: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-cartaai-white/10 text-cartaai-white text-sm transition-all duration-200 border-b border-cartaai-white/10 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0 text-cartaai-red" />
                  <span className="text-left line-clamp-2">{suggestion.display_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button 
        onClick={(e) => {
          e.preventDefault();
          if (!searchQuery.trim()) return;
          const suggestion = suggestions[0];
          if (suggestion) {
            handleSuggestionClick(suggestion);
          }
        }}
        disabled={isLoading}
        className="bg-cartaai-red hover:bg-cartaai-red/80"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default AddressSearch; 