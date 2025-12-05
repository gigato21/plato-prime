
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditProductModalFooter = ({ isLoading, onSubmit }) => {
  return (
    <DialogFooter>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="bg-cartaai-red hover:bg-cartaai-red/80"
      >
        {isLoading ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </DialogFooter>
  );
};

export default EditProductModalFooter;
