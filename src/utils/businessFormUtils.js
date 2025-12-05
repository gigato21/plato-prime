import { prepareBasicInfo } from './formUtils/basicInfoUtils';
import { prepareSchedules } from './formUtils/scheduleUtils';
import { prepareCoverageZones } from './formUtils/coverageUtils';
import { preparePaymentConfig } from './formUtils/paymentUtils';
import { prepareTaxConfig } from './formUtils/taxUtils';

export const prepareBusinessData = (formData) => {
  const {
    basicInfo,
    salesConfig,
    paymentConfig,
    workingHours,
    zonaCobertura,
    advancedConfig
  } = formData;

  return {
    // Basic Info
    subdominio: basicInfo.subdominio || "",
    dominio: basicInfo.dominio || "",
    linkDominio: basicInfo.linkDominio || "",
    localId: basicInfo.localId || "",
    localDescripcion: basicInfo.localDescripcion || "",
    localNombreComercial: basicInfo.localNombreComercial || "",
    localDireccion: basicInfo.localDireccion || "",
    localLatitud: basicInfo.localLatitud || "",
    localLongitud: basicInfo.localLongitud || "",
    localMontoMinimo: salesConfig.localMontoMinimo || "30.00",
    localIdioma: "es",
    localZonaHoraria: "America/Lima",
    localRedesSociales: basicInfo.localRedesSociales || "",
    localCartaGenerica: salesConfig.localCartaGenerica || "1",
    localDepartamento: basicInfo.localDepartamento || "",
    localProvincia: basicInfo.localProvincia || "",
    localDistrito: basicInfo.localDistrito || "",
    localTelefono: basicInfo.localTelefono || "",
    localWpp: basicInfo.localWpp || "",
    localPermiteComprobanteMenuOnline: salesConfig.localPermiteComprobanteMenuOnline || "1",
    
    // Currency Config
    monedaFacturacion: {
      monedaFacturacionId: "1",
      monedaFacturacionDescripcion: "Soles",
      monedaFacturacionSimbolo: "S/",
      monedaFacturacionIsocode: "PEN",
      monedaFacturacionChecksum: "abc123",
      monedaFacturacionEstado: "1",
      monedaList: [],
      precioLocalProductoList: [],
      precioLocalProductoMonedaList: []
    },
    
    // Tax and Images
    localPorcentajeImpuesto: salesConfig.localPorcentajeImpuesto || "18",
    localLogo: basicInfo.localLogo || "",
    localImagenFondoMenuOnline: basicInfo.localImagenFondoMenuOnline || "",
    localFondoMenuOnlineSelector: "2",
    
    // Payment Config
    localAceptaPagoEnLinea: paymentConfig.localAceptaPagoEnLinea || "1",
    localSoloPagoEnLinea: paymentConfig.localSoloPagoEnLinea || "0",
    localPagoTransferenciaMenuOnline: paymentConfig.localPagoTransferenciaMenuOnline || "1",
    localAceptaTarjetaPorDelivery: paymentConfig.localAceptaTarjetaPorDelivery || "1",
    localAceptaEfectivoPorDelivery: paymentConfig.localAceptaEfectivoPorDelivery || "1",
    localCorreoDeliveryPersonalizado: paymentConfig.localCorreoDeliveryPersonalizado || "",
    
    // Service Config
    localAceptaDelivery: "1",
    localAceptaRecojo: "1",
    localAceptaProgramados: "1",
    estaAbiertoParaDelivery: true,
    estaAbiertoParaRecojo: true,
    estaAbiertoParaProgramarPedidos: true,
    
    // Schedules
    ...prepareSchedules(workingHours),
    
    // Coverage Zones
    ...prepareCoverageZones(zonaCobertura),
    
    // Bank Accounts
    localListaCuentasTransferencia: paymentConfig.localListaCuentasTransferencia || [{
      tipoTransferenciaId: "1",
      tipoTransferenciaNombreEntidad: "Banco BCP",
      tipoTransferenciaNumeroCuenta: "",
      tipoTransferenciaCodigoInterbancario: "",
      tipoTransferenciaTipo: "1",
      tipoTransferenciaTitular: "",
      tipoTransferenciaEstado: "1",
      localId: ""
    }],
    
    // Tax Config
    listaImpuestos: [{
      tieneErrores: false,
      mensajes: [],
      igvId: "1",
      igvPorcentajeIgv: "18",
      igvNombre: "IGV",
      igvEstado: "1",
      igvFiscalizado: "1",
      localId: basicInfo.localId || "",
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
    
    // Advanced Config
    configuracionPreciosProductosSinImpuesto: advancedConfig.configuracionPreciosProductosSinImpuesto || "0",
    configuracionImpuestosPorModalidad: advancedConfig.configuracionImpuestosPorModalidad || "1",
    configuracionPreciosProductosSinImpuestoAplicaNotaVenta: advancedConfig.configuracionPreciosProductosSinImpuestoAplicaNotaVenta || "0",
    configuracionImpuestoInafectaVenta: advancedConfig.configuracionImpuestoInafectaVenta || "0",
    configuracionImpuestoInafectaCostoEnvio: advancedConfig.configuracionImpuestoInafectaCostoEnvio || "0",
    configuracionMarcasActiva: "1",
    configuracionMarcasMenuEnLineaActiva: "1",
    marcaList: [],
    marcasLocalList: [],
    origin: 1,
    chatbotNumber: basicInfo.chatbotNumber || ""
  };
};