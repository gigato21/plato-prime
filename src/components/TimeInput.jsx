import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const TimeInput = ({ value, onChange, disabled }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue) || newValue === '') {
      onChange(newValue);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      <Input
        type="time"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-24 transition-all duration-300 ${
          disabled 
            ? 'opacity-50 bg-cartaai-white/5' 
            : 'bg-background dark:text-gray-200 text-gray-700 border-cartaai-white/10 hover:border-cartaai-red/50 focus:border-cartaai-red'
        }`}
      />
    </motion.div>
  );
};

export default TimeInput;