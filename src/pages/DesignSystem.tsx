import { useState } from 'react'
import type { ReactNode } from 'react'
import { CORES_EQUIPE } from '../data/mock'
import type { StatusFormulario } from '../data/mock'
import { Banner, BotaoVoltar, DataTable, Section, Toolbar } from '../components/layout'
import {
  Avatar,
  ButtonBrown,
  ButtonGhost,
  ButtonPrimary,
  DifficultyLetter,
  Field,
  FilterSelect,
  Icon,
  KpiCard,
  Modal,
  Panel,
  PasswordField,
  ProgressBar,
  SearchBox,
  SelectField,
  SortButton,
  StatusAlunoPill,
  StatusPill,
  TeamBadge,
} from '../components/ui'
import sortIcon from '../assets/figma/sort.svg'

const CORES = [
  ['page', '#fafafa'],
  ['sidebar', '#a08d77'],
  ['sidebar-active', '#5f574f'],
  ['topbar', '#f7f2ec'],
  ['banner-to', '#efe4d8'],
  ['line', '#e5ded4'],
  ['line-input', '#dbc9b1'],
  ['btn', '#eee4da'],
  ['btn-hover', '#dcd4cc'],
  ['btn-brown', '#dbc9b1'],
  ['btn-brown-hover', '#BEAF9B'],
  ['ink', '#333333'],
  ['muted', '#666666'],
  ['placeholder', '#878787'],
  ['card-line', '#b7b7b7'],
  ['professor', '#15593c'],
  ['panel', '#faf9f7'],
  ['track', '#e7e1d9'],
  ['ok', '#34785c'],
  ['diff-i', '#5ab3d4'],
  ['diff-p', '#a08d77'],
  ['diff-c', '#ee5e5e'],
] as const

const STATUS: StatusFormulario[] = ['ativo', 'agendado', 'inativo', 'rascunho']

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={titulo} className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <h2 id={titulo} className="text-[20px] font-bold text-ink">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

