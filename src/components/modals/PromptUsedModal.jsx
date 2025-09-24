//src\components\modals\PromptUsedModal.jsx
import { X } from 'phosphor-react';
import { useEffect, useRef } from 'react';

const PromptUsedModal = ({ onClose, prompt }) => {
  const modalRef = useRef(null);

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
        className='bg-white rounded-lg shadow-lg p-6 w-full max-w-[560px] relative'
      >
        <div className='flex justify-between items-center sticky top-0 mb-4 bg-white'>
          <h2 className='text-lg font-semibold'>Prompt Used</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>
        
        <div className='max-h-[60vh] p-4 space-y-4 bg-gray-50 rounded-lg overflow-y-auto'>
          <section>
            <h3 className='mb-2 font-semibold text-gray-800'>Human Message</h3>
            <p className='text-gray-700 whitespace-pre-wrap'>{prompt.human_message}</p>
          </section>
          
          <section>
            <h3 className='mb-2 font-semibold text-gray-800'>System Message</h3>
            <p className='text-gray-700 whitespace-pre-wrap'>{prompt.system_message}</p>
          </section>
        </div>
        
        <button
          className='w-full mt-4 p-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700'
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PromptUsedModal;
