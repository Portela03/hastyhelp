import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { CORES_EQUIPE, PERIODOS } from '../data/mock'
import type { Equipe, Formulario, Pergunta, StatusFormulario } from '../data/mock'
import { useStore } from '../store'
import { Avatar, ButtonBrown, ButtonGhost, Field, Icon, Modal, SelectField, StatusPill, TeamBadge, cx } from './ui'

export function gerarSigla(nome: string) {
  const palavras = nome
    .split(/\s+/)
    .filter((p) => p.length > 2 && !/^(de|da|do|das|dos|para)$/i.test(p))
  const letras = palavras.length >= 2 ? palavras[0][0] + palavras[1][0] : nome.replace(/\s/g, '').slice(0, 2)
  return letras.toUpperCase()
}

function Acoes({ concluir, onClose }: { concluir: string; onClose: () => void }) {
  return (
    <div className="flex w-full gap-3">
      <ButtonBrown type="submit">{concluir}</ButtonBrown>
      <ButtonGhost onClick={onClose}>Cancelar</ButtonGhost>
    </div>
  )
}

const opcoesPeriodo = PERIODOS.map((p) => ({ value: p, label: p }))

/* Equipes */

export function CriarEquipeModal({ onClose }: { onClose: () => void }) {
  const { adicionarEquipe } = useStore()
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [erro, setErro] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !periodo) return setErro('Informe o nome e o período letivo.')
    const equipe: Equipe = {
      id: `eq-${Date.now()}`,
      nome: nome.trim(),
      sigla: gerarSigla(nome),
      cor: CORES_EQUIPE[0],
      periodo,
      docente: 'Alberto',
      totalAlunos: 0,
      ultimoFormulario: 'Nenhum formulário ainda',
      taxaResposta: 0,
      dominioMedio: 0,
      engajamento: 0,
    }
    adicionarEquipe(equipe)
    onClose()
  }

  return (
    <Modal title="Criando Equipe" icon="add" onClose={onClose}>
      <form onSubmit={enviar} className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col gap-3">
          <Field label="Nome da equipe" name="nome" placeholder="Ex: Engenharia de Software - 5° Semestre" value={nome} onChange={(e) => setNome(e.target.value)} />
          <SelectField label="Período letivo" placeholder="Selecione o período" value={periodo} onChange={setPeriodo} options={opcoesPeriodo} />
          <div className="flex w-full flex-col gap-1">
            <span className="text-[18px] text-ink">Docente</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-placeholder bg-white p-3">
              <Avatar letra="A" />
              <span className="text-[16px] text-placeholder">Alberto</span>
            </div>
          </div>
          {erro && (
            <p role="alert" className="text-[14px] text-diff-c">
              {erro}
            </p>
          )}
        </div>
        <Acoes concluir="Concluir" onClose={onClose} />
        <p className="text-center text-[16px] text-[#555]">
          Novos alunos podem ser adicionados acessando a aba 'Alunos' dentro da equipe ou enviando o link de convite
        </p>
      </form>
    </Modal>
  )
}

