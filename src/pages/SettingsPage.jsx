// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  PencilSimple, 
  Trash, 
  Plus, 
  CheckCircle, 
  ListDashes, 
  Check, 
  Pencil 
} from 'phosphor-react';

// Modal and UI component imports
import EditModifierModal from '../components/features/settings/EditModifierModal';
import AddModifierModal from '../components/features/settings/AddModifierModal';
import PromptModal from '../components/features/settings/PromptModal';
import SequenceModal from '../components/features/settings/SequenceModal';
import Dialog from '../components/ui/Dialog';
import PromptUsedModal from '../components/modals/PromptUsedModal';

// API service imports
import { 
  getPrompts, 
  createPrompt, 
  deletePrompt, 
  updatePrompt,
  getPromptTokenLimit,
  updatePromptTokenLimit
} from '../services/promptService';

const SettingsPage = () => {
  const [modifiers, setModifiers] = useState([]);
  const [tokenLimit, setTokenLimit] = useState(null);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isSequenceModalOpen, setIsSequenceModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPromptUsedModalOpen, setIsPromptUsedModalOpen] = useState(false);
  
  // Selected modifier states
  const [selectedModifier, setSelectedModifier] = useState(null);
  const [modifierToDelete, setModifierToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Function to refresh modifiers data
  const refreshModifiers = async () => {
    try {
      const prompts = await getPrompts();
      
      if (!Array.isArray(prompts)) {
        throw new Error('Invalid data format received from server');
      }
      
      // Filter out prompt_id 0 (core system prompt) from modifiers
      const filteredPrompts = prompts.filter(p => p.prompt_id !== 0);
      
      const formattedModifiers = filteredPrompts.map(p => ({
        prompt_id: p.prompt_id,
        modifier: p.name || 'Unnamed Modifier',
        description: p.description || 'No description',
        content: p.content || '',
        status: 'active',
        sequence: p.prompt_id,
        values: [],
      }));
      
      setModifiers(formattedModifiers);
      
    } catch (err) {
      console.error("Failed to refresh modifiers:", err);
      setError(`Failed to refresh modifiers: ${err.message}`);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [prompts, limitResponse] = await Promise.all([
          getPrompts(),
          getPromptTokenLimit()
        ]);
        
        console.log('Fetched prompts:', prompts);
        console.log('Fetched token limit:', limitResponse);
        
        // Validate prompts data structure
        if (!Array.isArray(prompts)) {
          throw new Error('Invalid data format received from server');
        }
        
        // Filter out prompt_id 0 (core system prompt) from modifiers
        const filteredPrompts = prompts.filter(p => p.prompt_id !== 0);
        
        // Map API data to local state format
        const formattedModifiers = filteredPrompts.map(p => ({
          prompt_id: p.prompt_id,
          modifier: p.name || 'Unnamed Modifier',
          description: p.description || 'No description',
          content: p.content || '',
          status: 'active',
          sequence: p.prompt_id,
          values: [],
        }));
        
        setModifiers(formattedModifiers);
        setTokenLimit(limitResponse.limit);
        
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(`Failed to load settings: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleUpdateLimit = async () => {
    try {
      // Convert to number and validate
      const limitValue = parseInt(tokenLimit, 10);
      if (isNaN(limitValue) || limitValue <= 0) {
        setError('Please enter a valid positive number for token limit');
        return;
      }
      
      await updatePromptTokenLimit({ limit: limitValue });
      setIsEditingLimit(false);
      setError(null);
    } catch (err) {
      console.error('Failed to update token limit:', err);
      setError('Failed to update token limit: ' + err.message);
    }
  };

  const handleEditModifier = (modifier) => {
    setSelectedModifier(modifier);
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = (modifierId) => {
    setModifiers(prevModifiers => 
      prevModifiers.map(mod => 
        mod.prompt_id === modifierId 
          ? { ...mod, status: mod.status === 'active' ? 'inactive' : 'active' }
          : mod
      )
    );
  };

  const handleDeleteModifier = (modifier) => {
    setModifierToDelete(modifier);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteModifier = async () => {
    if (!modifierToDelete) return;
    
    setIsDeleteLoading(true);
    setError(null);
    
    try {
      console.log('Deleting prompt with ID:', modifierToDelete.prompt_id);
      await deletePrompt(modifierToDelete.prompt_id);
      
      setModifiers(prevModifiers => 
        prevModifiers.filter(mod => mod.prompt_id !== modifierToDelete.prompt_id)
      );
      
      setIsDeleteDialogOpen(false);
      setModifierToDelete(null);
      
    } catch (error) {
      console.error('Error deleting modifier:', error);
      setError(`Failed to delete modifier: ${error.message}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleSetSequence = () => {
    setIsSequenceModalOpen(true);
  };

  const handleCoreSystemPrompt = () => {
    setIsPromptModalOpen(true);
  };

  const handleAddModifier = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewModifier = async (newModifierData) => {
    try {
      // Validate input data
      if (!newModifierData.modifier?.trim()) {
        setError('Modifier name is required');
        return;
      }
      
      const newPrompt = {
        name: newModifierData.modifier.trim(),
        description: newModifierData.description?.trim() || '',
        content: newModifierData.content?.trim() || '',
      };
      
      console.log('Creating new prompt:', newPrompt);
      const apiResponse = await createPrompt(newPrompt);
      console.log('API response:', apiResponse);
      
      // Validate API response
      if (!apiResponse.prompt_id) {
        throw new Error('Invalid response from server - missing prompt_id');
      }
      
      const newlyAddedModifier = {
        prompt_id: apiResponse.prompt_id,
        modifier: apiResponse.name,
        description: apiResponse.description,
        content: apiResponse.content,
        status: 'active',
        sequence: apiResponse.prompt_id,
        values: [],
      };

      setModifiers(prevModifiers => [...prevModifiers, newlyAddedModifier]);
      setIsAddModalOpen(false);
      setError(null);
      
    } catch (error) {
      console.error('Failed to add new modifier:', error);
      setError(`Failed to add new modifier: ${error.message}`);
    }
  };

  const handleAddPrompt = (prompt) => {
    console.log('Core system prompt updated:', prompt);
  };

  const handleShowPromptUsed = () => {
    setIsPromptUsedModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="mb-4">
        <h4 className="text-sm text-gray-600 font-semibold">
          Settings / Context Configuration
        </h4>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Context-sense Modifiers</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 bg-white p-3 rounded-lg border border-gray-200 items-center">
            <span className="font-medium text-gray-700">Token Limit</span>
            {isEditingLimit ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tokenLimit || ''}
                  className="w-20 px-2 py-1 rounded border border-gray-300 text-sm"
                  onChange={(e) => setTokenLimit(e.target.value)}
                />
                <button onClick={handleUpdateLimit} className="text-green-600 hover:text-green-800">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-orange-500">{tokenLimit}</span>
                <button onClick={() => setIsEditingLimit(true)} className="text-gray-500 hover:text-gray-700">
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSetSequence}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <ListDashes size={16} />
            Set Sequence
          </button>

          <button
            onClick={handleCoreSystemPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <PencilSimple size={16} />
            Core System Prompt
          </button>

          <button
            onClick={handleAddModifier}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Modifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {modifiers
          .sort((a, b) => a.sequence - b.sequence)
          .map((modifier) => (
            <div
              key={modifier.prompt_id}
              className="bg-white min-h-[140px] p-4 rounded-lg shadow-sm border border-gray-200 relative hover:shadow-md transition-shadow"
            >
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                modifier.status === 'active' ? 'bg-green-400' : 'bg-gray-300'
              }`}></div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 pr-6">{modifier.modifier}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditModifier(modifier)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit Modifier"
                  >
                    <PencilSimple size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(modifier.prompt_id)}
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

                  <button
                    onClick={() => handleDeleteModifier(modifier)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete Modifier"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{modifier.description}</p>
              
              <div className="text-xs text-gray-500">
                {modifier.values?.length || 0} value{(modifier.values?.length || 0) !== 1 ? 's' : ''}
              </div>
              
              <div className="absolute bottom-2 left-4 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                #{modifier.sequence}
              </div>
            </div>
          ))}
      </div>

      {modifiers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No modifiers configured</div>
          <div className="text-gray-500 text-sm mb-4">Add your first modifier to get started</div>
          <button
            onClick={handleAddModifier}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Modifier
          </button>
        </div>
      )}

      {/* Modals */}
      {isEditModalOpen && selectedModifier && (
        <EditModifierModal
          modifier={selectedModifier}
          onUpdate={refreshModifiers}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedModifier(null);
          }}
        />
      )}

      {isAddModalOpen && (
        <AddModifierModal
          modifiers={modifiers}
          onAdd={handleAddNewModifier}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isPromptModalOpen && (
        <PromptModal
          onAdd={handleAddPrompt}
          onClose={() => setIsPromptModalOpen(false)}
        />
      )}

      {isSequenceModalOpen && (
        <SequenceModal
          modifiers={modifiers}
          onClose={() => setIsSequenceModalOpen(false)}
        />
      )}

      {isPromptUsedModalOpen && (
        <PromptUsedModal
          prompt={{
            human_message: "Please generate a professional email about the quarterly review meeting.",
            system_message: "You are a professional communication assistant. Generate clear, concise, and appropriately formal business communications."
          }}
          onClose={() => setIsPromptUsedModalOpen(false)}
        />
      )}

      {isDeleteDialogOpen && modifierToDelete && (
        <Dialog
          title="Delete Modifier"
          description={`Are you sure you want to delete the "${modifierToDelete.modifier}" modifier? This action cannot be undone and will remove all associated values.`}
          onConfirm={confirmDeleteModifier}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setModifierToDelete(null);
          }}
          isLoading={isDeleteLoading}
        />
      )}
    </div>
  );
};

export default SettingsPage;
