export const prepareSchedules = (workingHours) => ({
  localAceptaDelivery: "1",
  localAceptaRecojo: "1",
  localAceptaProgramados: "1",
  estaAbiertoParaDelivery: true,
  estaAbiertoParaRecojo: true,
  estaAbiertoParaProgramarPedidos: true,
  horarioParaDelivery: workingHours.horarioParaDelivery || [],
  horarioParaRecojo: workingHours.horarioParaRecojo || [],
  horarioParaProgramarPedidos: workingHours.horarioParaProgramarPedidos || [],
  horarioParaRepartoPedidos: []
});