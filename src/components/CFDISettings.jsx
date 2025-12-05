import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Building2, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const REGIMENES_FISCALES = [
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

const USOS_CFDI = [
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

const validateRFC = (rfc) => {
  if (!rfc) return { valid: false, message: "RFC requerido" };
  
  // RFC pattern: 3-4 letters + 6 digits (date) + 3 alphanumeric (homoclave)
  // Persona Moral: 3 letters + 6 digits + 3 alphanumeric = 12 chars
  // Persona Física: 4 letters + 6 digits + 3 alphanumeric = 13 chars
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
  
  if (!rfcPattern.test(rfc)) {
    return { valid: false, message: "Formato de RFC inválido" };
  }
  
  // Validate date portion (positions 4-9 for persona física, 3-8 for persona moral)
  const dateStart = rfc.length === 13 ? 4 : 3;
  const dateStr = rfc.substring(dateStart, dateStart + 6);
  const year = parseInt(dateStr.substring(0, 2));
  const month = parseInt(dateStr.substring(2, 4));
  const day = parseInt(dateStr.substring(4, 6));
  
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { valid: false, message: "Fecha en RFC inválida" };
  }
  
  return { valid: true, message: "RFC válido" };
};

const validateCodigoPostal = (cp) => {
  if (!cp) return { valid: false, message: "Código postal requerido" };
  const cpPattern = /^\d{5}$/;
  if (!cpPattern.test(cp)) {
    return { valid: false, message: "Debe ser 5 dígitos" };
  }
  return { valid: true, message: "Válido" };
};

const CFDISettings = ({ cfdiData, setCfdiData }) => {
  const { toast } = useToast();
  const [rfcValidation, setRfcValidation] = useState({ valid: false, message: "" });
  const [cpValidation, setCpValidation] = useState({ valid: false, message: "" });

  const handleChange = (field, value) => {
    setCfdiData({
      ...cfdiData,
      [field]: value
    });

    if (field === 'rfc') {
      const validation = validateRFC(value.toUpperCase());
      setRfcValidation(validation);
    }
    
    if (field === 'codigoPostalFiscal') {
      const validation = validateCodigoPostal(value);
      setCpValidation(validation);
    }
  };

  const handleSwitchChange = (field) => {
    const newValue = !cfdiData[field];
    setCfdiData({
      ...cfdiData,
      [field]: newValue
    });
    
    if (field === 'facturacionActiva' && newValue) {
      toast({
        title: "Facturación CFDI activada",
        description: "Configura tus datos fiscales para emitir facturas electrónicas.",
      });
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Facturación Electrónica CFDI
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configura tus datos fiscales para emitir Comprobantes Fiscales Digitales por Internet
              </p>
            </div>
          </div>
          <Switch
            checked={cfdiData?.facturacionActiva || false}
            onCheckedChange={() => handleSwitchChange('facturacionActiva')}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>

      {cfdiData?.facturacionActiva && (
        <CardContent className="space-y-6">
          {/* Datos del Emisor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Datos del Emisor</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">RFC del Emisor *</Label>
                <div className="relative">
                  <Input
                    value={cfdiData?.rfc || ''}
                    onChange={(e) => handleChange('rfc', e.target.value.toUpperCase())}
                    placeholder="XAXX010101000"
                    maxLength={13}
                    className="glass-input uppercase pr-10"
                  />
                  {cfdiData?.rfc && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {rfcValidation.valid ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {cfdiData?.rfc && !rfcValidation.valid && (
                  <p className="text-xs text-destructive">{rfcValidation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Razón Social *</Label>
                <Input
                  value={cfdiData?.razonSocial || ''}
                  onChange={(e) => handleChange('razonSocial', e.target.value.toUpperCase())}
                  placeholder="NOMBRE DE LA EMPRESA SA DE CV"
                  className="glass-input uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Debe coincidir exactamente con la Constancia de Situación Fiscal
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-foreground">Régimen Fiscal *</Label>
                <Select
                  value={cfdiData?.regimenFiscal || ''}
                  onValueChange={(value) => handleChange('regimenFiscal', value)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Selecciona tu régimen fiscal" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {REGIMENES_FISCALES.map((regimen) => (
                      <SelectItem key={regimen.codigo} value={regimen.codigo}>
                        <span className="font-mono text-xs mr-2">{regimen.codigo}</span>
                        {regimen.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Domicilio Fiscal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Domicilio Fiscal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Código Postal Fiscal *</Label>
                <div className="relative">
                  <Input
                    value={cfdiData?.codigoPostalFiscal || ''}
                    onChange={(e) => handleChange('codigoPostalFiscal', e.target.value.replace(/\D/g, ''))}
                    placeholder="06600"
                    maxLength={5}
                    className="glass-input pr-10"
                  />
                  {cfdiData?.codigoPostalFiscal && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {cpValidation.valid ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Código postal del domicilio fiscal registrado ante el SAT
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Uso de CFDI por defecto</Label>
                <Select
                  value={cfdiData?.usoCFDIDefault || 'G03'}
                  onValueChange={(value) => handleChange('usoCFDIDefault', value)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Selecciona uso de CFDI" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {USOS_CFDI.map((uso) => (
                      <SelectItem key={uso.codigo} value={uso.codigo}>
                        <span className="font-mono text-xs mr-2">{uso.codigo}</span>
                        {uso.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Configuración adicional */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <h3 className="font-medium text-foreground">Configuración de Facturación</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Facturación automática</Label>
                  <p className="text-xs text-muted-foreground">
                    Generar CFDI automáticamente al confirmar cada pedido
                  </p>
                </div>
                <Switch
                  checked={cfdiData?.facturacionAutomatica || false}
                  onCheckedChange={() => handleSwitchChange('facturacionAutomatica')}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Solicitar datos fiscales al cliente</Label>
                  <p className="text-xs text-muted-foreground">
                    Pedir RFC y datos fiscales durante el checkout
                  </p>
                </div>
                <Switch
                  checked={cfdiData?.solicitarDatosFiscales || false}
                  onCheckedChange={() => handleSwitchChange('solicitarDatosFiscales')}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Permitir factura global</Label>
                  <p className="text-xs text-muted-foreground">
                    Agrupar ventas del día en una sola factura al público en general
                  </p>
                </div>
                <Switch
                  checked={cfdiData?.permitirFacturaGlobal || false}
                  onCheckedChange={() => handleSwitchChange('permitirFacturaGlobal')}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>

          {/* Serie y Folio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Serie de Factura</Label>
              <Input
                value={cfdiData?.serieCFDI || ''}
                onChange={(e) => handleChange('serieCFDI', e.target.value.toUpperCase())}
                placeholder="A"
                maxLength={10}
                className="glass-input uppercase"
              />
              <p className="text-xs text-muted-foreground">
                Identificador de serie (ej: A, B, FAC)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Folio Inicial</Label>
              <Input
                type="number"
                value={cfdiData?.folioInicial || 1}
                onChange={(e) => handleChange('folioInicial', parseInt(e.target.value) || 1)}
                min={1}
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground">
                Número de folio para iniciar la facturación
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
            <Badge variant={cfdiData?.rfc && rfcValidation.valid ? "default" : "secondary"}>
              {cfdiData?.rfc && rfcValidation.valid ? "Configuración completa" : "Configuración pendiente"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {cfdiData?.rfc && rfcValidation.valid 
                ? "Tu negocio está listo para emitir facturas CFDI"
                : "Completa los campos requeridos para habilitar la facturación"
              }
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CFDISettings;
