import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPrevNext = true,
  showFirstLast = true,
  maxVisiblePages = 5
}) => {
  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const ButtonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const PageButton = ({ page, isActive, disabled, children, onClick }) => (
    <motion.button
      variants={ButtonVariants}
      whileHover={!disabled ? "hover" : {}}
      whileTap={!disabled ? "tap" : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon' 
          : disabled
            ? 'text-gray-500 cursor-not-allowed'
            : 'text-gray-300 hover:text-white hover:bg-cyber-light border border-transparent hover:border-neon-blue/30'
        }
      `}
    >
      {children}
      
      {/* Active page glow effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur-sm opacity-30 -z-10"></div>
      )}
    </motion.button>
  );

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-2 py-8">
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        {showPrevNext && (
          <PageButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={18} />
          </PageButton>
        )}

        {/* First Page */}
        {showFirstLast && showLeftEllipsis && (
          <>
            <PageButton
              page={1}
              onClick={() => handlePageChange(1)}
            >
              1
            </PageButton>
            
            {visiblePages[0] > 2 && (
              <div className="px-2 py-2 text-gray-500">
                <MoreHorizontal size={18} />
              </div>
            )}
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map(page => (
          <PageButton
            key={page}
            page={page}
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PageButton>
        ))}

        {/* Last Page */}
        {showFirstLast && showRightEllipsis && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <div className="px-2 py-2 text-gray-500">
                <MoreHorizontal size={18} />
              </div>
            )}
            
            <PageButton
              page={totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PageButton>
          </>
        )}

        {/* Next Button */}
        {showPrevNext && (
          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={18} />
          </PageButton>
        )}
      </div>

      {/* Page Info */}
      <div className="hidden sm:flex items-center space-x-2 ml-8 text-sm text-gray-400">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </nav>
  );
};

export default Pagination;
