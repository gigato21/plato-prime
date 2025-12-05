/**
 * Validates Mexican RFC (Registro Federal de Contribuyentes)
 * @param {string} rfc - RFC to validate
 * @returns {object} - { valid: boolean, message: string, type: 'moral' | 'fisica' | null }
 */
export const validateRFC = (rfc) => {
  if (!rfc) {
    return { valid: false, message: "RFC requerido", type: null };
  }

  const cleanRFC = rfc.trim().toUpperCase();

  // RFC pattern: 
  // Persona Moral: 3 letters + 6 digits (date) + 3 alphanumeric = 12 chars
  // Persona Física: 4 letters + 6 digits (date) + 3 alphanumeric = 13 chars
  const rfcMoralPattern = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;
  const rfcFisicaPattern = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;

  let type = null;
  
  if (rfcMoralPattern.test(cleanRFC)) {
    type = 'moral';
  } else if (rfcFisicaPattern.test(cleanRFC)) {
    type = 'fisica';
  } else {
    return { valid: false, message: "Formato de RFC inválido", type: null };
  }

  // Validate date portion
  const dateStart = type === 'fisica' ? 4 : 3;
  const dateStr = cleanRFC.substring(dateStart, dateStart + 6);
  const year = parseInt(dateStr.substring(0, 2));
  const month = parseInt(dateStr.substring(2, 4));
  const day = parseInt(dateStr.substring(4, 6));

  if (month < 1 || month > 12) {
    return { valid: false, message: "Mes inválido en RFC", type };
  }

  if (day < 1 || day > 31) {
    return { valid: false, message: "Día inválido en RFC", type };
  }

  return { 
    valid: true, 
    message: type === 'moral' ? "RFC Persona Moral válido" : "RFC Persona Física válido",
    type 
  };
};

/**
 * Validates Mexican postal code (Código Postal)
 * @param {string} cp - Postal code to validate
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateCodigoPostal = (cp) => {
  if (!cp) {
    return { valid: false, message: "Código postal requerido" };
  }

  const cleanCP = cp.trim();
  const cpPattern = /^\d{5}$/;

  if (!cpPattern.test(cleanCP)) {
    return { valid: false, message: "Debe ser de 5 dígitos" };
  }

  return { valid: true, message: "Código postal válido" };
};

/**
 * Prepares CFDI configuration for API submission
 * @param {object} cfdiData - CFDI form data
 * @param {string} localId - Business local ID
 * @returns {object} - Formatted CFDI configuration
 */
export const prepareCFDIConfig = (cfdiData, localId) => ({
  localId,
  facturacionActiva: cfdiData.facturacionActiva || false,
  rfc: cfdiData.rfc?.toUpperCase() || '',
  razonSocial: cfdiData.razonSocial?.toUpperCase() || '',
  regimenFiscal: cfdiData.regimenFiscal || '',
  codigoPostalFiscal: cfdiData.codigoPostalFiscal || '',
  usoCFDIDefault: cfdiData.usoCFDIDefault || 'G03',
  facturacionAutomatica: cfdiData.facturacionAutomatica || false,
  solicitarDatosFiscales: cfdiData.solicitarDatosFiscales || false,
  permitirFacturaGlobal: cfdiData.permitirFacturaGlobal || false,
  serieCFDI: cfdiData.serieCFDI?.toUpperCase() || 'A',
  folioInicial: cfdiData.folioInicial || 1,
});

/**
 * List of Mexican fiscal regimes (Régimen Fiscal)
 */
export const REGIMENES_FISCALES = [
  { codigo: "601", nombre: "General de Ley Personas Morales" },
  { codigo: "603", nombre: "Personas Morales con Fines no Lucrativos" },
  { codigo: "605", nombre: "Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { codigo: "606", nombre: "Arrendamiento" },
  { codigo: "607", nombre: "Régimen de Enajenación o Adquisición de Bienes" },
  { codigo: "608", nombre: "Demás ingresos" },
  { codigo: "610", nombre: "Residentes en el Extranjero sin Establecimiento Permanente en México" },
  { codigo: "611", nombre: "Ingresos por Dividendos (socios y accionistas)" },
  { codigo: "612", nombre: "Personas Físicas con Actividades Empresariales y Profesionales" },
  { codigo: "614", nombre: "Ingresos por intereses" },
  { codigo: "615", nombre: "Régimen de los ingresos por obtención de premios" },
  { codigo: "616", nombre: "Sin obligaciones fiscales" },
  { codigo: "620", nombre: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos" },
  { codigo: "621", nombre: "Incorporación Fiscal" },
  { codigo: "622", nombre: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
  { codigo: "623", nombre: "Opcional para Grupos de Sociedades" },
  { codigo: "624", nombre: "Coordinados" },
  { codigo: "625", nombre: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
  { codigo: "626", nombre: "Régimen Simplificado de Confianza" },
];

/**
 * List of CFDI uses (Uso de CFDI)
 */
export const USOS_CFDI = [
  { codigo: "G01", nombre: "Adquisición de mercancías" },
  { codigo: "G02", nombre: "Devoluciones, descuentos o bonificaciones" },
  { codigo: "G03", nombre: "Gastos en general" },
  { codigo: "I01", nombre: "Construcciones" },
  { codigo: "I02", nombre: "Mobiliario y equipo de oficina por inversiones" },
  { codigo: "I03", nombre: "Equipo de transporte" },
  { codigo: "I04", nombre: "Equipo de cómputo y accesorios" },
  { codigo: "I05", nombre: "Dados, troqueles, moldes, matrices y herramental" },
  { codigo: "I06", nombre: "Comunicaciones telefónicas" },
  { codigo: "I07", nombre: "Comunicaciones satelitales" },
  { codigo: "I08", nombre: "Otra maquinaria y equipo" },
  { codigo: "D01", nombre: "Honorarios médicos, dentales y gastos hospitalarios" },
  { codigo: "D02", nombre: "Gastos médicos por incapacidad o discapacidad" },
  { codigo: "D03", nombre: "Gastos funerales" },
  { codigo: "D04", nombre: "Donativos" },
  { codigo: "D05", nombre: "Intereses reales efectivamente pagados por créditos hipotecarios" },
  { codigo: "D06", nombre: "Aportaciones voluntarias al SAR" },
  { codigo: "D07", nombre: "Primas por seguros de gastos médicos" },
  { codigo: "D08", nombre: "Gastos de transportación escolar obligatoria" },
  { codigo: "D09", nombre: "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
  { codigo: "D10", nombre: "Pagos por servicios educativos (colegiaturas)" },
  { codigo: "P01", nombre: "Por definir" },
  { codigo: "S01", nombre: "Sin efectos fiscales" },
  { codigo: "CP01", nombre: "Pagos" },
  { codigo: "CN01", nombre: "Nómina" },
];

/**
 * Payment methods for CFDI (Forma de Pago)
 */
export const FORMAS_PAGO = [
  { codigo: "01", nombre: "Efectivo" },
  { codigo: "02", nombre: "Cheque nominativo" },
  { codigo: "03", nombre: "Transferencia electrónica de fondos" },
  { codigo: "04", nombre: "Tarjeta de crédito" },
  { codigo: "28", nombre: "Tarjeta de débito" },
  { codigo: "29", nombre: "Tarjeta de servicios" },
  { codigo: "99", nombre: "Por definir" },
];

/**
 * Payment methods for CFDI (Método de Pago)
 */
export const METODOS_PAGO = [
  { codigo: "PUE", nombre: "Pago en una sola exhibición" },
  { codigo: "PPD", nombre: "Pago en parcialidades o diferido" },
];
