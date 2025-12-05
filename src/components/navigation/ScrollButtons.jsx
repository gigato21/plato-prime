import { ChevronLeft, ChevronRight } from 'lucide-react';

const ScrollButtons = ({ showLeft, showRight, onScroll }) => {
  return (
    <>
      {showLeft && (
        <button
          onClick={() => onScroll('left')}
          className="fixed bottom-2 h-12 w-12 bg-background/95 backdrop-blur-sm z-50 hover:bg-accent transition-colors md:hidden flex items-center justify-center rounded-full shadow-lg border border-border" style={{ left: '-30px' }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {showRight && (
        <button
          onClick={() => onScroll('right')}
          className="fixed bottom-2  h-12 w-12 bg-background/95 backdrop-blur-sm z-50 hover:bg-accent transition-colors md:hidden flex items-center justify-center rounded-full shadow-lg border border-border" style={{ right: '-30px' }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default ScrollButtons;