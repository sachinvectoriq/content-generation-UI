//src\components\features\settings\PromptModal.jsx
import { CircleNotch, X } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import { getPrompts, updatePrompt } from '../../../services/promptService';

const PromptModal = ({ onClose, onAdd }) => {
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [corePromptId, setCorePromptId] = useState(null);
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Close modal when clicking outside
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

  useEffect(() => {
    const fetchCoreSystemPrompt = async () => {
      try {
        setIsFetching(true);
        
        // Fetch all prompts and find the one with prompt_id: 0
        const prompts = await getPrompts();
        const corePrompt = prompts.find(prompt => prompt.prompt_id === 0);
        
        if (corePrompt) {
          setContent(corePrompt.content || '');
          setDescription(corePrompt.description || '');
          setCorePromptId(corePrompt.prompt_id);
        } else {
          console.warn('Core system prompt (prompt_id: 0) not found');
          setContent('');
          setDescription('');
        }
        
      } catch (error) {
        console.error('Error fetching core system prompt:', error);
        setContent('');
        setDescription('');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchCoreSystemPrompt();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please provide a prompt content');
      return;
    }
    
    if (corePromptId === null) {
      alert('Core prompt not found');
      return;
    }
    
    try {
      setIsLoading(true);
      
      await updatePrompt(corePromptId, {
        content: content.trim(),
        description: description.trim()
      });
      
      onAdd({ content, description });
      onClose();
      alert('Core System Prompt updated successfully!');
      
    } catch (error) {
      console.error('Error updating core system prompt:', error);
      alert('Failed to update core system prompt: ' + error.message);
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
          <h2 className='text-lg font-semibold'>Core System Prompt</h2>

          <div className='flex gap-6 items-center'>
            {isFetching && (
              <p className='text-gray-500 flex items-center gap-2'>
                <CircleNotch className='animate-spin' size={16} /> Loading
              </p>
            )}
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='overflow-y-auto max-h-[calc(90vh-180px)]'>
          {/* Description */}
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

          {/* Content */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              System Prompt Content
            </label>
            <textarea
              className='w-full min-h-[300px] p-3 border rounded-lg resize-vertical'
              placeholder='Enter system prompt content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isFetching}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className='sticky bottom-0 bg-white pt-4 border-t'>
          <button
            disabled={isLoading || isFetching}
            onClick={handleSave}
            className='w-full font-semibold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50'
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
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
