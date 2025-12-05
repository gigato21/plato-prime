import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryBar = ({ categorias, onSelectCategory, onSearch, selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); 
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const containerTop = containerRef.current?.offsetTop || 0;
      setIsSticky(window.scrollY > containerTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();

      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`glass-container rounded-lg p-4 mx-auto max-w-[1200px] transition-all duration-300 ${
        isSticky ? 'fixed top-0 left-0 right-0 z-50 rounded-none' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <div className="relative flex-1 min-w-0">
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide relative"
            style={{ scrollbarWidth: 'none' }}
          >
            <button
              className={`shrink-0 text-sm whitespace-nowrap px-3 py-1.5 rounded-lg transition-all duration-300 ${
                selectedCategory === null 
                  ? 'bg-cartaai-red text-white shadow-lg' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
              }`}
              onClick={() => onSelectCategory(null)}
            >
              Todos
            </button>
            {categorias?.map((categoria) => (
              <button
                key={categoria}
                className={`shrink-0 category-button text-sm transition-all duration-300 px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  selectedCategory === categoria 
                    ? 'bg-cartaai-red text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
                }`}
                onClick={() => onSelectCategory(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
          
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm p-1 rounded-full text-white sm:hidden animate-fade-in z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm p-1 rounded-full text-white sm:hidden animate-fade-in z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/10 dark:bg-black/20 
              text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
              border ${isFocused ? 'border-cartaai-red' : 'border-white/20'}
              transition-all duration-300 outline-none`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;