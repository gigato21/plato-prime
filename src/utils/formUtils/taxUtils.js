// Configuración de IVA para México (16%)
export const prepareTaxConfig = (localId) => ({
  listaImpuestos: [{
    tieneErrores: false,
    mensajes: [],
    igvId: "1",
    igvPorcentajeIgv: "16",
    igvNombre: "IVA",
    igvEstado: "1",
    igvFiscalizado: "1",
    localId: localId,
    igvModSalon: "1",
    igvModRapida: "1",
    igvModDelivery: "1",
    igvModReserva: "1",
    detalleConsumoVentaImpuestoList: [],
    detalleNotaCreditoImpuestoList: [],
    detalleNotaDebitoImpuestoList: [],
    detalleVentaImpuestoList: [],
    impuestoVentaCategoriaList: [],
    impuestoVentaProductoGeneralList: [],
    notaCreditoIgvList: [],
    notaDebitoIgvList: [],
    ventaIgvList: [],
    impuestoMultiPais: false
  }],
  configuracionPreciosProductosSinImpuesto: "0",
  configuracionImpuestosPorModalidad: "1",
  configuracionPreciosProductosSinImpuestoAplicaNotaVenta: "0",
  configuracionImpuestoInafectaVenta: "0",
  configuracionImpuestoInafectaCostoEnvio: "0"
});