"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { allContent, type ContentItem } from "@/lib/data"

interface ContentContextType {
  content: ContentItem[]
  isLoading: boolean
  addContent: (item: Omit<ContentItem, "id">) => void
  removeContent: (id: number) => void
  updateContent: (id: number, item: Partial<ContentItem>) => void
  refreshContent: () => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar conteúdo inicial e modificações
  const loadContent = useCallback(() => {
    try {
      // Carregar modificações do localStorage
      const modifications = JSON.parse(localStorage.getItem("contentModifications") || "{}")
      const { added = [], updated = {}, removed = [] } = modifications

      // Começar com o conteúdo original
      let mergedContent = [...allContent]

      // Aplicar atualizações
      mergedContent = mergedContent.map((item) => {
        if (updated[item.id]) {
          return { ...item, ...updated[item.id] }
        }
        return item
      })

      // Remover itens deletados
      mergedContent = mergedContent.filter((item) => !removed.includes(item.id))

      // Adicionar novos itens
      mergedContent = [...mergedContent, ...added]

      setContent(mergedContent)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error)
      setContent(allContent)
      setIsLoading(false)
    }
  }, [])

  // Salvar modificações no localStorage
  const saveModifications = useCallback((modifications: any) => {
    localStorage.setItem("contentModifications", JSON.stringify(modifications))
    // Disparar evento para outras abas/componentes
    window.dispatchEvent(new CustomEvent("contentUpdated"))
  }, [])

  // Adicionar novo conteúdo
  const addContent = useCallback(
    (newItem: Omit<ContentItem, "id">) => {
      const item: ContentItem = {
        ...newItem,
        id: Date.now(), // Gerar ID único
      }

      const modifications = JSON.parse(localStorage.getItem("contentModifications") || "{}")
      const updatedModifications = {
        ...modifications,
        added: [...(modifications.added || []), item],
      }

      saveModifications(updatedModifications)
      setContent((prev) => [...prev, item])
    },
    [saveModifications],
  )

  // Remover conteúdo
  const removeContent = useCallback(
    (id: number) => {
      const modifications = JSON.parse(localStorage.getItem("contentModifications") || "{}")

      // Se o item foi adicionado pelo admin, remover da lista de adicionados
      const addedItems = modifications.added || []
      const isAddedItem = addedItems.some((item: ContentItem) => item.id === id)

      if (isAddedItem) {
        const updatedModifications = {
          ...modifications,
          added: addedItems.filter((item: ContentItem) => item.id !== id),
        }
        saveModifications(updatedModifications)
      } else {
        // Se é um item original, adicionar à lista de removidos
        const updatedModifications = {
          ...modifications,
          removed: [...(modifications.removed || []), id],
        }
        saveModifications(updatedModifications)
      }

      setContent((prev) => prev.filter((item) => item.id !== id))
    },
    [saveModifications],
  )

  // Atualizar conteúdo
  const updateContent = useCallback(
    (id: number, updates: Partial<ContentItem>) => {
      const modifications = JSON.parse(localStorage.getItem("contentModifications") || "{}")

      // Verificar se é um item adicionado pelo admin
      const addedItems = modifications.added || []
      const addedItemIndex = addedItems.findIndex((item: ContentItem) => item.id === id)

      if (addedItemIndex !== -1) {
        // Atualizar item adicionado
        const updatedAdded = [...addedItems]
        updatedAdded[addedItemIndex] = { ...updatedAdded[addedItemIndex], ...updates }

        const updatedModifications = {
          ...modifications,
          added: updatedAdded,
        }
        saveModifications(updatedModifications)
      } else {
        // Atualizar item original
        const updatedModifications = {
          ...modifications,
          updated: {
            ...modifications.updated,
            [id]: { ...(modifications.updated?.[id] || {}), ...updates },
          },
        }
        saveModifications(updatedModifications)
      }

      setContent((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    },
    [saveModifications],
  )

  // Recarregar conteúdo
  const refreshContent = useCallback(() => {
    loadContent()
  }, [loadContent])

  useEffect(() => {
    loadContent()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "contentModifications") {
        loadContent()
      }
    }

    // Escutar eventos customizados
    const handleContentUpdate = () => {
      loadContent()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("contentUpdated", handleContentUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("contentUpdated", handleContentUpdate)
    }
  }, [loadContent])

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        addContent,
        removeContent,
        updateContent,
        refreshContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContentContext() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContentContext must be used within a ContentProvider")
  }
  return context
}
