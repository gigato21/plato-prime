export const formatScheduleData = (shifts, type) => {
  const scheduleTypes = {
    delivery: 'horarioParaDelivery',
    pickup: 'horarioParaRecojo',
    scheduled: 'horarioParaProgramarPedidos',
    dispatch: 'horarioParaRepartoPedidos'
  };

  const scheduleTypeIds = {
    delivery: 'd',
    pickup: 'r',
    scheduled: 'p',
    dispatch: 'rp'
  };

  const scheduleTypeNames = {
    delivery: 'delivery',
    pickup: 'recojo',
    scheduled: 'programado',
    dispatch: 'reparto'
  };

  const formattedData = {};
  const scheduleKey = scheduleTypes[type];
  
  formattedData[scheduleKey] = shifts[0].times
    .filter(time => time.enabled)
    .map((time, index) => ({
      horarioAtencionDiaId: `${scheduleTypeIds[type]}${index + 1}`,
      horarioAtencionDiaEstado: "activo",
      horarioAtencionDiaDia: time.horarioAtencionDiaDia.toLowerCase(),
      localId: time.localId,
      horarioAtencionDiaTipo: scheduleTypeNames[type],
      horarioAtencionList: [{
        horarioAtencionId: `${scheduleTypeIds[type]}${index + 2}`,
        horarioAtencionInicio: time.start,
        horarioAtencionFin: time.end,
        horarioAtencionDiaId: `${scheduleTypeIds[type]}${index + 1}`,
        horarioAtencionDiaHorasAnticipacion: time.anticipation || "1"
      }]
    }));

  return formattedData;
};