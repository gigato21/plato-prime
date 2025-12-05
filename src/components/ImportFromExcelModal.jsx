import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const ImportFromExcelModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedZones = jsonData.map((row, index) => ({
          id: Date.now() + index,
          name: row.name || '',
          cost: parseFloat(row.cost) || 0,
          phone: row.phone || ''
        }));

        onImport(importedZones);
        onClose();
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Importar desde Excel</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="bg-cartaai-white/10 text-cartaai-white"
          />
          <FileSpreadsheet className="h-6 w-6 text-cartaai-red" />
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={!file} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromExcelModal;