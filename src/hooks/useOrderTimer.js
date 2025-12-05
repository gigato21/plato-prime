import { useState, useEffect } from 'react';

const statuses = ['aceptado', 'en cocina', 'en camino', 'entregado'];

const useOrderTimer = (initialStatus, autoChangeEnabled, intervalMinutes, onStatusChange) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  useEffect(() => {
    if (!autoChangeEnabled) return;

    const intervalId = setInterval(() => {
      const currentIndex = statuses.indexOf(currentStatus);
      if (currentIndex < statuses.length - 1) {
        const newStatus = statuses[currentIndex + 1];
        setCurrentStatus(newStatus);
        onStatusChange(newStatus);
      }
    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentStatus, autoChangeEnabled, intervalMinutes, onStatusChange]);

  return currentStatus;
};

export default useOrderTimer;