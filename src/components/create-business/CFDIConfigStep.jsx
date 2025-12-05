import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

const REGIMENES_FISCALES = [
  { codigo: "601", nombre: "General de Ley Personas Morales" },
  { codigo: "603", nombre: "Personas Morales con Fines no Lucrativos" },
  { codigo: "606", nombre: "Arrendamiento" },
  { codigo: "612", nombre: "Personas Físicas con Actividades Empresariales y Profesionales" },
  { codigo: "621", nombre: "Incorporación Fiscal" },
  { codigo: "625", nombre: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
  { codigo: "626", nombre: "Régimen Simplificado de Confianza" },
];

const validateRFC = (rfc) => {
  if (!rfc) return { valid: false, message: "" };
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
  if (!rfcPattern.test(rfc)) {
    return { valid: false, message: "Formato de RFC inválido" };
  }
  return { valid: true, message: "RFC válido" };
};

const CFDIConfigStep = ({ data, updateData }) => {
  const [rfcValidation, setRfcValidation] = useState({ valid: false, message: "" });

  useEffect(() => {
    if (data.rfc) {
      setRfcValidation(validateRFC(data.rfc));
    }
  }, []);

  const handleChange = (field, value) => {
    updateData({ ...data, [field]: value });
    
    if (field === 'rfc') {
      setRfcValidation(validateRFC(value.toUpperCase()));
    }
  };

  const handleSwitchChange = (field) => {
    updateData({ ...data, [field]: !data[field] });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Facturación Electrónica CFDI
          </h2>
          <p className="text-sm text-muted-foreground">
            Configura tus datos fiscales para emitir facturas electrónicas en México
          </p>
        </div>
      </div>

      {/* Activar facturación */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <Label className="text-foreground font-medium">Habilitar facturación CFDI</Label>
          <p className="text-xs text-muted-foreground">
            Activa esta opción si necesitas emitir facturas electrónicas
          </p>
        </div>
        <Switch
          checked={data.facturacionActiva || false}
          onCheckedChange={() => handleSwitchChange('facturacionActiva')}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {data.facturacionActiva && (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
          {/* RFC */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-foreground">
              RFC del Emisor *
            </Label>
            <div className="relative">
              <Input
                value={data.rfc || ''}
                onChange={(e) => handleChange('rfc', e.target.value.toUpperCase())}
                placeholder="XAXX010101000"
                maxLength={13}
                className="glass-input uppercase pr-10"
              />
              {data.rfc && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {rfcValidation.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            {data.rfc && !rfcValidation.valid && (
              <p className="text-xs text-destructive">{rfcValidation.message}</p>
            )}
          </div>

          {/* Razón Social */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-foreground">
              Razón Social *
            </Label>
            <Input
              value={data.razonSocial || ''}
              onChange={(e) => handleChange('razonSocial', e.target.value.toUpperCase())}
              placeholder="NOMBRE DE LA EMPRESA SA DE CV"
              className="glass-input uppercase"
            />
            <p className="text-xs text-muted-foreground">
              Debe coincidir con tu Constancia de Situación Fiscal
            </p>
          </div>

          {/* Régimen Fiscal */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-foreground">
              Régimen Fiscal *
            </Label>
            <Select
              value={data.regimenFiscal || ''}
              onValueChange={(value) => handleChange('regimenFiscal', value)}
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Selecciona tu régimen fiscal" />
              </SelectTrigger>
              <SelectContent>
                {REGIMENES_FISCALES.map((regimen) => (
                  <SelectItem key={regimen.codigo} value={regimen.codigo}>
                    <span className="font-mono text-xs mr-2">{regimen.codigo}</span>
                    {regimen.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Código Postal Fiscal */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base text-foreground">
              Código Postal Fiscal *
            </Label>
            <Input
              value={data.codigoPostalFiscal || ''}
              onChange={(e) => handleChange('codigoPostalFiscal', e.target.value.replace(/\D/g, ''))}
              placeholder="06600"
              maxLength={5}
              className="glass-input"
            />
            <p className="text-xs text-muted-foreground">
              Código postal registrado ante el SAT
            </p>
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground text-sm">Solicitar datos fiscales al cliente</Label>
                <p className="text-xs text-muted-foreground">
                  Pedir RFC durante el checkout
                </p>
              </div>
              <Switch
                checked={data.solicitarDatosFiscales || false}
                onCheckedChange={() => handleSwitchChange('solicitarDatosFiscales')}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground text-sm">Facturación automática</Label>
                <p className="text-xs text-muted-foreground">
                  Generar CFDI al confirmar pedido
                </p>
              </div>
              <Switch
                checked={data.facturacionAutomatica || false}
                onCheckedChange={() => handleSwitchChange('facturacionAutomatica')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CFDIConfigStep;
