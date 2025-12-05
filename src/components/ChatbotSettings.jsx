import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountryCodeSelect from "./CountryCodeSelect";

const ChatbotSettings = ({ chatbotData, setChatbotData }) => {
  // Descomponer el chatbotNumber en código de país y número local
  const [countryCode, setCountryCode] = React.useState(chatbotData.chatbotNumber.split(" ")[0] || "+51");
  const [phoneNumber, setPhoneNumber] = React.useState(chatbotData.chatbotNumber.split(" ")[1] || "");

  // Manejar cambios en el número local
  const handlePhoneChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Solo números
    if (numericValue.length <= 15) {
      setPhoneNumber(numericValue);
      setChatbotData({ ...chatbotData, chatbotNumber: `${countryCode} ${numericValue}` });
    }
  };

  // Manejar cambios en el código de país
  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
    setChatbotData({ ...chatbotData, chatbotNumber: `${value} ${phoneNumber}` });
  };

  return (
    <Card className="bg-cartaai-black/50 p-6 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-200 text-gray-700 border-b border-cartaai-white/10 pb-2">
          Configuración del Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="dark:text-gray-200 text-gray-700">Número de WhatsApp para el chatbot</Label>
          <div className="flex mt-1">
            <CountryCodeSelect
              value={countryCode}
              onChange={handleCountryCodeChange}
            />
            <Input
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="bg-cartaai-white/10 dark:text-gray-200 text-gray-700 ml-2 flex-grow"
              placeholder="Número de WhatsApp"
              type="tel"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotSettings;
