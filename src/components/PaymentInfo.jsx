import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, PencilLine } from 'lucide-react';

// Constantes para los tipos
const TransferType = {
  NORMAL: 0,
  MOBILE: 1
};

const Banks = {
  BCP: 'BCP',
  BBVA: 'BBVA',
  INTERBANK: 'INTERBANK'
};

const MobilePayments = {
  YAPE: 'YAPE',
  PLIN: 'PLIN'
};

const BankAccountForm = ({ account, onSave, onCancel }) => {
  const [formData, setFormData] = useState(account || {
    bank: '',
    accountName: '',
    accountNumber: '',
    interBankAccountNumber: '',
    type: TransferType.NORMAL
  });

  const isDigitalWallet = formData.bank === MobilePayments.YAPE || formData.bank === MobilePayments.PLIN;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      type: isDigitalWallet ? TransferType.MOBILE : TransferType.NORMAL,
      interBankAccountNumber: isDigitalWallet ? '' : formData.interBankAccountNumber
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-cartaai-white">Tipo de cuenta</Label>
        <Select
          value={formData.bank}
          onValueChange={(value) => setFormData(prev => ({ ...prev, bank: value }))}
        >
          <SelectTrigger className="glass-input text-cartaai-white">
            <SelectValue placeholder="Seleccione un banco" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Banks).map(bank => (
              <SelectItem key={bank} value={bank}>{bank}</SelectItem>
            ))}
            {Object.values(MobilePayments).map(payment => (
              <SelectItem key={payment} value={payment}>{payment}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-cartaai-white">
          {isDigitalWallet ? "Número de celular" : "Número de cuenta"}
        </Label>
        <Input
          value={formData.accountNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
          className="glass-input text-cartaai-white"
          placeholder={isDigitalWallet ? "Ej: 999888777" : "Ej: 123-456789-0-12"}
        />
      </div>

      <div>
        <Label className="text-cartaai-white">Nombre del titular</Label>
        <Input
          value={formData.accountName}
          onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
          className="glass-input text-cartaai-white"
          placeholder="Ej: EMPRESA SAC"
        />
      </div>

      {!isDigitalWallet && (
        <div>
          <Label className="text-cartaai-white">CCI</Label>
          <Input
            value={formData.interBankAccountNumber}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              interBankAccountNumber: e.target.value 
            }))}
            className="glass-input text-cartaai-white"
            placeholder="Ej: 002-123-456789012345-12"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80">
          {account ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
    </form>
  );
};

const PaymentInfo = ({ paymentData, setPaymentData }) => {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddAccount = (newAccount) => {
    setPaymentData(prev => ({
      ...prev,
      cuentasBancarias: [...(prev.cuentasBancarias || []), newAccount]
    }));
    setIsAddingAccount(false);
  };

  const handleEditAccount = (updatedAccount, index) => {
    setPaymentData(prev => ({
      ...prev,
      cuentasBancarias: prev.cuentasBancarias.map((acc, i) => 
        i === index ? updatedAccount : acc
      )
    }));
    setEditingIndex(null);
  };

  const handleDeleteAccount = (index) => {
    setPaymentData(prev => ({
      ...prev,
      cuentasBancarias: prev.cuentasBancarias.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="bg-cartaai-black/50 p-6 rounded-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-cartaai-white/10 pb-4">
          <h2 className="text-2xl font-semibold text-cartaai-white">
            Métodos de Pago
          </h2>
          <p className="text-sm text-cartaai-white/70">
            Configura las cuentas bancarias para recibir pagos
          </p>
        </div>

        <div className="space-y-4">
          {paymentData.cuentasBancarias?.map((account, index) => (
            editingIndex === index ? (
              <BankAccountForm
                key={index}
                account={account}
                onSave={(updatedAccount) => handleEditAccount(updatedAccount, index)}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div key={index} className="p-4 bg-cartaai-white/5 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-cartaai-white font-medium">{account.bank}</h3>
                    <p className="text-sm text-cartaai-white/70">{account.accountName}</p>
                    <p className="text-sm text-cartaai-white/70">
                      {account.type === TransferType.MOBILE ? 'Celular: ' : 'Cuenta: '}
                      {account.accountNumber}
                    </p>
                    {account.type === TransferType.NORMAL && account.interBankAccountNumber && (
                      <p className="text-sm text-cartaai-white/70">
                        CCI: {account.interBankAccountNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingIndex(index)}
                      className="text-cartaai-white hover:text-cartaai-red"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteAccount(index)}
                      className="text-cartaai-white hover:text-cartaai-red"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          ))}

          {!isAddingAccount && (
            <Button
              onClick={() => setIsAddingAccount(true)}
              className="w-full bg-cartaai-white/10 hover:bg-cartaai-white/20 text-cartaai-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar cuenta bancaria
            </Button>
          )}

          {isAddingAccount && (
            <BankAccountForm
              onSave={handleAddAccount}
              onCancel={() => setIsAddingAccount(false)}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default PaymentInfo;