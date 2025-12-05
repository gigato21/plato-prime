export const prepareCoverageZones = (zonaCobertura) => ({
  zonaCobertura: zonaCobertura.map(zone => ({
    ...zone,
    coberturaLocalEstado: "1",
    coberturaLocalColor: "#FF5733",
    coberturaLocalTipoCobertura: "1",
    coberturaLocalTiempoEstimado: "45",
    deliveryList: []
  })) || [],
  configuracionMarcasActiva: "1",
  configuracionMarcasMenuEnLineaActiva: "1",
  marcaList: [],
  marcasLocalList: [],
  origin: 1
});