import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CardContent } from "@/components/ui/card";

const ModifierOptions = ({ modifier, modifierData, onRemoveModifier, onOptionChange }) => {
  return (
    <div key={modifier.modifierId}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">{modifierData?.name}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveModifier(modifier.modifierId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {modifier.customizedOptions.map(option => {
            return (
              <div key={option.optionId} className="flex items-center gap-4">
                <span className="min-w-[120px]">{option.name}</span>
                <Switch
                  checked={option.isAvailable}
                  onCheckedChange={(checked) => 
                    onOptionChange(modifier.modifierId, option.optionId, 'isAvailable', checked)
                  }
                />
                <Input
                  type="number"
                  value={option.price}
                  onChange={(e) => 
                    onOptionChange(modifier.modifierId, option.optionId, 'price', parseFloat(e.target.value))
                  }
                  className="w-24"
                  placeholder="Precio"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
};

export default ModifierOptions;