
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PaymentConfigStep = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({ ...data, [field]: value });
  };

  const handleSwitchChange = (field) => {
    updateData({
      ...data,
      [field]: data[field] === "1" ? "0" : "1"
    });
  };

  const handleBankAccountChange = (index, field, value) => {
    const newAccounts = [...(data.localListaCuentasTransferencia || [])];
    newAccounts[index] = {
      ...newAccounts[index],
      [field]: value
    };
    updateData({
      ...data,
      localListaCuentasTransferencia: newAccounts
    });
  };

  const addBankAccount = () => {
    const newAccount = {
      tipoTransferenciaId: "",
      tipoTransferenciaNombreEntidad: "",
      tipoTransferenciaNumeroCuenta: "",
      tipoTransferenciaCodigoInterbancario: "",
      tipoTransferenciaTipo: "1",
      tipoTransferenciaTitular: "",
      tipoTransferenciaEstado: "1",
      localId: data.localId || ""
    };

    updateData({
      ...data,
      localListaCuentasTransferencia: [...(data.localListaCuentasTransferencia || []), newAccount]
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Acepta pago en línea</Label>
          <Switch
            checked={data.localAceptaPagoEnLinea === "1"}
            onCheckedChange={() => handleSwitchChange('localAceptaPagoEnLinea')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Solo pago en línea</Label>
          <Switch
            checked={data.localSoloPagoEnLinea === "1"}
            onCheckedChange={() => handleSwitchChange('localSoloPagoEnLinea')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Acepta transferencia bancaria</Label>
          <Switch
            checked={data.localPagoTransferenciaMenuOnline === "1"}
            onCheckedChange={() => handleSwitchChange('localPagoTransferenciaMenuOnline')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Acepta tarjeta por delivery</Label>
          <Switch
            checked={data.localAceptaTarjetaPorDelivery === "1"}
            onCheckedChange={() => handleSwitchChange('localAceptaTarjetaPorDelivery')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Acepta efectivo por delivery</Label>
          <Switch
            checked={data.localAceptaEfectivoPorDelivery === "1"}
            onCheckedChange={() => handleSwitchChange('localAceptaEfectivoPorDelivery')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div>
          <Label className="dark:text-gray-200 text-gray-700">Correo de delivery personalizado</Label>
          <Input
            value={data.localCorreoDeliveryPersonalizado || ''}
            onChange={(e) => handleChange('localCorreoDeliveryPersonalizado', e.target.value)}
            className="glass-input text-cartaai-white mt-1"
            placeholder="ejemplo@tudominio.com"
          />
        </div>
      </div>

      {data.localPagoTransferenciaMenuOnline === "1" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="dark:text-gray-200 text-gray-700 text-lg">Cuentas bancarias</Label>
            <Button
              onClick={addBankAccount}
              variant="outline"
              size="sm"
              className="glass-input dark:text-gray-200 text-gray-700 border-gray-200 dark:border-gray-700 hover:bg-cartaai-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar cuenta
            </Button>
          </div>

          <div className="rounded-md border border-gray-400 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="dark:text-gray-200 text-gray-700">Banco</TableHead>
                  <TableHead className="dark:text-gray-200 text-gray-700">Titular</TableHead>
                  <TableHead className="dark:text-gray-200 text-gray-700">Número de cuenta</TableHead>
                  <TableHead className="dark:text-gray-200 text-gray-700">CCI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.localListaCuentasTransferencia || []).map((account, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaNombreEntidad}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaNombreEntidad', e.target.value)}
                        className="glass-input text-cartaai-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaTitular}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaTitular', e.target.value)}
                        className="glass-input text-cartaai-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaNumeroCuenta}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaNumeroCuenta', e.target.value)}
                        className="glass-input text-cartaai-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaCodigoInterbancario}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaCodigoInterbancario', e.target.value)}
                        className="glass-input text-cartaai-white"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfigStep;