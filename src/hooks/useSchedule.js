import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import { fetchWorkingHours, updateWorkingHours } from '../services/workingHoursService';

const mapDayNumberToName = {
  '1': 'Lunes',
  '2': 'Martes',
  '3': 'Miércoles',
  '4': 'Jueves',
  '5': 'Viernes',
  '6': 'Sábado',
  '7': 'Domingo'
};

const mapNameToDayNumber = {
  'Lunes': '1',
  'Martes': '2',
  'Miércoles': '3',
  'Jueves': '4',
  'Viernes': '5',
  'Sábado': '6',
  'Domingo': '7'
};

const formatBackendData = (backendData, type) => {
  const scheduleTypes = {
    'delivery': 'horarioParaDelivery',
    'pickup': 'horarioParaRecojo',
    'scheduled': 'horarioParaProgramarPedidos',
    'dispatch': 'horarioParaRepartoPedidos'
  };

  const scheduleData = backendData[scheduleTypes[type]] || [];
  
  return [{
    id: 1,
    name: 'Horario Principal',
    times: Object.keys(mapDayNumberToName).map(dayNumber => {
      const daySchedule = scheduleData.find(schedule => 
        schedule.horarioAtencionDiaDia === dayNumber
      );

      return {
        horarioAtencionDiaDia: mapDayNumberToName[dayNumber],
        start: daySchedule?.horarioAtencionList[0]?.horarioAtencionInicio?.replace(' am', '').replace(' pm', '') || '09:00',
        end: daySchedule?.horarioAtencionList[0]?.horarioAtencionFin?.replace(' am', '').replace(' pm', '') || '17:00',
        enabled: daySchedule?.horarioAtencionDiaEstado === '1' || daySchedule?.horarioAtencionDiaEstado === 1,
        anticipation: daySchedule?.horarioAtencionList[0]?.horarioAtencionDiaHorasAnticipacion || '0',
        horarioAtencionDiaId: daySchedule?.horarioAtencionDiaId || `${type.charAt(0)}${dayNumber}`,
        horarioAtencionDiaEstado: daySchedule?.horarioAtencionDiaEstado || '0',
        localId: daySchedule?.localId || '',
        horarioAtencionDiaTipo: getScheduleTypeNumber(type)
      };
    })
  }];
};

const getScheduleTypeNumber = (type) => {
  const scheduleTypeNumbers = {
    'delivery': '1',
    'pickup': '3',
    'scheduled': '2',
    'dispatch': '4'
  };
  return scheduleTypeNumbers[type];
};

const formatDataForUpdate = (shifts, type, originalData) => {
  const scheduleTypes = {
    'delivery': 'horarioParaDelivery',
    'pickup': 'horarioParaRecojo',
    'scheduled': 'horarioParaProgramarPedidos',
    'dispatch': 'horarioParaRepartoPedidos'
  };

  const formattedData = { ...originalData };
  
  formattedData[scheduleTypes[type]] = shifts[0].times.map(time => ({
    horarioAtencionDiaId: time.horarioAtencionDiaId,
    horarioAtencionDiaEstado: time.enabled ? "1" : "0",
    horarioAtencionDiaDia: mapNameToDayNumber[time.horarioAtencionDiaDia],
    localId: time.localId,
    horarioAtencionDiaTipo: getScheduleTypeNumber(type),
    horarioAtencionList: [{
      horarioAtencionId: `${time.horarioAtencionDiaId}_1`,
      horarioAtencionInicio: time.start,
      horarioAtencionFin: time.end,
      horarioAtencionDiaId: time.horarioAtencionDiaId,
      horarioAtencionDiaHorasAnticipacion: time.anticipation || "1"
    }]
  }));

  // Asegurarse de que todos los tipos de horarios estén presentes en el DTO
  Object.keys(scheduleTypes).forEach(scheduleType => {
    if (scheduleType !== type && !formattedData[scheduleTypes[scheduleType]]) {
      formattedData[scheduleTypes[scheduleType]] = originalData[scheduleTypes[scheduleType]] || [];
    }
  });

  return formattedData;
};

export const useSchedule = (initialShifts = [], type = 'delivery') => {
  const [state, setState] = useState({
    shifts: initialShifts,
    isLoading: true,
    isSaving: false,
    originalData: null
  });

  const { subDomain, localId, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const data = await fetchWorkingHours(subDomain, localId);
        const formattedShifts = formatBackendData(data, type);
        setState(prev => ({
          ...prev,
          shifts: formattedShifts,
          originalData: data,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error loading working hours:', error);
        toast.error('Error al cargar los horarios');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadWorkingHours();
  }, [subDomain, localId, type]);

  const handleTimeChange = (day, field, value) => {
    setState(prev => ({
      ...prev,
      shifts: prev.shifts.map(shift => ({
        ...shift,
        times: shift.times.map(time => 
          time.horarioAtencionDiaDia === day 
            ? { ...time, [field]: value }
            : time
        )
      }))
    }));
  };

  const handleAnticipationChange = (day, value) => {
    setState(prev => ({
      ...prev,
      shifts: prev.shifts.map(shift => ({
        ...shift,
        times: shift.times.map(time => 
          time.horarioAtencionDiaDia === day 
            ? { ...time, anticipation: value }
            : time
        )
      }))
    }));
  };

  const toggleDay = (day) => {
    setState(prev => ({
      ...prev,
      shifts: prev.shifts.map(shift => ({
        ...shift,
        times: shift.times.map(time => 
          time.horarioAtencionDiaDia === day 
            ? { 
                ...time, 
                enabled: !time.enabled,
                horarioAtencionDiaEstado: !time.enabled ? '1' : '0'
              }
            : time
        )
      }))
    }));
  };

  const saveSchedule = async () => {
    try {
      setState(prev => ({ ...prev, isSaving: true }));
      const formattedData = formatDataForUpdate(state.shifts, type, state.originalData);
            
      await updateWorkingHours(subDomain, localId, formattedData, accessToken);
      toast.success('Horarios actualizados correctamente');
      
      const updatedData = await fetchWorkingHours(subDomain, localId);
      const formattedShifts = formatBackendData(updatedData, type);
      setState(prev => ({
        ...prev,
        shifts: formattedShifts,
        originalData: updatedData,
        isSaving: false
      }));
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast.error('Error al guardar los horarios');
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };

  return {
    shifts: state.shifts,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    handleTimeChange,
    handleAnticipationChange,
    toggleDay,
    saveSchedule
  };
};