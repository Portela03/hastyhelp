import { useMemo, useState } from 'react'
import { Navigate, Outlet, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import sortIcon from '../assets/figma/sort.svg'
import { AppShell, Banner, DataTable, Section, TabBar, Toolbar } from '../components/layout'
import { CriarFormularioModal, EditarFormularioModal } from '../components/modals'
import { Avatar, ButtonPrimary, DifficultyLetter, FilterSelect, KpiCard, Panel, SearchBox, SortButton, StatusPill, TeamBadge, cx } from '../components/ui'
import { DIFICULDADES_GERAIS, OBSERVACOES, PERIODOS } from '../data/mock'
import type { Formulario, StatusFormulario } from '../data/mock'
import { useStore } from '../store'

const ROTULO_STATUS: Record<StatusFormulario, string> = { ativo: 'Ativo', agendado: 'Agendado', inativo: 'Inativo', rascunho: 'Rascunho' }

/* Lista */

function FormRow({ form }: { form: Formulario }) {
  const { equipes } = useStore()
  const navigate = useNavigate()
  const equipe = equipes.find((e) => e.id === form.equipeId)
  const abrir = () => navigate(`/avaliacoes/${form.id}`)
  const rascunho = form.status === 'rascunho'
  return (
    <li
      role="link"
      tabIndex={0}
      aria-label={`Abrir formulário ${form.titulo}`}
      onClick={abrir}
      onKeyDown={(e) => e.key === 'Enter' && abrir()}
      className={cx(
        "flex cursor-pointer items-center gap-3 rounded-lg border border-card-line bg-white p-3",
        "transition duration-100",
        "hover:bg-card-hover hover:shadow-card-hover",
        "active:shadow-none"
      )}
    >
      {!rascunho && equipe && <TeamBadge sigla={equipe.sigla} cor={equipe.cor} size={68} fontSize={32} />}
      <div className="flex min-w-0 flex-1 items-stretch justify-between gap-3">
        <div className="flex min-w-0 flex-col justify-center gap-1">
          <h2 className="text-[16px] font-semibold text-ink">{form.titulo}</h2>
          {rascunho ? (
            <p className="text-[16px] text-card-sec">{`Última modificação: ${form.data}`}</p>
          ) : (
            <>
              <p className="flex flex-wrap items-center gap-x-[5px] text-[16px] text-placeholder">
                {equipe?.nome}
                <span className="font-inter text-[12px]">•</span>
                {form.periodo}
              </p>
              <p className="text-[16px] text-card-sec">{`${form.respostas}/${form.total} respostas`}</p>
            </>
          )}
        </div>
        <div className={cx('flex shrink-0 flex-col items-end', rascunho ? 'justify-center' : 'justify-between')}>
          <StatusPill status={form.status} />
          {!rascunho && <span className="text-[16px] text-ink">{form.data}</span>}
        </div>
      </div>
    </li>
  )
}

export function Formularios() {
  const { formularios, equipes } = useStore()
  const [modal, setModal] = useState(false)
  const [busca, setBusca] = useState('')
  const [turma, setTurma] = useState('')
  const [status, setStatus] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [asc, setAsc] = useState(false)

  const lista = useMemo(() => {
    const filtrados = formularios
      .filter((f) => f.titulo.toLowerCase().includes(busca.toLowerCase()))
      .filter((f) => !turma || equipes.find((e) => e.id === f.equipeId)?.nome === turma)
      .filter((f) => !status || ROTULO_STATUS[f.status] === status)
      .filter((f) => !periodo || equipes.find((e) => e.id === f.equipeId)?.periodo === periodo)
    return asc ? [...filtrados].reverse() : filtrados
  }, [formularios, equipes, busca, turma, status, periodo, asc])

  const turmas = [...new Set(equipes.map((e) => e.nome))]

  return (
    <AppShell action={<ButtonPrimary icon="add" onClick={() => setModal(true)}>Criar formulário</ButtonPrimary>}>
      <Banner variante="lista" titulo="Formulários" subtitulo="Aqui você acompanha o desempenho de cada formulário e pode acessar seus rascunhos e agendamentos." />
      <Toolbar>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBox value={busca} onChange={setBusca} placeholder="Buscar formulários..." />
          <FilterSelect label="Turma" all="Todas" value={turma} onChange={setTurma} options={turmas} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={Object.values(ROTULO_STATUS)} />
          <FilterSelect label="Período" value={periodo} onChange={setPeriodo} options={[...PERIODOS]} />
        </div>
        <SortButton icon={sortIcon} label="Data de publicação" onClick={() => setAsc((v) => !v)} />
      </Toolbar>
      {lista.length === 0 ? (
        <p className="text-[16px] text-muted">Nenhum formulário encontrado.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {lista.map((f) => (
            <FormRow key={f.id} form={f} />
          ))}
        </ul>
      )}
      {modal && <CriarFormularioModal onClose={() => setModal(false)} />}
    </AppShell>
  )
}

/* Detalhe */

const TITULO_DETALHE = 'Teste Algebra Linear - Média, mediana e moda'

export function FormularioDetalhe() {
  const { id } = useParams()
  const { formularios, equipes } = useStore()
  const form = formularios.find((f) => f.id === id)
  const [editar, setEditar] = useState(false)
  if (!form) return <Navigate to="/avaliacoes" replace />
  const equipe = equipes.find((e) => e.id === form.equipeId)
  const base = `/avaliacoes/${form.id}`
  const titulo = form.titulo === 'Teste' ? TITULO_DETALHE : form.titulo

  return (
    <AppShell
      voltar={{ para: '/avaliacoes', rotulo: 'Avaliações' }}
      onMore={() => setEditar(true)}
      action={<ButtonPrimary icon="outgoing_mail" iconRound={false}>Notificar pendentes</ButtonPrimary>}
    >
      <Banner titulo={titulo} subtitulo={`Algebra Linear - ${equipe?.periodo ?? form.periodo}`}>
        <div className="flex flex-col items-center text-[20px]">
          <span>Maior dificuldade</span>
          <strong>P</strong>
        </div>
      </Banner>
      <TabBar
        tabs={[
          { to: base, label: 'Formulário', end: true },
          { to: `${base}/alunos`, label: 'Alunos' },
          { to: `${base}/resumo`, label: 'Resumo' },
        ]}
      />
      <Outlet context={form} />
      {editar && <EditarFormularioModal formulario={form} onClose={() => setEditar(false)} />}
    </AppShell>
  )
}

function useForm() {
  return useOutletContext<Formulario>()
}

export function FormularioPerguntas() {
  const form = useForm()
  const pct = form.total ? (form.respostas / form.total) * 100 : 0
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4">
        <StatusPill status={form.status} />
        <span className="text-[16px] text-muted">Publicado em 12/08/26</span>
        <div className="relative h-8 min-w-[240px] flex-1 overflow-hidden rounded-lg border border-card-line bg-white">
          <div className="absolute inset-y-0 left-0 bg-[#e6dacd]" style={{ width: `${pct}%` }} />
          <span className="relative flex h-full items-center justify-center text-[14px] font-medium text-ink">
            {`${form.respostas}/${form.total} Alunos responderam`}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-6 rounded-xl border border-line bg-white p-6">
        {form.perguntas.map((p, i) => (
          <fieldset key={p.id} className="flex flex-col gap-3 rounded-xl border border-line bg-page p-4">
            <legend className="sr-only">{p.enunciado}</legend>
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#333] text-[16px] font-bold text-white">{i + 1}</span>
              <h2 className="text-[18px] font-semibold text-ink">{p.enunciado}</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {p.opcoes.map((op, j) => (
                <li key={op}>
                  <label className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-3 text-[16px] text-ink">
                    <input
                      type={p.tipo === 'unica' ? 'radio' : 'checkbox'}
                      name={p.id}
                      checked={p.marcadas.includes(j)}
                      readOnly
                      disabled
                      className="size-[18px] accent-[#333]"
                    />
                    {op}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
        {form.perguntas.length === 0 && <p className="text-[16px] text-muted">Este formulário ainda não tem perguntas.</p>}
      </div>
    </>
  )
}

function AlunoCell({ nome, cor, iniciais }: { nome: string; cor: string; iniciais: string }) {
  return (
    <div className="flex items-center gap-3 font-semibold">
      <Avatar letra={iniciais} cor={cor} size={32} />
      {nome}
    </div>
  )
}

export function FormularioAlunos() {
  useForm()
  const menu = (nome: string) => (
    <button type="button" aria-label={`Ações de ${nome}`} className="cursor-pointer font-inter">
      ...
    </button>
  )
  return (
    <div className="flex flex-col gap-4">
      <Section titulo="Responderam (2/4)">
        <DataTable
          colunas={[
            { titulo: 'Aluno' },
            { titulo: 'Autoavaliação', largura: '200px', centro: true },
            { titulo: 'Maior Dificuldade', largura: '200px', centro: true },
            { titulo: 'Ação', largura: '120px', centro: true },
          ]}
          linhas={[
            [<AlunoCell key="a" nome="Sarah Chen" cor="#a67b5b" iniciais="SC" />, <strong key="b">7,5</strong>, 'Dificuldade 1', menu('Sarah Chen')],
            [<AlunoCell key="a" nome="James Park" cor="#3b82f6" iniciais="JP" />, <strong key="b">5,5</strong>, 'Dificuldade 3', menu('James Park')],
          ]}
        />
      </Section>
      <Section titulo="Visualizaram (1/4)">
        <DataTable colunas={[{ titulo: 'Aluno' }]} linhas={[[<AlunoCell key="a" nome="Michael Torres" cor="#ef4444" iniciais="MT" />]]} />
      </Section>
      <Section titulo="Pendente (1/4)">
        <DataTable colunas={[{ titulo: 'Aluno' }]} linhas={[[<AlunoCell key="a" nome="Lisa Anderson" cor="#8b5cf6" iniciais="LA" />]]} />
      </Section>
    </div>
  )
}

const GRUPOS = [
  { letra: 'I', valor: 40, cor: 'bg-diff-i' },
  { letra: 'P', valor: 58, cor: 'bg-diff-p' },
  { letra: 'C', valor: 20, cor: 'bg-diff-c' },
]

export function FormularioResumo() {
  useForm()
  return (
    <section className="flex flex-col gap-6 rounded-xl border border-line bg-white p-6">
      <h2 className="text-[24px] font-bold text-ink">Resumo da autoavaliação</h2>
      <div className="flex flex-wrap gap-4">
        <KpiCard className="min-w-[200px]" titulo="Taxa de respostas" valor="75%" detalhe="30/40 alunos responderam" />
        <KpiCard className="min-w-[200px]" titulo="Valor médio da nota" valor="6,8/10" detalhe="Autoavaliação geral da turma" />
        <KpiCard className="min-w-[200px]" titulo="Observações enviadas" valor="3" detalhe="Comentários e dúvidas adicionais" />
        <KpiCard className="min-w-[200px]" titulo="Maior dificuldade" valor="P" detalhe="Pergunta 1: média aritmética" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Panel titulo="Principal dificuldade dividida em 3 grupos" subtitulo="Distribuição das respostas com base na percepção de dificuldade relatada pelos alunos.">
            <ul className="flex flex-col gap-3">
              {GRUPOS.map((g) => (
                <li key={g.letra} className="flex items-center gap-3">
                  <DifficultyLetter letra={g.letra} className="w-[60px] text-center text-[16px] text-ink" />
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`Grupo ${g.letra}`} aria-valuenow={g.valor} aria-valuemin={0} aria-valuemax={100}>
                    <div className={cx('h-full rounded-full', g.cor)} style={{ width: `${g.valor}%` }} />
                  </div>
                  <span className="text-[16px] font-semibold text-ink">{g.valor}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel titulo="Dificuldades gerais" subtitulo="Principais pontos mencionados pelos alunos ao longo da autoavaliação.">
            <ul className="flex flex-col gap-3 text-[16px] font-semibold text-ink">
              {DIFICULDADES_GERAIS.map((d) => (
                <li key={d.titulo} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1">{d.titulo}</span>
                  <span>{d.total}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="w-full shrink-0 lg:w-[360px]">
          <Panel titulo="Observações dos alunos" subtitulo="Comentários recorrentes e sugestões enviadas pelos estudantes.">
            <ul className="flex flex-col gap-3">
              {OBSERVACOES.map((o) => (
                <li key={o.texto} className="flex flex-col gap-1.5 rounded-lg border border-line bg-white p-3">
                  <p className="text-[14px] text-ink">{`"${o.texto}"`}</p>
                  <p className="text-[12px] text-muted">{`${o.alunos} alunos`}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  )
}
