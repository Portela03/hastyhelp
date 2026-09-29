import { useMemo, useState } from 'react'
import { Navigate, Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import donut from '../assets/figma/donut.svg'
import dotC from '../assets/figma/dot-c.svg'
import dotI from '../assets/figma/dot-i.svg'
import dotP from '../assets/figma/dot-p.svg'
import sortIcon from '../assets/figma/sort.svg'
import { AppShell, Banner, BannerStat, DataTable, Section, TabBar, Toolbar } from '../components/layout'
import { CriarEquipeModal, EditarEquipeModal } from '../components/modals'
import { Avatar, ButtonPrimary, DifficultyLetter, FilterSelect, KpiCard, Panel, ProgressBar, SearchBox, SortButton, TeamBadge, cx } from '../components/ui'
import { ALUNOS, FORMULARIOS_DA_EQUIPE, PERIODOS } from '../data/mock'
import type { Equipe } from '../data/mock'
import { useStore } from '../store'

/* Lista de equipes */

function TeamCard({ equipe }: { equipe: Equipe }) {
  const navigate = useNavigate()
  const abrir = () => navigate(`/equipes/${equipe.id}`)
  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Abrir equipe ${equipe.nome}`}
      onClick={abrir}
      onKeyDown={(e) => e.key === 'Enter' && abrir()}
      className="flex cursor-pointer flex-col gap-5 self-start rounded-lg border border-card-line bg-white p-3 drop-shadow-[0.5px_0.5px_0_#b7b7b7]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <TeamBadge sigla={equipe.sigla} cor={equipe.cor} size={60} fontSize={30} />
          <h2 className="min-w-0 flex-1 text-[16px] font-semibold tracking-[-0.64px] text-ink">{equipe.nome}</h2>
          <button
            type="button"
            aria-label={`Opções da equipe ${equipe.nome}`}
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer font-inter text-[20px] leading-none text-ink"
          >
            ...
          </button>
        </div>
        <p className="text-[16px] leading-4 text-card-sec">{`${equipe.totalAlunos} Alunos • ${equipe.ultimoFormulario}`}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[16px] leading-4 text-card-sec">
          <span>Taxa de resposta:</span>
          <span>{equipe.taxaResposta}%</span>
        </div>
        <ProgressBar value={equipe.taxaResposta} label="Taxa de resposta" />
      </div>
    </article>
  )
}

export function Equipes() {
  const { equipes } = useStore()
  const [modal, setModal] = useState(false)
  const [busca, setBusca] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [ocultas, setOcultas] = useState(false)
  const [asc, setAsc] = useState(true)

  const lista = useMemo(() => {
    const filtradas = equipes
      .filter((e) => e.nome.toLowerCase().includes(busca.toLowerCase()))
      .filter((e) => !periodo || e.periodo === periodo)
      .filter((e) => ocultas || !e.oculta)
    return filtradas.sort((a, b) => (asc ? 1 : -1) * a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [equipes, busca, periodo, ocultas, asc])

  return (
    <AppShell action={<ButtonPrimary icon="add" onClick={() => setModal(true)}>Criar equipe</ButtonPrimary>}>
      <Banner titulo="Minhas Equipes" subtitulo="Bem-vindo(a) de volta! Aqui você acompanha o progresso e o engajamento das suas turmas com facilidade." />
      <Toolbar>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBox value={busca} onChange={setBusca} placeholder="Buscar equipes..." />
          <FilterSelect label="Período" value={periodo} onChange={setPeriodo} options={[...PERIODOS]} />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex cursor-pointer items-center gap-2 font-inter text-[16px] text-ink">
            <input type="checkbox" checked={ocultas} onChange={(e) => setOcultas(e.target.checked)} className="size-4 cursor-pointer accent-sidebar" />
            Mostrar turmas ocultas
          </label>
          <SortButton icon={sortIcon} label={asc ? 'Alfabeticamente' : 'Alfabeticamente (Z-A)'} onClick={() => setAsc((v) => !v)} />
        </div>
      </Toolbar>
      <Section titulo="Equipes">
        {lista.length === 0 ? (
          <p className="text-[16px] text-muted">Nenhuma equipe encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
            {lista.map((e) => (
              <TeamCard key={e.id} equipe={e} />
            ))}
          </div>
        )}
      </Section>
      {modal && <CriarEquipeModal onClose={() => setModal(false)} />}
    </AppShell>
  )
}

/* Detalhe da equipe */

export function EquipeDetalhe() {
  const { id } = useParams()
  const { equipes } = useStore()
  const equipe = equipes.find((e) => e.id === id)
  const [editar, setEditar] = useState(false)
  if (!equipe) return <Navigate to="/equipes" replace />

  const base = `/equipes/${equipe.id}`
  return (
    <AppShell action={<ButtonPrimary icon="edit" onClick={() => setEditar(true)}>Editar equipe</ButtonPrimary>}>
      <Banner
        titulo={equipe.nome}
        leading={<TeamBadge sigla={equipe.sigla} cor={equipe.cor} size={75} fontSize={30} />}
        subtitulo={`${equipe.docente} • ${equipe.totalAlunos} alunos`}
      >
        <BannerStat rotulo="Domínio médio" valor={`${equipe.dominioMedio}%`} />
        <BannerStat rotulo="Engajamento" valor={`${equipe.engajamento}%`} />
      </Banner>
      <TabBar
        tabs={[
          { to: base, label: 'Formulários', end: true },
          { to: `${base}/alunos`, label: 'Alunos' },
          { to: `${base}/resumo`, label: 'Resumo' },
        ]}
      />
      <Outlet context={equipe} />
      {editar && <EditarEquipeModal equipe={equipe} onClose={() => setEditar(false)} />}
    </AppShell>
  )
}

function useEquipe() {
  return useOutletContext<Equipe>()
}

export function EquipeFormularios() {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('')
  const [asc, setAsc] = useState(false)
  const linhas = FORMULARIOS_DA_EQUIPE.filter((f) => f.titulo.toLowerCase().includes(busca.toLowerCase()))
  const ordenadas = asc ? [...linhas].reverse() : linhas
  return (
    <>
      <Toolbar>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBox value={busca} onChange={setBusca} placeholder="Buscar formulários..." />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={['Ativo', 'Agendado', 'Inativo', 'Rascunho']} />
        </div>
        <SortButton icon={sortIcon} label="Data de publicação" onClick={() => setAsc((v) => !v)} />
      </Toolbar>
      <ul className="flex flex-col gap-3">
        {ordenadas.map((f, i) => (
          <li key={i} className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-line-input bg-white p-3">
            <span aria-label="Ativo" className="size-4 shrink-0 rounded-full bg-[#69be3a]" />
            <div className="flex min-w-[240px] flex-1 flex-col gap-1">
              <h3 className="text-[20px] font-semibold text-ink">{f.titulo}</h3>
              <div className="flex max-w-[342px] flex-col gap-1">
                <div className="flex justify-between text-[16px] text-muted">
                  <span>Taxa de resposta:</span>
                  <span>{`${f.respondidos}/${f.total}`}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-lg bg-white shadow-[inset_0_0_1px_rgba(0,0,0,0.45)]">
                  <div className="h-full rounded-lg bg-[#dcd8d0]" style={{ width: `${(f.respondidos / f.total) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-center text-[16px] text-ink">
              <div>
                <p>Domínio Médio</p>
                <p>{f.dominio}%</p>
              </div>
              <div>
                <p>Maior dificuldade</p>
                <p>{f.dificuldade}</p>
              </div>
              <div>
                <p>Data de criação</p>
                <p>{f.criacao}</p>
              </div>
              <button type="button" aria-label="Opções do formulário" className="cursor-pointer font-inter text-[16px]">
                ...
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function Iniciais({ nome, cor, iniciais }: { nome: string; cor: string; iniciais: string }) {
  return (
    <div className="flex items-center gap-3 font-semibold">
      <Avatar letra={iniciais} cor={cor} size={32} />
      {nome}
    </div>
  )
}

function AlunosSecao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return <Section titulo={titulo}>{children}</Section>
}

export function EquipeAlunos() {
  useEquipe()
  return (
    <div className="flex flex-col gap-4">
      <AlunosSecao titulo="Docentes (1)">
        <DataTable colunas={[{ titulo: 'Aluno' }]} linhas={[[<Iniciais key="a" nome="Alberto" cor="#15593c" iniciais="A" />]]} />
      </AlunosSecao>
      <AlunosSecao titulo={`Alunos (${ALUNOS.length})`}>
        <DataTable
          cabecalhoAlto
          colunas={[
            { titulo: 'Aluno' },
            { titulo: 'Domínio médio', largura: '200px', centro: true },
            { titulo: 'Formulários enviados', largura: '200px', centro: true },
            { titulo: 'Ação', largura: '120px', centro: true },
          ]}
          linhas={ALUNOS.map((a) => [
            <Iniciais key="n" nome={a.nome} cor={a.cor} iniciais={a.iniciais} />,
            <strong key="d">{a.dominio}%</strong>,
            a.enviados,
            <button key="m" type="button" aria-label={`Ações de ${a.nome}`} className="cursor-pointer font-inter">
              ...
            </button>,
          ])}
        />
      </AlunosSecao>
    </div>
  )
}

const ATIVIDADES = [
  { rotulo: 'Diagnóstico', valor: 58, cor: '#8fcbc5' },
  { rotulo: 'Atividade 1', valor: 63, cor: '#34785c' },
  { rotulo: 'A definir' },
  { rotulo: 'A definir' },
  { rotulo: 'A definir' },
] as const

export function EquipeResumo() {
  useEquipe()
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-line bg-white p-[22px]">
      <header className="flex flex-col gap-1">
        <h2 className="text-[24px] font-bold text-ink">Resumo da equipe</h2>
        <p className="text-[13px] text-muted">Visão coletiva com desempenho, evolução e pontos que precisam de atenção.</p>
      </header>
      <div className="flex flex-wrap gap-3.5">
        <KpiCard className="min-w-[200px] gap-1" titulo="Engajamento" valor="86%" detalhe="26 alunos responderam tudo" />
        <KpiCard className="min-w-[200px] gap-1" titulo="Valor médio da nota" valor="7,5/10" detalhe="Autoavaliação geral da turma" />
        <KpiCard className="min-w-[200px] gap-1" titulo="Desempenho geral" valor="+6%" detalhe="% desde o início do semestre" />
        <KpiCard className="min-w-[200px] gap-1" titulo="Maior dificuldade" valor={<span className="font-plex-mono text-[25px]">I</span>} detalhe="Formulário: " />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="flex min-h-[290px] min-w-0 flex-1 flex-col gap-3 rounded-xl border border-line bg-panel p-[18px]">
          <header className="flex flex-col gap-1">
            <h3 className="text-[19px] font-bold text-ink">Evolução do desempenho</h3>
            <p className="text-[13px] text-muted">Média da equipe nas últimas cinco atividades</p>
          </header>
          <div role="img" aria-label="Evolução do desempenho nas últimas cinco atividades" className="flex flex-1 flex-col justify-end">
            <div className="flex h-[150px] items-end justify-around border-b border-line">
              {ATIVIDADES.map((a, i) => (
                <div key={i} className="flex w-[72px] flex-col items-center gap-1">
                  <span className={cx('text-[12px] font-bold', 'valor' in a ? 'text-ink' : 'text-bar-gray')}>{'valor' in a ? `${a.valor}%` : '??%'}</span>
                  <div
                    className="w-8 rounded-t-md"
                    style={{ height: 'valor' in a ? a.valor : 9, backgroundColor: 'valor' in a ? a.cor : '#bebebe' }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-around text-[11px] text-muted">
              {ATIVIDADES.map((a, i) => (
                <span key={i} className="w-[72px] text-center">
                  {a.rotulo}
                </span>
              ))}
            </div>
          </div>
        </section>
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[350px]">
          <section className="flex flex-col gap-1.5 rounded-xl border border-line bg-white p-[18px]">
            <h3 className="text-[16px] font-semibold text-ink">Distribuição de Dificuldade</h3>
            <div className="flex items-center justify-center gap-6">
              <img src={donut} alt="Gráfico de rosca da distribuição de dificuldade" className="size-[100px]" />
              <ul className="flex flex-col gap-2 text-[12px] text-ink">
                <li className="flex items-center gap-2">
                  <img src={dotI} alt="" className="size-2" />
                  <span>
                    <DifficultyLetter letra="I" className="font-plex-mono font-normal" /> (25%)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <img src={dotP} alt="" className="size-2" />P (35%)
                </li>
                <li className="flex items-center gap-2">
                  <img src={dotC} alt="" className="size-2" />C (45%)
                </li>
              </ul>
            </div>
          </section>
          <Panel titulo="Maior dificuldade por formulário" subtitulo="Os cinco últimos serão considerados" tituloTamanho={19}>
            <ul className="-mt-2 flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
              <li>Média, mediana e moda: P</li>
              <li>
                Tipos de Curtose : <DifficultyLetter letra="I" />
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  )
}
