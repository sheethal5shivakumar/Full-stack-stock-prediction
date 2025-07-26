"use client";
import React, { useEffect, useRef } from "react";

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  // Create a ref for the modal container
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle ESC key press to close the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    
    // Handle clicks outside the modal to close it
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Focus trap - focus the first button when modal opens
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = '';
    };
  }, [onCancel, isLoading]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-[#1e1e1e] border border-[#333] p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in mx-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-5">
          <h2 id="modal-title" className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-sm text-gray-300 break-words whitespace-normal">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-[#252525] hover:bg-[#333] text-gray-300 rounded-lg transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-[#1e1e1e]"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-[#1e1e1e] flex items-center justify-center min-w-[80px] shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 