import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { isRestaurantOpen, getNextChangeTime } from '../utils/workingHoursUtils';

const RestaurantStatusBar = ({ shifts, timezone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#f6fef6');
  const [textColor, setTextColor] = useState('text-green-600');

  useEffect(() => {
    const updateStatus = () => {
      const currentStatus = isRestaurantOpen(shifts, timezone);
      setIsOpen(currentStatus);
      
      const nextChangeTime = getNextChangeTime(shifts, timezone);
      const formattedTime = format(nextChangeTime, 'HH:mm', { locale: es });
      
      if (currentStatus) {
        setStatusText(`Abierto hasta las ${formattedTime} hrs.`);
        setBackgroundColor('bg-green-500/10');
        setTextColor('text-green-500');
      } else {
        setStatusText(`Cerrado, abre a las ${formattedTime} hrs.`);
        setBackgroundColor('bg-red-500/10');
        setTextColor('text-red-500');
      }
    };

    updateStatus();
    const intervalId = setInterval(updateStatus, 60000);

    return () => clearInterval(intervalId);
  }, [shifts, timezone]);

  return (
    <div className="w-full glass-container p-2 text-center backdrop-blur-md">
      <span className={`text-sm font-medium ${textColor}`}>
        {statusText}
      </span>
    </div>
  );
};

export default RestaurantStatusBar;