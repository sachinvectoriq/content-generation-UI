//src\components\features\settings\AddModifierModal.jsx
import axios from 'axios';
import { CircleNotch, X } from 'phosphor-react';
import { useState, useRef, useEffect } from 'react';
// import endpoints from '../../../utils/constants/apiConfigs'; // Uncomment when you have this

const AddModifierModal = ({ onClose, onAdd, modifiers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

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
    inputRef.current?.focus();
  }, []);

  const createModifier = async () => {
    if (!title.trim()) {
      alert('Please provide modifier name');
      return;
    }

    const existingModifier = modifiers.find(
      (modifier) => modifier.modifier === title
    );
    if (existingModifier) {
      alert('Modifier Already Exists');
    } else {
      try {
        setIsLoading(true);
        
        // Mock API response - replace with actual API call
        setTimeout(() => {
          const newModifier = {
            modifier: title,
            description: description || 'New modifier description',
            status: 'active',
            sequence: modifiers.length + 1,
            values: []
          };
          
          onAdd(newModifier);
          alert('Modifier Created!');
          onClose();
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='z-50 fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative'
      >
        {/* Modal Header */}
        <div className='flex justify-between items-center sticky top-0 mb-4 bg-white'>
          <h2 className='text-lg font-semibold'>Add Modifier</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Modifier Name
            </label>
            <input
              ref={inputRef}
              type='text'
              className='w-full mt-1 p-2 border rounded-lg outline-none focus:ring-1 ring-blue-500'
              placeholder='Enter Modifier Name'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Description (Optional)
            </label>
            <textarea
              className='w-full mt-1 p-2 border rounded-lg outline-none focus:ring-1 ring-blue-500'
              placeholder='Enter modifier description'
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Create Button */}
        <button
          disabled={isLoading}
          onClick={createModifier}
          className='w-full mt-6 flex justify-center items-center font-semibold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex justify-center items-center gap-2 w-full'>
              <CircleNotch className='mt-1 animate-spin' /> <p>Creating</p>
            </div>
          ) : (
            'Create'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddModifierModal;
