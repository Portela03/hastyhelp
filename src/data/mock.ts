export const CORES_EQUIPE = [
  '#8fcbc5',
  '#f3ae8d',
  '#f27c7e',
  '#8df3b6',
  '#df8bb3',
  '#b98fcb',
] as const

export const PERIODOS = ['2026/01', '2026/02', '2025/02'] as const

export type StatusFormulario = 'ativo' | 'agendado' | 'inativo' | 'rascunho'
export type Dificuldade = 'I' | 'P' | 'C'

export interface Equipe {
  id: string
  nome: string
  sigla: string
  cor: string
  periodo: string
  docente: string
  totalAlunos: number
  ultimoFormulario: string
  taxaResposta: number
  dominioMedio: number
  engajamento: number
  oculta?: boolean
}

export interface Formulario {
  id: string
  titulo: string
  equipeId: string
  periodo: string
  status: StatusFormulario
  respostas: number
  total: number
  data: string
  perguntas: Pergunta[]
}

export interface Pergunta {
  id: string
  enunciado: string
  tipo: 'unica' | 'multipla'
  opcoes: string[]
  marcadas: number[]
  /** Opções corretas, definidas pelo professor. Só é mostrado ao aluno se o professor liberar o gabarito. */
  gabarito?: number[]
}

export interface Aluno {
  nome: string
  iniciais: string
  cor: string
  dominio: number
  enviados: string
  autoavaliacao?: string
  dificuldade?: string
}

export const EQUIPES_INICIAIS: Equipe[] = [
  {
    id: 'dsm-web',
    nome: 'Desenvolvimento Web Moderno',
    sigla: 'DM',
    cor: '#8df3b6', 
    periodo: '2026/02',
    docente: 'Carlos Eduardo',
    totalAlunos: 35,
    ultimoFormulario: 'Ultimo formulário a 1 dia',
    taxaResposta: 78,
    dominioMedio: 82,
    engajamento: 88,
  },
  {
    id: 'bd',
    nome: 'Banco de Dados Relacional',
    sigla: 'BD',
    cor: '#f27c7e', 
    periodo: '2026/01',
    docente: 'Maria Silva',
    totalAlunos: 45,
    ultimoFormulario: 'Ultimo formulário a 5 dias',
    taxaResposta: 85,
    dominioMedio: 90,
    engajamento: 95,
  },
  {
    id: 'eng-soft',
    nome: 'Engenharia de Software',
    sigla: 'ES',
    cor: '#b98fcb', 
    periodo: '2026/02',
    docente: 'João Paulo',
    totalAlunos: 25,
    ultimoFormulario: 'Ultimo formulário hoje',
    taxaResposta: 15,
    dominioMedio: 40,
    engajamento: 60,
  },
  ...['b'].map((k, i) => ({
    id: `pdm-${k}`,
    nome: 'Programação para Dispositivos Móveis',
    sigla: 'PD',
    cor: '#8fcbc5',
    periodo: i % 2 ? '2026/01' : '2026/02',
    docente: 'Wellington Fernando Bastos',
    totalAlunos: 30,
    ultimoFormulario: 'Ultimo formulário a 2 dias',
    taxaResposta: 43,
    dominioMedio: 67,
    engajamento: 80,
  })),
]

export const PERGUNTAS: Pergunta[] = [
  {
    id: 'q1',
    enunciado: 'Qual é a fórmula da média aritmética simples?',
    tipo: 'unica',
    opcoes: [
      'Soma dos valores dividida pelo número de valores (Σx / n)',
      'Soma dos valores multiplicada pelo número de valores (Σx * n)',
      'Raiz quadrada da soma dos valores (√Σx)',
    ],
    marcadas: [0],
    gabarito: [0],
  },
  {
    id: 'q2',
    enunciado: 'O que caracteriza a moda de um conjunto de dados?',
    tipo: 'multipla',
    opcoes: [
      'É o valor que aparece com mais frequência',
      'É o valor médio dos dados',
      'É o valor central quando os dados estão ordenados',
    ],
    marcadas: [],
    gabarito: [0],
  },
  {
    id: 'q3',
    enunciado: 'Dados os valores 90, 70, 65. Qual a média?',
    tipo: 'unica',
    opcoes: ['75', '70', '80'],
    marcadas: [],
    gabarito: [0],
  },
]

export const FORMULARIOS_INICIAIS: Formulario[] = [
  { id: 'f1', titulo: 'Avaliação: Heurísticas de Nielsen e Usabilidade', status: 'agendado' },
  { id: 'f2', titulo: 'Quiz: Arquitetura REST e Node.js', status: 'ativo' },
  { id: 'f3', titulo: 'Pesquisa de Satisfação - Sprint 2', status: 'ativo' },
  { id: 'f4', titulo: 'Prova Intermédia: Fundamentos de Git', status: 'inativo' },
  { id: 'f5', titulo: 'Estruturação de Base de Dados (PostgreSQL)', status: 'rascunho' },
].map(({ id, titulo, status }) => ({
  id,
  titulo,
  equipeId: 'eng-soft',
  periodo: 'Período',
  status: status as StatusFormulario,
  respostas: 20,
  total: 30,
  data: '09/08/26',
  perguntas: PERGUNTAS,
}))

export const ALUNOS: Aluno[] = [
  { nome: 'Sarah Chen', iniciais: 'SC', cor: '#a67b5b', dominio: 85, enviados: '4 / 4', autoavaliacao: '7,5', dificuldade: 'Dificuldade 1' },
  { nome: 'James Park', iniciais: 'JP', cor: '#3b82f6', dominio: 74, enviados: '3 / 4', autoavaliacao: '5,5', dificuldade: 'Dificuldade 3' },
  { nome: 'Michael Torres', iniciais: 'MT', cor: '#ef4444', dominio: 58, enviados: '2 / 4' },
  { nome: 'Lisa Anderson', iniciais: 'LA', cor: '#8b5cf6', dominio: 42, enviados: '1 / 4' },
]

export const FORMULARIOS_DA_EQUIPE = [
  { titulo: 'Avaliação: Heurísticas de Nielsen e Usabilidade', respondidos: 25, total: 50, dominio: 50, dificuldade: 'P', criacao: '29/08' },
  { titulo: 'Quiz: Arquitetura REST e Node.js', respondidos: 25, total: 50, dominio: 50, dificuldade: 'P', criacao: '29/08' },
]

export const OBSERVACOES = [
  { texto: 'Acharia útil mais exemplos com conjuntos de dados reais.', alunos: 3 },
  { texto: 'A confusão entre média e mediana foi o maior desafio.', alunos: 2 },
  { texto: 'Acharia mais fácil se tivesse uma tabela de apoio para conferir.', alunos: 2 },
]

export const DIFICULDADES_GERAIS = [
  { titulo: 'Fórmula da média aritmética', total: 18 },
  { titulo: 'Diferença entre média e mediana', total: 14 },
  { titulo: 'Identificação da moda', total: 12 },
  { titulo: 'Aplicação em conjuntos de dados', total: 9 },
]

export const EVOLUCAO_SEMESTRE = [
  { mes: 'Mai', valor: 54 },
  { mes: 'Jun', valor: 59 },
  { mes: 'Jul', valor: 63 },
  { mes: 'Ago', valor: 66 },
  { mes: 'Set', valor: 68 },
]
