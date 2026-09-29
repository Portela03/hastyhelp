import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { EQUIPES_INICIAIS, FORMULARIOS_INICIAIS } from './data/mock'
import type { Equipe, Formulario } from './data/mock'

interface Store {
  equipes: Equipe[]
  formularios: Formulario[]
  adicionarEquipe: (e: Equipe) => void
  atualizarEquipe: (id: string, dados: Partial<Equipe>) => void
  adicionarFormulario: (f: Formulario) => void
  atualizarFormulario: (id: string, dados: Partial<Formulario>) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [equipes, setEquipes] = useState<Equipe[]>(EQUIPES_INICIAIS)
  const [formularios, setFormularios] = useState<Formulario[]>(FORMULARIOS_INICIAIS)

  const adicionarEquipe = useCallback((e: Equipe) => setEquipes((l) => [...l, e]), [])
  const atualizarEquipe = useCallback(
    (id: string, dados: Partial<Equipe>) => setEquipes((l) => l.map((e) => (e.id === id ? { ...e, ...dados } : e))),
    [],
  )
  const adicionarFormulario = useCallback((f: Formulario) => setFormularios((l) => [f, ...l]), [])
  const atualizarFormulario = useCallback(
    (id: string, dados: Partial<Formulario>) => setFormularios((l) => l.map((f) => (f.id === id ? { ...f, ...dados } : f))),
    [],
  )

  const value = useMemo(
    () => ({ equipes, formularios, adicionarEquipe, atualizarEquipe, adicionarFormulario, atualizarFormulario }),
    [equipes, formularios, adicionarEquipe, atualizarEquipe, adicionarFormulario, atualizarFormulario],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
