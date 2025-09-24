//src\components\features\settings\SequenceModal.jsx
import axios from 'axios';
import { CircleNotch, X } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
// import endpoints from '../../../utils/constants/apiConfigs'; // Uncomment when you have this

const SequenceModal = ({ onClose, modifiers }) => {
  const [localModifiers, setLocalModifiers] = useState([]);
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    setLocalModifiers([...modifiers]);
  }, [modifiers]);

  const handleSequenceChange = (index, value) => {
    const updated = [...localModifiers];
    const parsed = parseInt(value);

    if (value > localModifiers.length) {
      updated[index].sequence = value;
      setError('The sequence should be less than or equal to number of modifiers');
      setHasDuplicate(false);
    } else if (!value.trim()) {
      updated[index].sequence = '';
      setError('Please provide a value');
      setHasDuplicate(false);
    } else if (isNaN(parsed)) {
      updated[index].sequence = '';
      setError('Please provide a valid number');
      setHasDuplicate(false);
    } else if (parsed <= 0) {
      updated[index].sequence = parsed;
      setError('Please provide positive values');
      setHasDuplicate(false);
    } else {
      updated[index].sequence = parsed;
      setError('');
      const sequences = updated
        .map((mod) => mod.sequence)
        .filter((val) => val !== '' && !isNaN(val));
      const hasDup = sequences.some((seq, i) => sequences.indexOf(seq) !== i);
      setHasDuplicate(hasDup);
    }
    setLocalModifiers(updated);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Mock API response - replace with actual API call
      setTimeout(() => {
        alert('Sequence Updated Successfully!');
        setIsLoading(false);
        onClose();
      }, 1000);

    } catch (error) {
      console.log(error.message);
      alert('Failed to Update Sequence');
      setIsLoading(false);
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
          <h2 className='text-lg font-semibold'>Set Sequence</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>

        <section className='space-y-4'>
          {localModifiers.map((modifier, index) => (
            <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
              <div className='flex w-full justify-between items-center'>
                <p className='font-medium'>{modifier.modifier}</p>
                <input
                  type='number'
                  className='border w-20 p-2 rounded-md text-center'
                  value={modifier.sequence}
                  min="1"
                  max={localModifiers.length}
                  onChange={(e) => handleSequenceChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </section>

        {hasDuplicate && (
          <p className='text-red-500 mb-2 text-sm text-center mt-4'>
            Duplicate sequence values are not allowed.
          </p>
        )}

        {error && (
          <p className='text-red-500 mb-2 text-sm text-center mt-4'>{error}</p>
        )}

        <button
          disabled={isLoading || hasDuplicate || error.length > 0}
          onClick={handleSave}
          className={`w-full flex justify-center items-center font-semibold text-white py-2 rounded-lg mt-6
          ${
            isLoading || hasDuplicate || error.length > 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? (
            <div className='flex justify-center items-center gap-2 w-full'>
              <CircleNotch className='mt-1 animate-spin' /> <p>Saving</p>
            </div>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
};

export default SequenceModal;
