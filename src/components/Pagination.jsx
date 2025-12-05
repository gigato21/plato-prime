import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <Button 
        variant="outline" 
        className="text-cartaai-white border-cartaai-black bg-cartaai-black hover:bg-cartaai-black hover:text-cartaai-red"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          className={`
            ${page === currentPage
              ? "bg-cartaai-red hover:bg-cartaai-red/80 text-cartaai-white border-cartaai-red"
              : "text-cartaai-white border-cartaai-black bg-cartaai-black hover:bg-cartaai-black hover:text-cartaai-red"
            }
          `}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button 
        variant="outline" 
        className="text-cartaai-white border-cartaai-black bg-cartaai-black hover:bg-cartaai-black hover:text-cartaai-red"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;