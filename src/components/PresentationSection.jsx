const PresentationSection = ({ 
    backgroundImage, 
    logoImage, 
    title, 
    description, 
    link 
  }) => {
    return (
      <div 
        className="presentation-section relative flex justify-center" 
        style={{ minHeight: '400px', boxSizing: 'border-box' }}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage} 
            alt="Fondo" 
            className="w-full h-full object-cover" 
            style={{ filter: 'brightness(0.5)' }} 
          />
        </div>
        <div 
          className="absolute bottom-0 w-full flex flex-col md:flex-row items-center justify-between z-10 pb-5 px-5" 
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-grow">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="logo mb-2" 
              width={72} 
            />
            <h1 className="title text-[1.75rem] md:text-[38px] font-semibold text-white">
              {title}
            </h1>
            <p className="description" style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>
              {description}
            </p>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link transition-colors duration-300 text-white hover:text-red-400 border-b border-b-white hover:border-b-red-400" 
              style={{ fontSize: '1rem' }}
            >
              Ver dirección {'>'} 
            </a>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto">
            <button 
              className="call-button" 
              style={{ padding: '8px 16px', backgroundColor: '#ff6600', color: 'white', borderRadius: '4px'}}
            >
              Llamar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default PresentationSection;