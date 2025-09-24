// src/components/ui/Dialog.jsx
import { CircleNotch } from 'phosphor-react';
import { useEffect, useRef } from 'react';

/**
 * Dialog for Deletion confirmations and other actions
 */
const Dialog = ({ title, description, onConfirm, onClose, isLoading }) => {
  const modalRef = useRef(null);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className='z-50 fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative'
      >
        <div className='mb-4'>
          <h2 className='text-2xl mb-2 font-semibold'>{title}</h2>
          <p className='text-gray-600'>{description}</p>
        </div>
        <div className='flex items-center justify-end gap-2'>
          <button
            onClick={onClose}
            className='bg-gray-200 font-semibold p-2 px-4 rounded-md hover:bg-gray-300 transition-colors'
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className='bg-red-500 text-white font-semibold p-2 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <span>Deleting</span>
                <CircleNotch className='mt-1 animate-spin' />
              </div>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
