import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";

const SaveButton = ({ onSave, isSaved, isActiveError, isLoading }) => {
  return (
    <div className="flex justify-end mt-8">
      <Button
        onClick={onSave}
        disabled={isLoading}
        className={`relative px-6 py-2 rounded-lg transition-all duration-300 save-button ${
          isSaved
            ? 'bg-green-500 hover:bg-green-600'
            : isActiveError
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-cartaai-red hover:bg-cartaai-red/90'
        }`}
      >
        <span className="flex items-center">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : isSaved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Guardado
            </>
          ) : isActiveError ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Error al guardar
            </>
          ) : (
            'Guardar cambios'
          )}
        </span>
      </Button>
    </div>
  );
};

export default SaveButton;