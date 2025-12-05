import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SavedZonesList = ({ zones }) => {
  if (!zones || zones.length === 0) return null;

  return (
    <Card className="glass-container">
      <CardHeader>
        <CardTitle className="text-cartaai-white">Zonas agregadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {zones.map((zone) => (
            <div key={zone.coberturaLocalId} className="bg-cartaai-white/10 p-3 rounded-lg">
              <p className="text-cartaai-white font-medium">{zone.coberturaLocalNombre}</p>
              <p className="text-cartaai-white/70 text-sm">
                Costo de envío: S/ {zone.coberturaLocalCostoEnvio}
              </p>
              {zone.coberturaLocalPermiteEnvioGratis === '1' && (
                <p className="text-cartaai-white/70 text-sm">
                  Envío gratis a partir de: S/ {zone.coberturaLocalMinimoParaEnvioGratis}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedZonesList;