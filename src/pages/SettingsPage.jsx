// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { 
  PencilSimple, 
  Trash, 
  Plus, 
  CheckCircle, 
  ListDashes, 
  Check, 
  Pencil 
} from 'phosphor-react';

const SettingsPage = () => {
  const [tokenLimit, setTokenLimit] = useState(4000);
  const [isEditingLimit, setIsEditingLimit] = useState(false);

  // Mock data for modifiers - replace with your API data
  const [modifiers, setModifiers] = useState([
    {
      modifier: 'Audience',
      description: 'Description',
      status: 'active',
      sequence: 1
    },
    {
      modifier: 'Tone',
      description: 'Description', 
      status: 'active',
      sequence: 2
    },
    {
      modifier: 'Context',
      description: 'Description',
      status: 'active', 
      sequence: 3
    },
    {
      modifier: 'Coherence',
      description: 'Description',
      status: 'inactive',
      sequence: 4
    },
    {
      modifier: 'Domain',
      description: 'Description',
      status: 'inactive',
      sequence: 5
    }
  ]);

  const handleUpdateLimit = () => {
    // Add your update logic here
    console.log('Updating token limit to:', tokenLimit);
    setIsEditingLimit(false);
  };

  const handleEditModifier = (modifier) => {
    console.log('Edit modifier:', modifier);
  };

  const handleToggleStatus = (modifierName) => {
    setModifiers(prevModifiers => 
      prevModifiers.map(mod => 
        mod.modifier === modifierName 
          ? { ...mod, status: mod.status === 'active' ? 'inactive' : 'active' }
          : mod
      )
    );
  };

  const handleDeleteModifier = (modifierName) => {
    console.log('Delete modifier:', modifierName);
  };

  const handleSetSequence = () => {
    console.log('Set sequence');
  };

  const handleCoreSystemPrompt = () => {
    console.log('Core system prompt');
  };

  const handleAddModifier = () => {
    console.log('Add modifier');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <h4 className="text-sm text-gray-600 font-semibold">
          Settings / Context Configuration
        </h4>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Context-sense Modifiers</h2>
        
        <div className="flex items-center gap-3">
          {/* Token Limit Section */}
          <div className="flex gap-2 bg-white p-3 rounded-lg border border-gray-200 items-center">
            <span className="font-medium text-gray-700">Token Limit</span>
            {isEditingLimit ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tokenLimit}
                  className="w-20 px-2 py-1 rounded border border-gray-300 text-sm"
                  onChange={(e) => setTokenLimit(e.target.value)}
                />
                <button 
                  onClick={handleUpdateLimit}
                  className="text-green-600 hover:text-green-800"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-orange-500">{tokenLimit}</span>
                <button 
                  onClick={() => setIsEditingLimit(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Set Sequence Button */}
          <button
            onClick={handleSetSequence}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <ListDashes size={16} />
            Set Sequence
          </button>

          {/* Core System Prompt Button */}
          <button
            onClick={handleCoreSystemPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <PencilSimple size={16} />
            Core System Prompt
          </button>

          {/* Add Modifier Button */}
          <button
            onClick={handleAddModifier}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Modifier
          </button>
        </div>
      </div>

      {/* Modifiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {modifiers
          .sort((a, b) => a.sequence - b.sequence)
          .map((modifier, index) => (
            <div
              key={index}
              className="bg-white min-h-[140px] p-4 rounded-lg shadow-sm border border-gray-200 relative hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{modifier.modifier}</h3>
                <div className="flex gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditModifier(modifier)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit Modifier"
                  >
                    <PencilSimple size={16} />
                  </button>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(modifier.modifier)}
                    className={`transition-colors ${
                      modifier.status === 'active'
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                    title={modifier.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <CheckCircle 
                      weight={modifier.status === 'active' ? 'fill' : 'regular'} 
                      size={16} 
                    />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteModifier(modifier.modifier)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete Modifier"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{modifier.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SettingsPage;