const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-cartaai-white text-lg animate-pulse">Cargando imágenes...</p>
    </div>
  );
};

export default Loader;