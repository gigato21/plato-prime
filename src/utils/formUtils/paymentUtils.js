export const preparePaymentConfig = (paymentConfig) => ({
  localAceptaPagoEnLinea: paymentConfig.localAceptaPagoEnLinea || "1",
  localSoloPagoEnLinea: paymentConfig.localSoloPagoEnLinea || "0",
  localPagoTransferenciaMenuOnline: paymentConfig.localPagoTransferenciaMenuOnline || "1",
  localAceptaTarjetaPorDelivery: paymentConfig.localAceptaTarjetaPorDelivery || "1",
  localAceptaEfectivoPorDelivery: paymentConfig.localAceptaEfectivoPorDelivery || "1",
  localCorreoDeliveryPersonalizado: paymentConfig.localCorreoDeliveryPersonalizado || "",
  localListaCuentasTransferencia: paymentConfig.localListaCuentasTransferencia || [{
    tipoTransferenciaId: "1",
    tipoTransferenciaNombreEntidad: "Banco BCP",
    tipoTransferenciaNumeroCuenta: "",
    tipoTransferenciaCodigoInterbancario: "",
    tipoTransferenciaTipo: "1",
    tipoTransferenciaTitular: "",
    tipoTransferenciaEstado: "1",
    localId: ""
  }]
});