import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ALUNO_LOGADO,
  AUTOAVALIACOES_ALUNO_INICIAIS,
  PROFESSOR_LOGADO,
  calcularNota,
  completa,
  editavel,
} from './data/aluno'
import type { AutoavaliacaoAluno, Papel, Sessao } from './data/aluno'
import { EQUIPES_INICIAIS, FORMULARIOS_INICIAIS } from './data/mock'
import type { Equipe, Formulario } from './data/mock'

interface Store {
  sessao: Sessao | null
  entrar: (papel: Papel) => void
  sair: () => void
  equipes: Equipe[]
  formularios: Formulario[]
  adicionarEquipe: (e: Equipe) => void
  atualizarEquipe: (id: string, dados: Partial<Equipe>) => void
  adicionarFormulario: (f: Formulario) => void
  atualizarFormulario: (id: string, dados: Partial<Formulario>) => void
  autoavaliacoes: AutoavaliacaoAluno[]
  salvarResposta: (id: string, perguntaId: string, marcadas: number[]) => void
  enviarAutoavaliacao: (id: string) => void
}

const StoreContext = createContext<Store | null>(null)
const CHAVE_SESSAO = 'hastyhelp:sessao'

function lerSessao(): Sessao | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE_SESSAO)
    return bruto ? (JSON.parse(bruto) as Sessao) : null
  } catch {
    return null
  }
}

function gravarSessao(s: Sessao | null) {
  try {
    if (s) sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(s))
    else sessionStorage.removeItem(CHAVE_SESSAO)
  } catch {
    /* sessionStorage indisponível: a sessão vale só até recarregar */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessao)
  const [equipes, setEquipes] = useState<Equipe[]>(EQUIPES_INICIAIS)
  const [formularios, setFormularios] = useState<Formulario[]>(FORMULARIOS_INICIAIS)
  const [autoavaliacoes, setAutoavaliacoes] = useState<AutoavaliacaoAluno[]>(AUTOAVALIACOES_ALUNO_INICIAIS)

  const entrar = useCallback((papel: Papel) => {
    const nova: Sessao = { papel, nome: papel === 'aluno' ? ALUNO_LOGADO : PROFESSOR_LOGADO }
    gravarSessao(nova)
    setSessao(nova)
  }, [])
  const sair = useCallback(() => {
    gravarSessao(null)
    setSessao(null)
  }, [])

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

  /** Salva a resposta na hora (rascunho). Só vale enquanto a autoavaliação está aberta. */
  const salvarResposta = useCallback((id: string, perguntaId: string, marcadas: number[]) => {
    setAutoavaliacoes((lista) =>
      lista.map((a) => {
        if (a.id !== id || !editavel(a.status)) return a
        return { ...a, status: 'andamento', respostas: { ...a.respostas, [perguntaId]: marcadas } }
      }),
    )
  }, [])

  /** Envia de vez: só com todas as perguntas respondidas e sem volta (integridade das respostas). */
  const enviarAutoavaliacao = useCallback((id: string) => {
    setAutoavaliacoes((lista) =>
      lista.map((a) => {
        if (a.id !== id || !editavel(a.status) || !completa(a)) return a
        return {
          ...a,
          status: 'respondido',
          enviadoEm: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
          nota: calcularNota(a),
        }
      }),
    )
  }, [])

  const value = useMemo(
    () => ({
      sessao,
      entrar,
      sair,
      equipes,
      formularios,
      adicionarEquipe,
      atualizarEquipe,
      adicionarFormulario,
      atualizarFormulario,
      autoavaliacoes,
      salvarResposta,
      enviarAutoavaliacao,
    }),
    [sessao, entrar, sair, equipes, formularios, adicionarEquipe, atualizarEquipe, adicionarFormulario, atualizarFormulario, autoavaliacoes, salvarResposta, enviarAutoavaliacao],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
