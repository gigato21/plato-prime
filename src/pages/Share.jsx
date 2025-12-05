import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';

const Share = () => {
  const qrRef = useRef(null);
  const qrValue = "https://menu.cartadirecta.com/restaurant/elmonumental"; // Replace with your actual menu URL
  const qrSize = 205;

  const downloadQR = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'menu-qr.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Error downloading QR code:', err);
        });
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Menú Digital',
          text: '¡Escanea este código QR para ver nuestro menú!',
          url: qrValue,
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      alert('La función de compartir no está disponible en tu dispositivo');
    }
  };

  return (
    <div className="container mx-auto p-1 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Compartir Menú</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <div className="glass-container p-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-lg" ref={qrRef}>
              <QRCodeSVG value={qrValue} size={qrSize} />
            </div>
            
            <p className="text-cartaai-white text-center text-lg font-medium">
              COMPARTA SU MENÚ CON SU PÚBLICO
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={downloadQR} 
                className="bg-cartaai-red hover:bg-cartaai-red/80 text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar Código QR
              </Button>
              
              <Button 
                onClick={shareQR} 
                className="bg-cartaai-red hover:bg-cartaai-red/80 text-white flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;