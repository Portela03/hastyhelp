import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import bg from '../assets/figma/login-bg.png'
import { Field, PasswordField, cx } from '../components/ui'
import { CONVITES, TURMAS_ALUNO } from '../data/aluno'
import type { Papel } from '../data/aluno'
import { useStore } from '../store'

function AuthLayout({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <img src={bg} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex w-full max-w-[460px] flex-col items-center gap-8 rounded-lg bg-white px-9 py-8">
        <h1 className="w-full text-[40px] font-semibold text-ink">{titulo}</h1>
        {children}
      </div>
    </div>
  )
}

function AuthButtons({ principal, alternativa, para }: { principal: string; alternativa: string; para: string }) {
  return (
    <div className="flex w-full gap-3">
      <button
        type="submit"
        className="flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border border-ink bg-btn-brown px-3 py-1 text-[20px] font-medium text-ink shadow-btn"
      >
        {principal}
      </button>
      <Link
        to={para}
        className="flex min-w-0 flex-1 items-center justify-center rounded-lg bg-white px-1.5 py-1 text-[20px] font-medium text-[#505050]"
      >
        {alternativa}
      </Link>
    </div>
  )
}

function EscolhaPapel({ papel, onChange }: { papel: Papel; onChange: (p: Papel) => void }) {
  return (
    <div role="radiogroup" aria-label="Entrar como" className="flex w-full gap-2">
      {(['professor', 'aluno'] as const).map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={papel === p}
          onClick={() => onChange(p)}
          className={cx(
            'flex-1 cursor-pointer rounded-lg border px-3 py-2 text-[16px] font-medium',
            papel === p ? 'border-ink bg-btn-brown text-ink shadow-btn' : 'border-line-input bg-white text-muted',
          )}
        >
          {p === 'professor' ? 'Sou professor' : 'Sou aluno'}
        </button>
      ))}
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { entrar } = useStore()
  const [papel, setPapel] = useState<Papel>('professor')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    entrar(papel)
    navigate(papel === 'aluno' ? '/aluno/turmas' : '/equipes')
  }

  return (
    <AuthLayout titulo="Login">
      <form onSubmit={enviar} className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-3">
          <EscolhaPapel papel={papel} onChange={setPapel} />
        </div>
        <div className="-mt-4 flex flex-col gap-2">
          <Field label="Email" type="email" name="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex flex-col gap-1">
            <PasswordField label="Senha" name="senha" placeholder="Digite sua senha" value={senha} onChange={setSenha} />
            <button type="button" className="cursor-pointer text-center text-[16px] text-[#555]">
              Esqueceu a senha?
            </button>
          </div>
        </div>
        <AuthButtons principal="Concluir" alternativa="Cadastrar" para="/cadastro" />
      </form>
    </AuthLayout>
  )
}

export function Cadastro({ convite }: { convite?: boolean }) {
  const navigate = useNavigate()
  const { codigo } = useParams()
  const turma = convite ? TURMAS_ALUNO.find((t) => t.id === CONVITES[codigo ?? '']) : undefined
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (convite && !turma) return setErro('Peça um novo link de convite ao professor.')
    if (senha.length < 8) return setErro('A senha deve ter pelo menos 8 caracteres.')
    if (senha !== confirma) return setErro('As senhas não conferem.')
    setErro('')
    navigate('/login')
  }

  return (
    <AuthLayout titulo="Cadastrar">
      {convite && (
        <p
          role="status"
          className={cx('-mt-4 w-full rounded-lg border px-3 py-2 text-[14px]', turma ? 'border-line-input bg-panel text-ink' : 'border-diff-c text-diff-c')}
        >
          {turma ? `Você foi convidado(a) para a turma ${turma.nome} (${turma.periodo}).` : 'Este link de convite é inválido ou expirou.'}
        </p>
      )}
      <form onSubmit={enviar} className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Field label="Nome" name="nome" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Field label="Email" type="email" name="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="flex flex-col gap-1">
            <PasswordField label="Senha" name="senha" placeholder="Digite uma senha forte" value={senha} onChange={setSenha} />
            <PasswordField name="confirma" placeholder="Confirme sua senha" value={confirma} onChange={setConfirma} />
          </div>
          {erro && (
            <p role="alert" className="text-[14px] text-diff-c">
              {erro}
            </p>
          )}
        </div>
        <AuthButtons principal="Cadastrar" alternativa="Login" para="/login" />
      </form>
    </AuthLayout>
  )
}
