import { Truck, ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ScheduleTypeSelector = ({ selectedType, onTypeSelect }) => {
  const scheduleTypes = [
    { id: 'delivery', icon: Truck, label: 'Horario para Delivery' },
    { id: 'pickup', icon: ShoppingBag, label: 'Horario para Recojo' },
    { id: 'scheduled', icon: Calendar, label: 'Horario para Programar' },
    { id: 'dispatch', icon: Truck, label: 'Horario para Reparto' }
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {scheduleTypes.map(({ id, icon: Icon, label }, index) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant={selectedType === id ? "default" : "outline"}
            className={`flex items-center gap-2 transition-all duration-300 ${
              selectedType === id 
                ? 'bg-cartaai-red text-white scale-105' 
                : 'text-cartaai-white hover:bg-cartaai-white/10'
            }`}
            onClick={() => onTypeSelect(id)}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ScheduleTypeSelector;