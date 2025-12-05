
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const BotSwitch = ({ isEnabled, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="bot-mode"
        checked={isEnabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="bot-mode" className="text-sm font-medium text-cartaai-white">
        {isEnabled ? "Bot Activado" : "Bot Desactivado"}
      </Label>
    </div>
  );
};

export default BotSwitch;