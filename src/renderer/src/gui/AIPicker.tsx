import React, { useState, useEffect } from 'react'
import { useAIStore, type Provider, type ProviderType, type AIModel } from '../store/aiStore'

const PROVIDER_ICONS: Record<ProviderType, string> = {
  lmstudio: '🖥️',
  ollama: '🐳',
  openai: '🤖',
  custom: '⚙️'
}

const PROVIDER_PLACEHOLDERS: Record<ProviderType, { baseURL: string; apiKey: string }> = {
  lmstudio: { baseURL: 'http://localhost:1234', apiKey: '' },
  ollama: { baseURL: 'http://localhost:11434', apiKey: '' },
  openai: { baseURL: 'https://api.openai.com/v1', apiKey: 'sk-...' },
  custom: { baseURL: 'http://localhost:8080/v1', apiKey: '' }
}

interface AIPickerProps {
  onModelSelect?: (model: AIModel, provider: Provider) => void
}

export const AIPicker: React.FC<AIPickerProps> = ({ onModelSelect }) => {
  const {
    providers,
    activeProviderId,
    models,
    isLoadingModels,
    addProvider,
    updateProvider,
    removeProvider,
    setActiveProvider,
    fetchModels
  } = useAIStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [formData, setFormData] = useState<Partial<Provider>>({
    name: '',
    type: 'custom',
    baseURL: '',
    apiKey: '',
    model: ''
  })

  const activeProvider = providers.find((p) => p.id === activeProviderId)
  const selectedModel = models.find((m) => m.id === activeProvider?.model)

  useEffect(() => {
    if (activeProviderId && !models.length && !isLoadingModels) {
      fetchModels(activeProviderId)
    }
  }, [activeProviderId])

  const handleProviderChange = (providerId: string) => {
    setActiveProvider(providerId)
  }

  const handleModelSelect = (modelId: string) => {
    if (activeProvider) {
      updateProvider(activeProvider.id, { model: modelId })
      const model = models.find((m) => m.id === modelId)
      if (model && onModelSelect) {
        onModelSelect(model, activeProvider)
      }
    }
  }

  const openAddModal = (provider?: Provider) => {
    if (provider) {
      setEditingProvider(provider)
      setFormData(provider)
    } else {
      setEditingProvider(null)
      setFormData({
        name: '',
        type: 'custom',
        baseURL: '',
        apiKey: '',
        model: ''
      })
    }
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingProvider(null)
  }

  const handleSaveProvider = () => {
    if (!formData.name || !formData.baseURL) return

    if (editingProvider) {
      updateProvider(editingProvider.id, formData)
    } else {
      const newProvider: Provider = {
        id: `provider-${Date.now()}`,
        name: formData.name!,
        type: formData.type || 'custom',
        baseURL: formData.baseURL!,
        apiKey: formData.apiKey,
        model: formData.model
      }
      addProvider(newProvider)
      setActiveProvider(newProvider.id)
    }
    closeModal()
  }

  const handleDeleteProvider = (id: string) => {
    removeProvider(id)
    if (activeProviderId === id) {
      const remaining = providers.filter((p) => p.id !== id)
      if (remaining.length > 0) {
        setActiveProvider(remaining[0].id)
      }
    }
  }

  const handleTypeChange = (type: ProviderType) => {
    const placeholder = PROVIDER_PLACEHOLDERS[type]
    setFormData((prev) => ({
      ...prev,
      type,
      baseURL: placeholder.baseURL,
      apiKey: ''
    }))
  }

  const testConnection = async () => {
    if (!formData.baseURL) return

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (formData.apiKey) {
        headers['Authorization'] = `Bearer ${formData.apiKey}`
      }

      const url =
        formData.type === 'ollama'
          ? `${formData.baseURL}/api/tags`
          : `${formData.baseURL}/v1/models`

      const response = await fetch(url, { headers })
      if (response.ok) {
        alert('Connection successful!')
      } else {
        alert(`Connection failed: ${response.status}`)
      }
    } catch (error) {
      alert(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>AI Model Picker</h2>
        <button onClick={() => openAddModal()} style={styles.addButton}>
          + Add Provider
        </button>
      </div>

      <div style={styles.providerList}>
        {providers.map((provider) => (
          <div
            key={provider.id}
            style={{
              ...styles.providerCard,
              ...(activeProviderId === provider.id ? styles.providerCardActive : {})
            }}
          >
            <div style={styles.providerInfo} onClick={() => handleProviderChange(provider.id)}>
              <span style={styles.providerIcon}>{PROVIDER_ICONS[provider.type]}</span>
              <div style={styles.providerDetails}>
                <div style={styles.providerName}>{provider.name}</div>
                <div style={styles.providerUrl}>{provider.baseURL}</div>
              </div>
              {activeProviderId === provider.id && <div style={styles.activeBadge}>Active</div>}
            </div>
            <div style={styles.providerActions}>
              <button onClick={() => openAddModal(provider)} style={styles.iconButton} title="Edit">
                ✏️
              </button>
              <button
                onClick={() => handleDeleteProvider(provider.id)}
                style={styles.iconButton}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeProvider && (
        <div style={styles.modelSection}>
          <div style={styles.modelSectionHeader}>
            <h3 style={styles.modelTitle}>Models ({activeProvider.name})</h3>
            <button
              onClick={() => fetchModels(activeProvider.id)}
              disabled={isLoadingModels}
              style={styles.refreshButton}
            >
              {isLoadingModels ? '⟳' : '↻'} Refresh
            </button>
          </div>

          {isLoadingModels ? (
            <div style={styles.loading}>Loading models...</div>
          ) : models.length === 0 ? (
            <div style={styles.empty}>
              No models found. Make sure the provider is running and accessible.
            </div>
          ) : (
            <div style={styles.modelList}>
              {models.map((model) => (
                <div
                  key={model.id}
                  style={{
                    ...styles.modelCard,
                    ...(selectedModel?.id === model.id ? styles.modelCardActive || {} : {})
                  }}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <div style={styles.modelName}>{model.name}</div>
                  {selectedModel?.id === model.id && (
                    <span style={styles.selectedBadge}>Selected</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editingProvider ? 'Edit Provider' : 'Add Provider'}</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Provider"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select
                value={formData.type || 'custom'}
                onChange={(e) => handleTypeChange(e.target.value as ProviderType)}
                style={styles.select}
              >
                <option value="lmstudio">LM Studio</option>
                <option value="ollama">Ollama</option>
                <option value="openai">OpenAI Compatible</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Base URL</label>
              <input
                type="text"
                value={formData.baseURL || ''}
                onChange={(e) => setFormData({ ...formData, baseURL: e.target.value })}
                placeholder={PROVIDER_PLACEHOLDERS[formData.type || 'custom'].baseURL}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>API Key (optional)</label>
              <input
                type="password"
                value={formData.apiKey || ''}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder={PROVIDER_PLACEHOLDERS[formData.type || 'custom'].apiKey}
                style={styles.input}
              />
            </div>

            <div style={styles.modalActions}>
              <button onClick={testConnection} style={styles.testButton}>
                Test Connection
              </button>
              <div style={styles.modalButtons}>
                <button onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handleSaveProvider} style={styles.saveButton}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#fafafa',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827'
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  providerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  providerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  providerCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  },
  providerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  providerIcon: {
    fontSize: '1.5rem'
  },
  providerDetails: {
    flex: 1
  },
  providerName: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#111827'
  },
  providerUrl: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  activeBadge: {
    padding: '2px 8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 500
  },
  providerActions: {
    display: 'flex',
    gap: '4px'
  },
  iconButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  modelSection: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px'
  },
  modelSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  modelTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 500,
    color: '#374151'
  },
  refreshButton: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  empty: {
    padding: '20px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.875rem'
  },
  modelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '300px',
    overflowY: 'auto'
  },
  modelCard: {
    padding: '10px 14px',
    backgroundColor: 'white',
    // border: '1px solid #e5e7eb',
    borderColor: '#e5e7eb',
    borderWidth: `1px`,
    borderStyle: 'solid',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s'
  },
  modelCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  },
  modelName: {
    fontSize: '0.875rem',
    color: '#374151'
  },
  selectedBadge: {
    padding: '2px 6px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 500
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '400px',
    maxWidth: '90%'
  },
  modalTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#111827'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px'
  },
  testButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  modalButtons: {
    display: 'flex',
    gap: '8px'
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer'
  }
}

export default AIPicker
