import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mexicanBanks = [
  'BBVA México',
  'Banorte',
  'Santander',
  'Citibanamex',
  'HSBC',
  'Scotiabank',
  'BanRegio',
  'Banco Azteca',
  'Inbursa',
  'Bancos Afirme'
];

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
      tipoTransferenciaCodigoInterbancario: "", // CLABE en México
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

  const removeBankAccount = (index) => {
    const newAccounts = (data.localListaCuentasTransferencia || []).filter((_, i) => i !== index);
    updateData({
      ...data,
      localListaCuentasTransferencia: newAccounts
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Acepta pago en línea</Label>
            <p className="text-xs text-muted-foreground">Pagos con tarjeta, OXXO Pay, SPEI</p>
          </div>
          <Switch
            checked={data.localAceptaPagoEnLinea === "1"}
            onCheckedChange={() => handleSwitchChange('localAceptaPagoEnLinea')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Solo pago en línea</Label>
            <p className="text-xs text-muted-foreground">No acepta efectivo ni otros métodos</p>
          </div>
          <Switch
            checked={data.localSoloPagoEnLinea === "1"}
            onCheckedChange={() => handleSwitchChange('localSoloPagoEnLinea')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Acepta transferencia SPEI</Label>
            <p className="text-xs text-muted-foreground">Transferencias bancarias vía CLABE</p>
          </div>
          <Switch
            checked={data.localPagoTransferenciaMenuOnline === "1"}
            onCheckedChange={() => handleSwitchChange('localPagoTransferenciaMenuOnline')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Acepta tarjeta por delivery</Label>
            <p className="text-xs text-muted-foreground">Terminal portátil al momento de entrega</p>
          </div>
          <Switch
            checked={data.localAceptaTarjetaPorDelivery === "1"}
            onCheckedChange={() => handleSwitchChange('localAceptaTarjetaPorDelivery')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Acepta efectivo por delivery</Label>
            <p className="text-xs text-muted-foreground">Pago en efectivo al recibir pedido</p>
          </div>
          <Switch
            checked={data.localAceptaEfectivoPorDelivery === "1"}
            onCheckedChange={() => handleSwitchChange('localAceptaEfectivoPorDelivery')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div>
          <Label className="dark:text-gray-200 text-gray-700">Correo de notificaciones de pedidos</Label>
          <Input
            value={data.localCorreoDeliveryPersonalizado || ''}
            onChange={(e) => handleChange('localCorreoDeliveryPersonalizado', e.target.value)}
            className="glass-input text-cartaai-white mt-1"
            placeholder="pedidos@turestaurante.com.mx"
          />
        </div>
      </div>

      {data.localPagoTransferenciaMenuOnline === "1" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="dark:text-gray-200 text-gray-700 text-lg">Cuentas bancarias</Label>
              <p className="text-xs text-muted-foreground">Agrega tus cuentas para recibir transferencias SPEI</p>
            </div>
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
                  <TableHead className="dark:text-gray-200 text-gray-700">CLABE (18 dígitos)</TableHead>
                  <TableHead className="dark:text-gray-200 text-gray-700 w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.localListaCuentasTransferencia || []).map((account, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={account.tipoTransferenciaNombreEntidad}
                        onValueChange={(value) => handleBankAccountChange(index, 'tipoTransferenciaNombreEntidad', value)}
                      >
                        <SelectTrigger className="glass-input text-cartaai-white">
                          <SelectValue placeholder="Seleccionar banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {mexicanBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaTitular}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaTitular', e.target.value)}
                        className="glass-input text-cartaai-white"
                        placeholder="Nombre del titular"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaNumeroCuenta}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaNumeroCuenta', e.target.value)}
                        className="glass-input text-cartaai-white"
                        placeholder="Número de cuenta"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={account.tipoTransferenciaCodigoInterbancario}
                        onChange={(e) => handleBankAccountChange(index, 'tipoTransferenciaCodigoInterbancario', e.target.value)}
                        className="glass-input text-cartaai-white"
                        placeholder="CLABE interbancaria"
                        maxLength={18}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeBankAccount(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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