import { useState } from 'react';
import { DeliveryHours } from './working-hours/DeliveryHours';
import { useSchedule } from '@/hooks/useSchedule';
import ScheduleTypeSelector from './working-hours/ScheduleTypeSelector';
import { PickupHours } from './working-hours/PickupHours';
import { ScheduledHours } from './working-hours/ScheduledHours';
import { DispatchHours } from './working-hours/DispatchHours';
import LoadingSpinner from './LoadingSpinner';

const WorkingHours = () => {
  const [selectedType, setSelectedType] = useState('delivery');

  const {
    shifts,
    isLoading,
    isSaving,
    handleTimeChange,
    handleAnticipationChange,
    toggleDay,
    saveSchedule
  } = useSchedule([], selectedType);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderScheduleForm = () => {
    const commonProps = {
      shifts,
      onToggleDay: toggleDay,
      onTimeChange: handleTimeChange,
      onAnticipationChange: handleAnticipationChange,
      onSave: saveSchedule,
      isSaving
    };

    switch(selectedType) {
      case 'delivery':
        return <DeliveryHours {...commonProps} />;
      case 'pickup':
        return <PickupHours {...commonProps} />;
      case 'scheduled':
        return <ScheduledHours {...commonProps} />;
      case 'dispatch':
        return <DispatchHours {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <ScheduleTypeSelector 
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
      />
      {renderScheduleForm()}
    </div>
  );
};

export default WorkingHours;