//src\components\features\settings\EditModifierModal.jsx
import { X } from 'phosphor-react';
import { useState, useRef, useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import { updatePrompt } from '../../../services/promptService';

const EditModifierModal = ({ modifier, onClose, onUpdate }) => {
  const [content, setContent] = useState(modifier.content || '');
  const [description, setDescription] = useState(modifier.description || '');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Content is required');
      return;
    }

    try {
      setIsLoading(true);
      
      await updatePrompt(modifier.prompt_id, {
        content: content.trim(),
        description: description.trim()
      });
      
      // Call onUpdate if provided to refresh the parent component
      if (onUpdate) {
        onUpdate();
      }
      
      onClose();
      alert('Modifier updated successfully!');
      
    } catch (error) {
      console.error('Error updating modifier:', error);
      alert('Failed to update modifier: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='z-50 fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-hidden'
      >
        {/* Modal Header */}
        <div className='flex justify-between items-center sticky top-0 mb-4 bg-white'>
          <h2 className='text-xl font-semibold'>Edit {modifier.modifier}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className='overflow-y-auto max-h-[calc(90vh-180px)]'>
          {/* Description Display */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Description
            </label>
            <div className='p-3 bg-gray-50 rounded-lg border'>
              <p className='text-sm text-gray-600'>
                {description || 'No description'}
              </p>
            </div>
          </div>

          {/* Content Editor */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Content
            </label>
            <textarea
              className='w-full min-h-[300px] p-3 border rounded-lg resize-vertical'
              placeholder='Enter modifier content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='sticky bottom-0 bg-white pt-4 border-t flex gap-2'>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className='flex-1 font-semibold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50'
          >
            {isLoading ? (
              <div className='flex justify-center items-center gap-2'>
                <CircleNotch className='animate-spin' size={16} />
                <span>Saving</span>
              </div>
            ) : (
              'Save'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModifierModal;