export function EditarEquipeModal({ equipe, onClose }: { equipe: Equipe; onClose: () => void }) {
  const { atualizarEquipe } = useStore()
  const [nome, setNome] = useState(equipe.nome)
  const [periodo, setPeriodo] = useState(equipe.periodo)
  const [sigla, setSigla] = useState(equipe.sigla)
  const [cor, setCor] = useState(equipe.cor)

  function enviar(e: FormEvent) {
    e.preventDefault()
    atualizarEquipe(equipe.id, { nome: nome.trim() || equipe.nome, periodo, sigla: sigla.trim().toUpperCase() || equipe.sigla, cor })
    onClose()
  }

  return (
    <Modal title="Editando Equipe" icon="edit" onClose={onClose}>
      <form onSubmit={enviar} className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col gap-3">
          <Field label="Nome da equipe" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <SelectField label="Período letivo" placeholder="Selecione o período" value={periodo} onChange={setPeriodo} options={opcoesPeriodo} />
          <Field label="Sigla" name="sigla" maxLength={3} value={sigla} onChange={(e) => setSigla(e.target.value)} />
          <div className="flex flex-col gap-1">
            <span className="text-[18px] text-ink">Cor</span>
            <div className="flex items-center gap-3">
              <TeamBadge sigla={sigla || '—'} cor={cor} size={80} fontSize={36} />
              <div role="radiogroup" aria-label="Cor da equipe" className="grid grid-cols-3 gap-2">
                {CORES_EQUIPE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={cor === c}
                    aria-label={`Cor ${c}`}
                    onClick={() => setCor(c)}
                    className={cx('size-[30px] cursor-pointer rounded-[4px] border-grey', cor === c && 'outline-2 outline-offset-0 outline-ink', cor !== c && 'hover:scale-105')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Acoes concluir="Concluir" onClose={onClose} />
      </form>
    </Modal>
  )
}

/* Formulários */

function PerguntasEditor({ perguntas, onChange }: { perguntas: Pergunta[]; onChange: (p: Pergunta[]) => void }) {
  const [editando, setEditando] = useState<string | null>(null)

  function atualizar(id: string, enunciado: string) {
    onChange(perguntas.map((p) => (p.id === id ? { ...p, enunciado } : p)))
  }
  function adicionar() {
    const nova: Pergunta = { id: `q-${Date.now()}`, enunciado: '', tipo: 'unica', opcoes: [], marcadas: [] }
    onChange([...perguntas, nova])
    setEditando(nova.id)
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <span className="text-[18px] text-ink">Perguntas</span>
      <ul className="flex flex-col gap-1">
        {perguntas.map((p, i) => (
          <li key={p.id} className="flex items-center gap-2 rounded-lg border border-placeholder bg-white px-3 py-3 text-[16px] text-placeholder">
            {editando === p.id ? (
              <input
                autoFocus
                aria-label={`Pergunta ${i + 1}`}
                value={p.enunciado}
                onChange={(e) => atualizar(p.id, e.target.value)}
                onBlur={() => setEditando(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    setEditando(null)
                  }
                }}
                placeholder="Digite a pergunta"
                className="min-w-0 flex-1 bg-transparent text-ink outline-none"
              />
            ) : (
              <span className="min-w-0 flex-1 truncate">{`${i + 1}. ${p.enunciado || 'Nova pergunta'}`}</span>
            )}
            <button type="button" aria-label={`Editar pergunta ${i + 1}`} onClick={() => setEditando(p.id)} className="flex cursor-pointer text-[18px] text-muted">
              <Icon name="edit_note" />
            </button>
            <button
              type="button"
              aria-label={`Excluir pergunta ${i + 1}`}
              onClick={() => onChange(perguntas.filter((x) => x.id !== p.id))}
              className="flex cursor-pointer text-[18px] text-muted"
            >
              <Icon name="delete" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={adicionar}
        className="mt-0.5 w-fit cursor-pointer rounded-lg border border-[#c9b8a0] bg-white px-2 py-1 text-[16px] text-[#a08d77]"
      >
        + Adicionar
      </button>
    </div>
  )
}

export function CriarFormularioModal({ onClose }: { onClose: () => void }) {
  const { equipes, adicionarFormulario } = useStore()
  const [nome, setNome] = useState('')
  const [equipeId, setEquipeId] = useState(equipes[0]?.id ?? '')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [postar, setPostar] = useState(false)
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [erro, setErro] = useState('')
  const equipe = equipes.find((e) => e.id === equipeId)

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !equipe) return setErro('Informe o nome do formulário e a equipe.')
    const status: StatusFormulario = postar ? 'ativo' : data ? 'agendado' : 'rascunho'
    const form: Formulario = {
      id: `f-${Date.now()}`,
      titulo: nome.trim(),
      equipeId: equipe.id,
      periodo: equipe.periodo,
      status,
      respostas: 0,
      total: equipe.totalAlunos,
      data: data || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      perguntas: perguntas.filter((p) => p.enunciado.trim()),
    }
    adicionarFormulario(form)
    onClose()
  }

  return (
    <Modal title="Criando Formulário" icon="add" onClose={onClose} width={647}>
      <form onSubmit={enviar} className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col gap-5">
          <Field label="Nome do Formulário" name="nome" placeholder="Média, mediana e moda" value={nome} onChange={(e) => setNome(e.target.value)} />
          <SelectField
            label="Período letivo"
            placeholder="Selecione a equipe"
            value={equipeId}
            onChange={setEquipeId}
            options={equipes.map((e, i) => ({ value: e.id, label: `${e.nome}${i ? ` (${e.periodo})` : ''}` }))}
            leading={equipe && <TeamBadge sigla={equipe.sigla} cor={equipe.cor} size={32} fontSize={14} />}
            leadingPad={52}
          />
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
              <Field label="Data de publicação" name="data" placeholder="Ex: 24/09/26" value={data} onChange={(e) => setData(e.target.value)} disabled={postar} />
              <Field label="Horário" name="hora" placeholder="Ex: 00:00" value={hora} onChange={(e) => setHora(e.target.value)} disabled={postar} />
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2 text-[16px] text-[#a08d77]">
              <input type="checkbox" checked={postar} onChange={(e) => setPostar(e.target.checked)} className="size-4 cursor-pointer accent-sidebar" />
              Postar ao criar formulário
            </label>
          </div>
          <PerguntasEditor perguntas={perguntas} onChange={setPerguntas} />
          {erro && (
            <p role="alert" className="text-[14px] text-diff-c">
              {erro}
            </p>
          )}
        </div>
        <Acoes concluir="Criar" onClose={onClose} />
      </form>
    </Modal>
  )
}

const DESCRICAO_STATUS: Record<StatusFormulario, string> = {
  ativo: 'Aberto para alunos responderem',
  agendado: 'Publicação agendada',
  inativo: 'Fechado para respostas',
  rascunho: 'Ainda não publicado',
}

export function EditarFormularioModal({ formulario, onClose }: { formulario: Formulario; onClose: () => void }) {
  const { equipes, atualizarFormulario } = useStore()
  const equipe = equipes.find((e) => e.id === formulario.equipeId)
  const [nome, setNome] = useState(formulario.titulo)
  const [status, setStatus] = useState<StatusFormulario>(formulario.status)
  const [perguntas, setPerguntas] = useState<Pergunta[]>(formulario.perguntas)

  function enviar(e: FormEvent) {
    e.preventDefault()
    atualizarFormulario(formulario.id, {
      titulo: nome.trim() || formulario.titulo,
      status,
      perguntas: perguntas.filter((p) => p.enunciado.trim()),
    })
    onClose()
  }

  return (
    <Modal title="Editando Formulário" icon="edit" onClose={onClose} width={647}>
      <form onSubmit={enviar} className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col gap-5">
          <Field label="Nome do Formulário" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <SelectField
            label="Status"
            placeholder="Selecione o status"
            value={status}
            onChange={(v) => setStatus(v as StatusFormulario)}
            options={(Object.keys(DESCRICAO_STATUS) as StatusFormulario[]).map((s) => ({ value: s, label: DESCRICAO_STATUS[s] }))}
            leading={<StatusPill status={status} />}
            leadingPad={96}
          />
          <div className="flex w-full flex-col gap-1">
            <span className="text-[18px] text-ink">Período letivo</span>
            <div className="flex items-center gap-2 rounded-lg border border-placeholder bg-white p-3 text-[16px] text-placeholder">
              {equipe && <TeamBadge sigla={equipe.sigla} cor={equipe.cor} size={32} fontSize={14} />}
              {equipe?.nome}
            </div>
          </div>
          <PerguntasEditor perguntas={perguntas} onChange={setPerguntas} />
        </div>
        <Acoes concluir="Concluir" onClose={onClose} />
      </form>
    </Modal>
  )
}

type SwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  esconderLabel?: boolean
}

function PerfilSwitch({
  label,
  checked,
  onChange,
  esconderLabel = false,
}: SwitchProps) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-4 text-[20px] font-medium text-ink',        
        esconderLabel ? 'w-[52px] justify-center' : 'w-full justify-between',
      )}
    >
      {!esconderLabel && <span>{label}</span>}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative flex h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors',
          checked ? 'bg-ok' : 'bg-line',
        )}
      >
        <span
          className={cx(
            'size-[20px] rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[24px]' : 'translate-x-0',
          )}
        />
      </button>
    </label>
  )
}

