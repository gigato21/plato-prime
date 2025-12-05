import { FaTimes } from 'react-icons/fa';

const ImgModal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" style={{ zIndex: 9999 }}>
      <div className="p-4 rounded-lg max-w-full max-h-full overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
          aria-label="Cerrar modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <div className="flex justify-center items-center h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ImgModal; 