const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Información básica" },
    { number: 2, title: "Ubicación y contacto" },
    { number: 3, title: "Configuración crítica" },
    { number: 4, title: "Impuestos" },
  ];

  return (
    <div className="flex justify-between">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex flex-col items-center ${
            currentStep >= step.number ? "text-cartaai-red" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${
              currentStep >= step.number
                ? "bg-cartaai-red border-cartaai-red text-white"
                : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
            }`}
          >
            {step.number}
          </div>
          <span className="text-xs text-center">{step.title}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;