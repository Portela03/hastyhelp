import { PERGUNTAS } from './mock'
import type { Dificuldade, Equipe, Pergunta } from './mock'

export type Papel = 'professor' | 'aluno'

export interface Sessao {
  papel: Papel
  nome: string
}

export const ALUNO_LOGADO = 'Sarah Chen'
export const PROFESSOR_LOGADO = 'Alberto'

/** Status da autoavaliação do ponto de vista do aluno. */
export type StatusAluno = 'pendente' | 'andamento' | 'respondido' | 'encerrado'

export const ROTULO_STATUS_ALUNO: Record<StatusAluno, string> = {
  pendente: 'Pendente',
  andamento: 'Em andamento',
  respondido: 'Respondido',
  encerrado: 'Encerrado',
}

export interface AutoavaliacaoAluno {
  id: string
  titulo: string
  turmaId: string
  status: StatusAluno
  /** Definido pelo professor; opcional. */
  prazo?: string
  enviadoEm?: string
  nota?: number
  compreensao?: Dificuldade
  /** O professor decide se o gabarito aparece para o aluno. */
  mostrarGabarito: boolean
  perguntas: Pergunta[]
  respostas: Record<string, number[]>
}

const base = {
  totalAlunos: 0,
  ultimoFormulario: '',
  taxaResposta: 0,
  dominioMedio: 0,
  engajamento: 0,
}

export const TURMAS_ALUNO: Equipe[] = [
  {
    ...base,
    id: 'a-pdm',
    nome: 'Programação para Dispositivos Móveis',
    sigla: 'PD',
    cor: '#8fcbc5',
    periodo: '2026/02',
    docente: 'Wellington Fernando Bastos',
  },
  {
    ...base,
    id: 'a-ea',
    nome: 'Estatística Aplicada',
    sigla: 'EA',
    cor: '#b98fcb',
    periodo: '2026/02',
    docente: 'Marina Alves',
  },
]

export const CONVITES: Record<string, string> = {
  'pdm-2026': 'a-pdm',
  'ea-2026': 'a-ea',
}

export const AUTOAVALIACOES_ALUNO_INICIAIS: AutoavaliacaoAluno[] = [
  {
    id: 'a1',
    titulo: 'Média, mediana e moda',
    turmaId: 'a-pdm',
    status: 'pendente',
    prazo: '20/09/26',
    mostrarGabarito: true,
    perguntas: PERGUNTAS,
    respostas: {},
  },
  {
    id: 'a2',
    titulo: 'Diagnóstico',
    turmaId: 'a-pdm',
    status: 'respondido',
    enviadoEm: '12/08/26',
    nota: 5.5,
    compreensao: 'C',
    mostrarGabarito: false,
    perguntas: PERGUNTAS,
    respostas: { q1: [1], q2: [0], q3: [1] },
  },
  {
    id: 'a3',
    titulo: 'Atividade 1',
    turmaId: 'a-pdm',
    status: 'respondido',
    enviadoEm: '26/08/26',
    nota: 7.5,
    compreensao: 'P',
    mostrarGabarito: true,
    perguntas: PERGUNTAS,
    respostas: { q1: [0], q2: [0], q3: [1] },
  },
  {
    id: 'a4',
    titulo: 'Distribuições de probabilidade',
    turmaId: 'a-ea',
    status: 'andamento',
    prazo: '30/09/26',
    mostrarGabarito: false,
    perguntas: PERGUNTAS,
    respostas: { q1: [1] },
  },
  {
    id: 'a5',
    titulo: 'Estatística descritiva',
    turmaId: 'a-ea',
    status: 'respondido',
    enviadoEm: '05/08/26',
    nota: 8,
    compreensao: 'I',
    mostrarGabarito: false,
    perguntas: PERGUNTAS,
    respostas: { q1: [0], q2: [0], q3: [0] },
  },
  {
    id: 'a6',
    titulo: 'Revisão de conceitos básicos',
    turmaId: 'a-ea',
    status: 'encerrado',
    prazo: '01/08/26',
    mostrarGabarito: false,
    perguntas: PERGUNTAS,
    respostas: {},
  },
]

/* Regras (puras) */

export function formatarNota(nota: number) {
  return nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function respondida(p: Pergunta, respostas: Record<string, number[]>) {
  return (respostas[p.id]?.length ?? 0) > 0
}

export function totalRespondidas(a: Pick<AutoavaliacaoAluno, 'perguntas' | 'respostas'>) {
  return a.perguntas.filter((p) => respondida(p, a.respostas)).length
}

export function completa(a: Pick<AutoavaliacaoAluno, 'perguntas' | 'respostas'>) {
  return a.perguntas.length > 0 && totalRespondidas(a) === a.perguntas.length
}

export function acertou(p: Pergunta, respostas: Record<string, number[]>) {
  const marcadas = [...(respostas[p.id] ?? [])].sort()
  const gabarito = [...(p.gabarito ?? [])].sort()
  return marcadas.length === gabarito.length && marcadas.every((v, i) => v === gabarito[i])
}

export function calcularNota(a: Pick<AutoavaliacaoAluno, 'perguntas' | 'respostas'>) {
  const comGabarito = a.perguntas.filter((p) => p.gabarito)
  if (comGabarito.length === 0) return undefined
  const acertos = comGabarito.filter((p) => acertou(p, a.respostas)).length
  return Math.round((acertos / comGabarito.length) * 100) / 10
}

/** O aluno só pode alterar enquanto não enviou nem encerrou. */
export function editavel(status: StatusAluno) {
  return status === 'pendente' || status === 'andamento'
}
