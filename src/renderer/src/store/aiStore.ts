import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProviderType = 'lmstudio' | 'ollama' | 'openai' | 'custom'

export interface Provider {
  id: string
  name: string
  type: ProviderType
  baseURL: string
  apiKey?: string
  model?: string
}

export interface AIModel {
  id: string
  name: string
  provider: string
}

interface AIStoreState {
  providers: Provider[]
  activeProviderId: string | null
  models: AIModel[]
  isLoadingModels: boolean

  addProvider: (provider: Provider) => void
  updateProvider: (id: string, updates: Partial<Provider>) => void
  removeProvider: (id: string) => void
  setActiveProvider: (id: string) => void
  setModels: (models: AIModel[]) => void
  setLoadingModels: (loading: boolean) => void
  fetchModels: (providerId: string) => Promise<void>
}

const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: 'lmstudio-default',
    name: 'LM Studio',
    type: 'lmstudio',
    baseURL: 'http://localhost:1234'
  },
  {
    id: 'ollama-default',
    name: 'Ollama',
    type: 'ollama',
    baseURL: 'http://localhost:11434'
  }
]

export const useAIStore = create<AIStoreState>()(
  persist(
    (set, get) => ({
      providers: DEFAULT_PROVIDERS,
      activeProviderId: 'lmstudio-default',
      models: [],
      isLoadingModels: false,

      addProvider: (provider) => {
        set((state) => ({
          providers: [...state.providers, provider]
        }))
      },

      updateProvider: (id, updates) => {
        set((state) => ({
          providers: state.providers.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }))
      },

      removeProvider: (id) => {
        set((state) => ({
          providers: state.providers.filter((p) => p.id !== id),
          activeProviderId: state.activeProviderId === id ? null : state.activeProviderId
        }))
      },

      setActiveProvider: (id) => {
        set({ activeProviderId: id, models: [] })
        const provider = get().providers.find((p) => p.id === id)
        if (provider) {
          get().fetchModels(id)
        }
      },

      setModels: (models) => set({ models }),
      setLoadingModels: (loading) => set({ isLoadingModels: loading }),

      fetchModels: async (providerId) => {
        const provider = get().providers.find((p) => p.id === providerId)
        if (!provider) return

        set({ isLoadingModels: true })

        try {
          let models: AIModel[] = []
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          if (provider.apiKey) {
            headers['Authorization'] = `Bearer ${provider.apiKey}`
          }

          if (provider.type === 'lmstudio') {
            const response = await fetch(`${provider.baseURL}/api/v1/models`, {
              headers
            })
            if (response.ok) {
              const data = await response.json()
              models = (data.models || []).map((m: any) => ({
                id: m.id || m.key,
                name: m.id || m.key,
                provider: provider.id
              }))
            }
          } else if (provider.type === 'ollama') {
            const response = await fetch(`${provider.baseURL}/api/tags`, {
              headers
            })
            if (response.ok) {
              const data = await response.json()
              models = (data.models || []).map((m: any) => ({
                id: m.name,
                name: m.name,
                provider: provider.id
              }))
            }
          } else {
            const response = await fetch(`${provider.baseURL}/v1/models`, {
              headers
            })
            if (response.ok) {
              const data = await response.json()
              models = (data.data || []).map((m: any) => ({
                id: m.id,
                name: m.id,
                provider: provider.id
              }))
            }
          }

          set({ models })
        } catch (error) {
          console.error('Failed to fetch models:', error)
          set({ models: [] })
        } finally {
          set({ isLoadingModels: false })
        }
      }
    }),
    {
      name: 'ai-provider-storage',
      partialize: (state) => ({
        providers: state.providers,
        activeProviderId: state.activeProviderId
      })
    }
  )
)
