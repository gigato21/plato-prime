import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getApiUrls } from "@/config/api";
import { Bot, Save, Loader2 } from "lucide-react";

const BotConfig = () => {
  const navigate = useNavigate();
  const subDomain = useSelector((state) => state.auth.subDomain);
  const { SERVICIOS_GENERALES_URL } = getApiUrls();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [config, setConfig] = useState({
    greetingsStyle: '',
    communicationStyle: ''
  });

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/chatbot-rules/${subDomain}`);
        if (!response.ok) {
          throw new Error('Error al cargar la configuración');
        }
        const data = await response.json();
        setConfig({
          greetingsStyle: data.data?.greetingsStyle || '',
          communicationStyle: data.data?.communicationStyle || ''
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar la configuración');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [subDomain, SERVICIOS_GENERALES_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Crear un objeto solo con las propiedades que tienen contenido
      const payload = {};
      
      if (config.greetingsStyle.trim()) {
        payload.greetingsStyle = config.greetingsStyle;
      }
      
      if (config.communicationStyle.trim()) {
        payload.communicationStyle = config.communicationStyle;
      }

      // Si no hay cambios, mostrar mensaje y retornar
      if (Object.keys(payload).length === 0) {
        toast.info('No hay cambios para guardar');
        setIsSaving(false);
        return;
      }

      const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/chatbot-rules/update/${subDomain}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la configuración');
      }

      toast.success('Configuración actualizada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const defaultGreetingsStyle = `- Al saludar SIEMPRE usa este formato:
  * "Hola Sobrin@, soy el Tio Leñon, ¿en qué te puedo ayudar?"
- No uses otras variaciones del saludo`;

  const defaultCommunicationStyle = `- Usa siempre un tono familiar y cariñoso.
  - Trata a los clientes como "sobrin@".
  - Usa frases características como:
    * "¡Hola sobrin@! Soy el Tío Leñon."
    * "¿Deseas agregar algo más, sobrin@?"
    * "Tranquil@, sobrin@, ahora consultamos."
    * "¡Listo, sobrin@!"`;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="glass-container p-8 rounded-xl flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-cartaai-red" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="glass-container p-8 rounded-xl shadow-lg backdrop-blur-xl bg-background/80">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cartaai-red/10 rounded-xl">
            <Bot className="w-7 h-7 text-cartaai-red" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cartaai-red to-cartaai-red/80 bg-clip-text text-transparent">
              Configuración del Bot
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Personaliza el estilo de comunicación y saludos de tu bot de WhatsApp
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="greetingsStyle" className="text-lg font-semibold">Estilo de Saludos</Label>
            </div>
            <div className="relative">
              <Textarea
                id="greetingsStyle"
                value={config.greetingsStyle}
                onChange={(e) => setConfig({ ...config, greetingsStyle: e.target.value })}
                placeholder={defaultGreetingsStyle}
                className="glass-input min-h-[150px] font-mono text-sm border-2 focus:border-cartaai-red/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="communicationStyle" className="text-lg font-semibold">Estilo de Comunicación</Label>
            </div>
            <div className="relative">
              <Textarea
                id="communicationStyle"
                value={config.communicationStyle}
                onChange={(e) => setConfig({ ...config, communicationStyle: e.target.value })}
                placeholder={defaultCommunicationStyle}
                className="glass-input min-h-[200px] font-mono text-sm border-2 focus:border-cartaai-red/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-cartaai-red hover:bg-cartaai-red/90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BotConfig; 