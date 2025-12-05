import { useQuery } from '@tanstack/react-query';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';

const ModifiersSection = ({ selectedModifiers = [], onChange }) => {
  const API_URLS = getApiUrls();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);

  const { data: availableModifiers = [] } = useQuery({
    queryKey: ['modifiers'],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar modificadores');
      return response.json();
    }
  });

  const handleModifierToggle = (modifier) => {
    const isSelected = selectedModifiers.some(m => m.modifierId === modifier.rId);
    let updatedModifiers;

    if (isSelected) {
      updatedModifiers = selectedModifiers.filter(m => m.modifierId !== modifier.rId);
    } else {
      updatedModifiers = [
        ...selectedModifiers,
        {
          modifierId: modifier.rId,
          customizedOptions: modifier.options.map(option => ({
            optionId: option.optionId, // Now we're using the string directly
            isAvailable: true,
            price: option.price || 0
          }))
        }
      ];
    }

    onChange(updatedModifiers);
  };

  const handleOptionChange = (modifierId, optionId, field, value) => {
    const updatedModifiers = selectedModifiers.map(modifier => {
      if (modifier.modifierId === modifierId) {
        const updatedOptions = modifier.customizedOptions.map(option => {
          if (option.optionId === optionId) {
            return { ...option, [field]: field === 'price' ? Number(value) : value };
          }
          return option;
        });
        return { ...modifier, customizedOptions: updatedOptions };
      }
      return modifier;
    });
    onChange(updatedModifiers);
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-gray-700 dark:text-gray-200">Modificadores</Label>
      <ScrollArea className="h-[300px] border border-cartaai-white/10 rounded-lg p-4">
        <div className="space-y-4">
          {availableModifiers.map((modifier) => {
            const isSelected = selectedModifiers.some(m => m.modifierId === modifier.rId);
            const selectedModifier = selectedModifiers.find(m => m.modifierId === modifier.rId);

            return (
              <div key={modifier.rId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => handleModifierToggle(modifier)}
                    />
                    <Label>{modifier.name}</Label>
                  </div>
                </div>

                {isSelected && (
                  <div className="ml-8 space-y-2">
                    {modifier.options.map((option) => {
                      const customizedOption = selectedModifier?.customizedOptions.find(
                        o => o.optionId === option.optionId
                      );

                      return (
                        <div key={option.optionId} className="flex items-center space-x-4">
                          <Switch
                            checked={customizedOption?.isAvailable ?? true}
                            onCheckedChange={(checked) =>
                              handleOptionChange(modifier.rId, option.optionId, 'isAvailable', checked)
                            }
                          />
                          <span className="text-sm text-gray-400 flex-1">{option.name}</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={customizedOption?.price ?? option.price}
                            onChange={(e) =>
                              handleOptionChange(modifier.rId, option.optionId, 'price', e.target.value)
                            }
                            className="w-24 glass-input"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ModifiersSection;