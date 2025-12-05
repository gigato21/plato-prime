const HorarioAtencion = ({ horarios = [], diaActual = '' }) => {
  if (!horarios || horarios.length === 0) {
    return (
      <div className="horario-container glass-container rounded-lg p-4">
        <h2 className="text-center font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
          Horario de atención
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          No hay horarios disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="horario-container glass-container rounded-lg p-4">
      <h2 className="text-center font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
        Horario de atención
      </h2>
      <ul className="space-y-2">
        {horarios.map((horario, index) => (
          <li 
            key={index} 
            className={`flex justify-between items-center py-1 ${
              horario.dia === diaActual 
                ? 'text-cartaai-red font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="w-20">{horario.dia}</span>
            <div className={`flex flex-col items-end ${
              horario.dia === diaActual 
                ? 'bg-cartaai-red/10 px-3 py-1 rounded-lg' 
                : ''
            }`}>
              <span>{horario.manana}</span>
              <span>{horario.tarde}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HorarioAtencion;