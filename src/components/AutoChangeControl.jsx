import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AutoChangeControl = ({ autoChangeEnabled, setAutoChangeEnabled, intervalMinutes, setIntervalMinutes }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-cartaai-white/10 rounded-lg">
      <div className="flex flex-col items-center space-y-1">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          autoChangeEnabled ? 'bg-green-500 animate-pulse' : 'bg-cartaai-red'
        }`} style={{ animationDuration: '3s' }}></div>
        <Switch
          checked={autoChangeEnabled}
          onCheckedChange={setAutoChangeEnabled}
          id="auto-change"
          className={`${autoChangeEnabled ? 'bg-green-500' : 'bg-cartaai-red'}`}
        />
      </div>
      <div className="flex flex-col">
        <Label htmlFor="auto-change" className="text-sm font-medium text-cartaai-white mb-1">
          Cambio automático de estados
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            className="w-16  text-cartaai-white"
            min="1"
          />
          <span className="text-sm text-cartaai-white">minutos</span>
        </div>
      </div>
    </div>
  );
};

export default AutoChangeControl;