function PerfilCheck({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between gap-4 text-[18px] text-muted">
      <span>{label}</span>

      <span className="flex w-[52px] shrink-0 justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-5 cursor-pointer accent-ok"
        />
      </span>
    </label>
  )
}

const EMAILS_PERFIL = {
  aluno: 'marina.santos@universidade.edu.br',
  professor: 'alberto.silva@universidade.edu.br',
} as const

function iniciaisDoNome(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function PerfilModal({ onClose }: { onClose: () => void }) {
  const { sessao, sair, preferencias, atualizarPreferencias } = useStore()
  const navigate = useNavigate()

  const papel = sessao?.papel ?? 'professor'
  const nome = sessao?.nome ?? 'Alberto'
  const email = EMAILS_PERFIL[papel]
  const ehAluno = papel === 'aluno'

  const [rascunho, setRascunho] = useState(preferencias)

  function atualizar<K extends keyof typeof rascunho>(campo: K, valor: (typeof rascunho)[K]) {
    setRascunho((atual) => ({
      ...atual,
      [campo]: valor,
    }))
  }

  function concluir() {
    atualizarPreferencias(rascunho)
    onClose()
  }

  function encerrarSessao() {
    sair()
    onClose()
    navigate('/login', { replace: true })
  }

  return (
    <Modal
      title={`Perfil do ${ehAluno ? 'aluno' : 'professor'}`}
      icon="person"
      onClose={onClose}
      width={600}
    >
      <div className="flex w-full flex-col gap-7">
        <section className="flex w-full items-center gap-5 rounded-2xl border border-card-line bg-banner-to px-4 py-4 sm:px-5">
          <Avatar
            letra={iniciaisDoNome(nome)}
            cor={ehAluno ? '#a67b5b' : '#15593c'}
            size={80}
            className="!text-[30px]"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <h3 className="truncate text-[28px] font-bold text-ink">
                {nome}
              </h3>

              <span className="w-fit rounded-md bg-btn px-3 py-1 text-[16px] text-muted">
                {ehAluno ? 'Aluno' : 'Professor'}
              </span>
            </div>

            <p className="truncate text-[18px] text-muted">
              {email}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[20px] font-medium text-ink">
              Notificações via Email
            </h3>

            <PerfilSwitch
              label="Ativar notificações via Email"
              checked={rascunho.notificacoesEmail}
              onChange={(valor) => atualizar('notificacoesEmail', valor)}
              esconderLabel
            />
          </div>

          <div
            className={cx(
              'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
              rascunho.notificacoesEmail
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-3 pl-3 pt-1 sm:pl-6">
                <PerfilCheck
                  label="Conclusão de formulários"
                  checked={rascunho.conclusaoFormularios}
                  onChange={(valor) => atualizar('conclusaoFormularios', valor)}
                />

                <PerfilCheck
                  label="Publicação de formulários"
                  checked={rascunho.publicacaoFormularios}
                  onChange={(valor) => atualizar('publicacaoFormularios', valor)}
                />

                <PerfilCheck
                  label="Métricas trimestrais"
                  checked={rascunho.metricasTrimestrais}
                  onChange={(valor) => atualizar('metricasTrimestrais', valor)}
                />

                <PerfilCheck
                  label="Métricas semestrais"
                  checked={rascunho.metricasSemestrais}
                  onChange={(valor) => atualizar('metricasSemestrais', valor)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-card-line" />

        <PerfilSwitch
          label="Ícone de acessibilidade"
          checked={rascunho.acessibilidade}
          onChange={(valor) => {
            atualizar('acessibilidade', valor)
            atualizarPreferencias({ acessibilidade: valor })
          }}
        />

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="tema-perfil" className="text-[20px] font-medium text-ink">
            Temas
          </label>

          <select
            id="tema-perfil"
            value={rascunho.tema}
            onChange={(event) => atualizar('tema', event.target.value as 'claro' | 'escuro' | 'alto-contraste')}
            className="w-full cursor-pointer rounded-lg border border-placeholder bg-white px-3 py-2 text-[18px] text-placeholder outline-none focus-visible:border-ink sm:w-[238px]"
          >
            <option value="claro">Claro</option>
            <option value="escuro">Escuro</option>
            <option value="alto-contraste">Alto-contraste</option>
          </select>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <ButtonBrown type="button" onClick={concluir}>
            Concluir
          </ButtonBrown>
        </div>

        <button
          type="button"
          onClick={encerrarSessao}
          className="mx-auto flex cursor-pointer items-center gap-2 text-[18px] text-diff-c transition hover:opacity-75"
        >
          <Icon name="logout" round={false} />
          Sair da conta
        </button>
      </div>
    </Modal>
  )
}

type ExcluirModalProps = {
  tipo: 'equipe' | 'formulario'
  nome: string
  onClose: () => void
  onConfirmar: () => void
}

export function ExcluirModal({
  tipo,
  nome,
  onClose,
  onConfirmar,
}: ExcluirModalProps) {
  const [confirmado, setConfirmado] = useState(false)

  const ehEquipe = tipo === 'equipe'

  function confirmar(e: FormEvent) {
    e.preventDefault()

    if (!confirmado) return

    onConfirmar()
  }

  return (
    <Modal
      title="Excluir permanentemente"
      icon="delete"
      onClose={onClose}
      width={640}
      titleClassName="!text-diff-c !text-[22px] sm:!text-[26px]"
    >
      <form onSubmit={confirmar} className="flex w-full flex-col gap-7">
        <p className="text-center text-[20px] leading-7 text-ink">
          Você está prestes a excluir {ehEquipe ? 'a equipe' : 'o formulário'}{' '}
          <strong>{nome}</strong>.
          <br />
          {ehEquipe
            ? 'Todos os formulários, respostas de alunos e métricas associadas serão apagados.'
            : 'Todas as respostas e métricas associadas serão apagadas.'}
        </p>

        <label className="flex cursor-pointer items-center gap-3 text-[18px] text-ink">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
            className="size-5 cursor-pointer accent-diff-c"
          />

          <span>
            Sim, entendo que esta ação é irreversível.
          </span>
        </label>

        <div className="flex w-full gap-3">
        <ButtonBrown type="submit" disabled={!confirmado} className="bg-diff-c hover:bg-diff-c/80" >
          Excluir
        </ButtonBrown>

          <ButtonGhost type="button" onClick={onClose}>
            Cancelar
          </ButtonGhost>
        </div>
      </form>
    </Modal>
  )
}

//Apagar função quanto tiver backend
function gerarCodigoTurma() {
  return String(Math.floor(10000 + Math.random() * 90000))
}

type AbaAdicionarMembros = 'codigo' | 'email'
type TipoAcesso = 'manual' | 'direto'

type ContaDisponivel = {
  id: string
  nome: string
  email: string
  iniciais: string
  cor: string
}

const CONTAS_DISPONIVEIS: ContaDisponivel[] = [
  { id: 'sarah-chen-1', nome: 'Sarah Chen', email: 'Sarah.Chen12@gmail.com', iniciais: 'SC', cor: '#a67b5b' },
  { id: 'sarah-chen-2', nome: 'Sarah Chen', email: 'Sarah.Chen11@gmail.com', iniciais: 'SC', cor: '#15593c' },
  { id: 'james-park', nome: 'James Park', email: 'James.Park@gmail.com', iniciais: 'JP', cor: '#3b82f6' },
  { id: 'lisa-anderson', nome: 'Lisa Anderson', email: 'Lisa.Anderson@gmail.com', iniciais: 'LA', cor: '#8b5cf6' },
]

export function AdicionarMembrosModal({ onClose }: { onClose: () => void }) {
  const [aba, setAba] = useState<AbaAdicionarMembros>('codigo')
  const [tipoAcesso, setTipoAcesso] = useState<TipoAcesso>('manual')
  const [busca, setBusca] = useState('')
  const [contaSelecionada, setContaSelecionada] = useState<ContaDisponivel | null>(null)
  const [copiado, setCopiado] = useState(false)

  const [codigo] = useState(gerarCodigoTurma)
  const termo = busca.trim().toLowerCase()
  
  const correspondencias = termo
    ? CONTAS_DISPONIVEIS.filter((c) => c.nome.toLowerCase().includes(termo) || c.email.toLowerCase().includes(termo))
    : []

  async function copiarCodigo() {
    await navigator.clipboard.writeText(codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function mudarAba(novaAba: AbaAdicionarMembros) {
    setAba(novaAba)
    setBusca('')
    setContaSelecionada(null)
  }

  return (
    <Modal title="Convidar" icon="person_add" onClose={onClose} width={480} className="  sm:min-h-[530px]">
      <div className="flex w-full flex-1 flex-col gap-6">
        
        {/* Abas */}
        <div
          role="radiogroup"
          aria-label="Forma de adicionar membros"
          className="relative flex items-center rounded-[9px] border border-placeholder bg-white "
        >
          <div className={cx(
              'absolute top-0 left-0 h-full w-1/2 bg-btn-brown outline rounded-lg',
              'transform duration-250 ease-in-out',
              aba === 'codigo' ? 'translate-x-0' : 'translate-x-full',
            )}
          />

          {(['codigo', 'email'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="radio"
              aria-checked={aba === tab}
              onClick={() => mudarAba(tab)}
              className={cx(
                'relative z-10 flex-1 cursor-pointer rounded-lg px-3 py-2 text-[16px] font-medium',
                aba === tab ? 'text-ink' : 'text-muted',
              )}
            >
              {tab === 'codigo' ? 'Código' : 'Email'}
            </button>
          ))}
        </div>

        {aba === 'codigo' ? (
          
          /* ABA CÓDIGO */
          <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-3 text-[18px] text-muted">
              <div className="flex w-full items-center gap-3">
                <p className="shrink-0">
                  1. Copie o código da turma:
                </p>

                <div className="flex flex-1 items-center justify-between rounded-lg border border-placeholder bg-white px-3 py-1.5 text-[20px] text-ink">
                  <div className="pointer-events-none flex select-none items-center gap-1 opacity-0" aria-hidden="true">
                    <Icon name="content_copy" className="text-[22px]" />
                    {copiado}
                  </div>

                  <strong>{codigo}</strong>

                  <button
                    type="button"
                    aria-label="Copiar código da turma"
                    onClick={copiarCodigo}
                    className="flex cursor-pointer items-center gap-1 text-muted transition hover:text-ink"
                  >
                    <Icon
                      name={copiado ? 'check' : 'content_copy'}
                      className="text-[22px]"
                    />
                  </button>
                </div>
              </div>

              <p>
                2. Compartilhe o código com seus alunos.
              </p>

              <p>
                3. Peça para adicionarem a turma pelo botão{' '}
                <strong>“Adicionar equipe”</strong>.
              </p>
            </div>

            <SelectField
              label="Aprovação de novos membros"
              placeholder="Selecione a regra de acesso"
              value={tipoAcesso}
              onChange={(valor) => setTipoAcesso(valor as TipoAcesso)}
              options={[
                { value: 'manual', label: 'Confirmar as entradas manualmente' },
                { value: 'direto', label: 'Entrada direta sem aprovação' },
              ]}
            />

            <div className="flex w-full justify-center pt-2">
              <ButtonBrown type="submit" className="w-[160px]">Concluir</ButtonBrown>
            </div>
          </form>

        ) : (

          /* ABA EMAIL (Live Search) */
          <form onSubmit={(e) => { e.preventDefault(); if (contaSelecionada) onClose(); }} className="flex w-full flex-1 flex-col gap-2">
            
            <div className="relative flex w-full items-center">
              <span className="absolute left-4 text-placeholder pointer-events-none">
                <Icon name="search" className="text-[22px]" />
              </span>
              <input
                type="search"
                placeholder="Digite o email ou nome"
                value={busca}
                onChange={(e) => { setBusca(e.target.value); setContaSelecionada(null); }}
                className="w-full rounded-lg border border-placeholder bg-white py-3 pl-12 pr-4 text-[16px] text-ink outline-none transition focus:border-ink"
              />
            </div>

            {termo && (
              <div className="flex max-h-[220px] w-full flex-col overflow-y-auto rounded-lg border border-line">
                {correspondencias.length > 0 ? (
                  correspondencias.map((conta) => {
                    const selecionada = contaSelecionada?.id === conta.id
                    return (
                      <button
                        key={conta.id}
                        type="button"
                        onClick={() => setContaSelecionada(conta)}
                        className={cx(
                          'flex w-full cursor-pointer items-center gap-4 border-b border-line-input px-3 py-3 text-left transition last:border-0',
                          selecionada ? 'bg-btn' : 'bg-white hover:bg-btn'
                        )}
                      >
                        <Avatar letra={conta.iniciais} cor={conta.cor} size={48} />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <strong className="text-[16px] text-ink truncate">{conta.nome}</strong>
                          <span className="text-[14px] text-muted truncate">{conta.email}</span>
                        </span>
                        {selecionada && <Icon name="check_circle" className="text-[24px] text-ok" />}
                      </button>
                    )
                  })
                ) : (
                  <p className="py-8 text-center text-[16px] text-muted">Nenhuma conta encontrada.</p>
                )}
              </div>
            )}

            <div className="mt-auto flex w-full gap-3 pt-4">
              <ButtonBrown type="submit" disabled={!contaSelecionada} className="flex-1 !transition-none" >
                Convidar
              </ButtonBrown>

              <ButtonGhost type="button" onClick={onClose} className="flex-1">
                Cancelar
              </ButtonGhost>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}