export function DesignSystem() {
  const [modal, setModal] = useState(false)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('')
  const [select, setSelect] = useState('')
  const [senha, setSenha] = useState('')

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-5 p-4 sm:p-10">
      <div>
        <BotaoVoltar />
      </div>
      <Banner titulo="Design System" subtitulo="Tokens e componentes do HastyHelp. Documentação completa em docs/DESIGN-SYSTEM.md." />

      <Bloco titulo="Cores">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {CORES.map(([nome, hex]) => (
            <li key={nome} className="flex items-center gap-2">
              <span className="size-9 shrink-0 rounded-lg border border-line" style={{ backgroundColor: hex }} />
              <span className="flex flex-col text-[12px] leading-tight text-ink">
                <strong>{nome}</strong>
                <span className="text-muted">{hex}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[14px] text-muted">Cores de equipe</p>
        <div className="flex gap-2">
          {CORES_EQUIPE.map((c) => (
            <TeamBadge key={c} sigla="PD" cor={c} size={44} fontSize={18} />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Tipografia">
        <div className="flex flex-col gap-1 text-ink">
          <p className="text-[40px] font-semibold">Título de auth 40</p>
          <p className="text-[28px] font-bold">Título de banner 28 bold</p>
          <p className="text-[24px] font-bold">Título de seção 24</p>
          <p className="text-[20px] font-medium">Botão / menu 20 medium</p>
          <p className="text-[18px]">Rótulo de campo 18</p>
          <p className="text-[16px]">Corpo 16 — Instrument Sans</p>
          <p className="text-[14px] text-muted">Apoio 14 muted</p>
          <p className="text-[12px] text-muted">Legenda 12</p>
          <p className="font-inter text-[16px]">Inter 16 — rótulos pontuais</p>
          <p className="text-[16px]">
            Dificuldade: <DifficultyLetter letra="I" /> <DifficultyLetter letra="P" /> <DifficultyLetter letra="C" />
          </p>
        </div>
      </Bloco>

      <Bloco titulo="Botões">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonPrimary icon="add">Criar equipe</ButtonPrimary>
          <ButtonPrimary icon="edit">Editar equipe</ButtonPrimary>
          <div className="flex w-[300px] gap-3">
            <ButtonBrown>Concluir</ButtonBrown>
            <ButtonGhost>Cancelar</ButtonGhost>
          </div>
        </div>
      </Bloco>

      <Bloco titulo="Status, avatares e siglas">
        <div className="flex flex-wrap items-center gap-4">
          {STATUS.map((s) => (
            <StatusPill key={s} status={s} />
          ))}
          {(['pendente', 'andamento', 'respondido', 'encerrado'] as const).map((s) => (
            <StatusAlunoPill key={s} status={s} />
          ))}
          <Avatar letra="A" />
          <Avatar letra="SC" cor="#a67b5b" size={32} />
          <Avatar letra="JP" cor="#3b82f6" size={32} />
          <TeamBadge sigla="PD" cor="#8fcbc5" size={60} fontSize={30} />
        </div>
      </Bloco>

      <Bloco titulo="Campos e filtros">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" placeholder="Nome completo" />
          <PasswordField label="Senha" name="senha" placeholder="Digite sua senha" value={senha} onChange={setSenha} />
          <SelectField
            label="Período letivo"
            placeholder="Selecione o período"
            value={select}
            onChange={setSelect}
            options={[{ value: '2026/02', label: '2026/02' }]}
          />
        </div>
        <Toolbar>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={busca} onChange={setBusca} placeholder="Buscar..." />
            <FilterSelect label="Status" value={filtro} onChange={setFiltro} options={['Ativo', 'Inativo']} />
            <FilterSelect label="Aluno" value="" onChange={() => {}} options={[]} disabled />
          </div>
          <SortButton icon={sortIcon} label="Data de publicação" />
        </Toolbar>
      </Bloco>

      <Bloco titulo="Progresso e indicadores">
        <div className="max-w-[360px]">
          <ProgressBar value={43} label="Taxa de resposta" />
        </div>
        <div className="flex flex-wrap gap-3.5">
          <KpiCard className="min-w-[200px]" titulo="Taxa de respostas" valor="75%" detalhe="30/40 alunos responderam" />
          <KpiCard className="min-w-[200px]" titulo="Desempenho médio" valor="68%" destaque detalhe="+4 p.p. em relação a 2026/1" />
        </div>
        <Panel titulo="Panel" subtitulo="Fundo panel, borda line, raio 12">
          <p className="text-[14px] text-ink">Conteúdo do painel.</p>
        </Panel>
      </Bloco>

      <Bloco titulo="Tabela e seção recolhível">
        <Section titulo="Alunos (2)">
          <DataTable
            colunas={[{ titulo: 'Aluno' }, { titulo: 'Domínio médio', largura: '160px', centro: true }]}
            linhas={[
              [<span key="a" className="flex items-center gap-3 font-semibold"><Avatar letra="SC" cor="#a67b5b" size={32} />Sarah Chen</span>, <strong key="b">85%</strong>],
              [<span key="c" className="flex items-center gap-3 font-semibold"><Avatar letra="JP" cor="#3b82f6" size={32} />James Park</span>, <strong key="d">74%</strong>],
            ]}
          />
        </Section>
      </Bloco>

      <Bloco titulo="Ícones e modal">
        <div className="flex flex-wrap items-center gap-4 text-[26px] text-ink">
          {['groups', 'assignment', 'bar_chart', 'add', 'edit', 'search', 'expand_more', 'more_horiz', 'visibility_off', 'delete'].map((n) => (
            <Icon key={n} name={n} />
          ))}
        </div>
        <div>
          <ButtonPrimary onClick={() => setModal(true)}>Abrir modal</ButtonPrimary>
        </div>
      </Bloco>

      {modal && (
        <Modal title="Modal de exemplo" icon="add" onClose={() => setModal(false)}>
          <p className="text-[16px] text-[#555]">Esc, clique fora ou Cancelar fecham este diálogo.</p>
          <div className="flex w-full gap-3">
            <ButtonBrown onClick={() => setModal(false)}>Concluir</ButtonBrown>
            <ButtonGhost onClick={() => setModal(false)}>Cancelar</ButtonGhost>
          </div>
        </Modal>
      )}
    </div>
  )
}
