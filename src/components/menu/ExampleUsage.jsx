
import { useMultipleLocalsUpdate } from '@/hooks/useMultipleLocalsUpdate';
import SelectLocalsModal from '../../pages/MenuManager/components/SelectLocalsModal';

const ExampleUsage = ({ productId }) => {
  const {
    isSelectLocalsModalOpen,
    setIsSelectLocalsModalOpen,
    handleUpdate,
    handleLocalsSelected,
    isLoading
  } = useMultipleLocalsUpdate({
    itemType: 'productos',
    rId: productId,
    invalidateQueries: [['products', productId]]
  });

  const handleProductUpdate = (newData) => {
    handleUpdate(newData);
  };

  return (
    <div>
      {/* Resto del componente */}
      
      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => setIsSelectLocalsModalOpen(false)}
        onConfirm={handleLocalsSelected}
        title="Seleccionar locales para actualizar"
      />
    </div>
  );
};

export default ExampleUsage;
