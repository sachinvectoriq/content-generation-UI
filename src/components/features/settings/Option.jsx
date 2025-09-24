//src\components\features\settings\Option.jsx
import axios from 'axios';
import { CircleNotch, Pencil, Trash } from 'phosphor-react';
import { useState } from 'react';
// import endpoints from '../../../utils/constants/apiConfigs'; // Uncomment when you have this

const Option = ({ index, option, values, setValues }) => {
  const [isEditingOption, setIsEditingOption] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    newValue: option.value,
    systemPrompt: option.system,
    userPrompt: option.user,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newValue, systemPrompt, userPrompt } = formData;

    if (!newValue.trim() || !systemPrompt.trim() || !userPrompt.trim()) {
      alert('All fields are required');
      return;
    }

    const existingValue = values
      .filter((val) => val.value !== option.value)
      .find((val) => val.value === newValue);

    if (existingValue) {
      alert('Value already exists');
    } else {
      try {
        setIsEditLoading(true);
        
        // Mock API response - replace with actual API call
        setTimeout(() => {
          const updatedOption = {
            ...option,
            value: newValue,
            system: systemPrompt,
            user: userPrompt
          };
          
          const updatedValues = values.map((v) => {
            if (v.id === option.id) {
              return updatedOption;
            }
            return v;
          });
          
          setValues(updatedValues);
          setIsEditingOption(false);
          alert('Value Updated!');
          setIsEditLoading(false);
        }, 1000);

      } catch (error) {
        console.log(error);
        alert('Failed to update value!');
        setIsEditLoading(false);
      }
    }
  };

  const deleteValue = async () => {
    if (!confirm('Are you sure you want to delete this value?')) return;
    
    try {
      setIsDeleteLoading(true);
      
      // Mock API response - replace with actual API call
      setTimeout(() => {
        setValues(values.filter((value) => value.id !== option.id));
        alert('Value deleted!');
        setIsDeleteLoading(false);
      }, 1000);

    } catch (error) {
      console.log(error);
      alert('Failed to delete value!');
      setIsDeleteLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditingOption(false);
    setFormData({
      newValue: option.value,
      systemPrompt: option.system,
      userPrompt: option.user,
    });
  };

  return (
    <div className=''>
      <div className='flex items-center justify-between p-2 px-3 bg-gray-100 rounded-lg'>
        <span className='text-sm font-medium'>{option.value}</span>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsEditingOption(!isEditingOption)}
            className='text-gray-500 hover:text-blue-500 transition-colors'
            disabled={isDeleteLoading}
          >
            <Pencil size={16} />
          </button>
          <button
            disabled={option.value === 'User Defined' || isDeleteLoading}
            onClick={deleteValue}
            className={`text-gray-500 hover:text-red-500 transition-colors ${
              option.value === 'User Defined' || isDeleteLoading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isDeleteLoading ? <CircleNotch className='animate-spin' size={16} /> : <Trash size={16} />}
          </button>
        </div>
      </div>

      {isEditingOption && (
        <form onSubmit={handleSubmit} className='py-2 p-4 space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Value
            </label>
            <input
              className='w-full mt-1 p-2 border rounded-lg'
              placeholder='Enter value'
              name='newValue'
              value={formData.newValue}
              onChange={handleInputChange}
              disabled={option.value === 'User Defined'}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              System Prompt
            </label>
            <textarea
              className='w-full mt-1 p-2 border rounded-lg'
              placeholder='Enter system prompts'
              name='systemPrompt'
              value={formData.systemPrompt}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              User Prompt
            </label>
            <textarea
              className='w-full mt-1 p-2 border rounded-lg'
              placeholder='Enter user prompts'
              name='userPrompt'
              value={formData.userPrompt}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className='flex items-center gap-2'>
            <button
              type='submit'
              disabled={isEditLoading}
              className='bg-blue-500 hover:bg-blue-700 text-white p-2 px-4 rounded-md text-sm font-semibold flex items-center gap-2 disabled:opacity-50'
            >
              {isEditLoading ? (
                <>
                  <span>Saving</span>
                  <CircleNotch className='mt-1 animate-spin' />
                </>
              ) : (
                'Save'
              )}
            </button>
            <button
              type='button'
              onClick={cancelEdit}
              className='bg-red-500 hover:bg-red-700 text-white p-2 px-4 rounded-md text-sm font-semibold'
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Option;
