import { useEffect, useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import dotAgendado from '../assets/figma/dot-agendado.svg'
import dotAtivo from '../assets/figma/dot-ativo.svg'
import dotInativo from '../assets/figma/dot-inativo.svg'
import dotRascunho from '../assets/figma/dot-rascunho.svg'
import { ROTULO_STATUS_ALUNO } from '../data/aluno'
import type { StatusAluno } from '../data/aluno'
import type { StatusFormulario } from '../data/mock'

export function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ')
}

export function Icon({ name, round = true, className }: { name: string; round?: boolean; className?: string }) {
  const tamanho = className?.match(/text-\[(\d+)px\]/)
  return (
    <span
      aria-hidden
      className={cx(round ? 'material-icons-round' : 'material-icons', 'shrink-0', className)}
      style={tamanho ? { fontSize: Number(tamanho[1]) } : undefined}
    >
      {name}
    </span>
  )
}

/* Botões */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string; iconRound?: boolean }

export function ButtonPrimary({ icon, iconRound = true, children, className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-ink bg-btn px-3 py-1 text-[20px] font-medium text-ink shadow-btn',
        'transition duration-100',
        'hover:bg-btn-hover hover:shadow-btn-hover',
        'active:shadow-none',
        className,
      )}
    >
      {icon && <Icon name={icon} round={iconRound} className="text-[22px]" />}
      {children}
    </button>
  )
}

export function ButtonBrown({ children, className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border border-ink bg-btn-brown px-3 py-1 text-[20px] font-medium text-ink shadow-btn',
        'transition duration-100',
        'hover:bg-btn-brown-hover hover:shadow-btn-hover',
        'active:shadow-none',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function ButtonGhost({ children, className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg bg-white px-1.5 py-1 text-[20px] font-medium text-[#505050]',
        'transition duration-100',
        'hover:opacity-80',
        'active:scale-95',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* Avatares e siglas */

export function Avatar({ letra, cor = '#15593c', size = 40, className }: { letra: string; cor?: string; size?: number; className?: string }) {
  return (
    <div
      className={cx('flex shrink-0 items-center justify-center rounded-full font-semibold text-[#ececec]', className)}
      style={{ backgroundColor: cor, width: size, height: size, fontSize: size >= 40 ? 16 : 11 }}
    >
      {letra}
    </div>
  )
}

export function TeamBadge({ sigla, cor, size = 60, fontSize }: { sigla: string; cor: string; size?: number; fontSize?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[4px] font-semibold text-white"
      style={{ backgroundColor: cor, width: size, height: size, fontSize: fontSize ?? Math.round(size / 2) }}
    >
      {sigla}
    </div>
  )
}

/* Status */

const TONS = {
  verde: { dot: dotAtivo, bg: 'bg-[#eaf7ec]', text: 'text-[#2f7a3f]' },
  azul: { dot: dotAgendado, bg: 'bg-[#eaf2f7]', text: 'text-[#2f5b7a]' },
  cinza: { dot: dotInativo, bg: 'bg-black/8', text: 'text-black/46' },
  amarelo: { dot: dotRascunho, bg: 'bg-[#f7f5ea]', text: 'text-[#7a712f]' },
} as const

type Tom = keyof typeof TONS

export function Pill({ tom, children }: { tom: Tom; children: ReactNode }) {
  const t = TONS[tom]
  return (
    <span className={cx('inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line-input px-2 py-1', t.bg)}>
      <img src={t.dot} alt="" className="size-2" />
      <span className={cx('text-[14px] font-semibold', t.text)}>{children}</span>
    </span>
  )
}

const STATUS: Record<StatusFormulario, { label: string; tom: Tom }> = {
  ativo: { label: 'Ativo', tom: 'verde' },
  agendado: { label: 'Agendado', tom: 'azul' },
  inativo: { label: 'Inativo', tom: 'cinza' },
  rascunho: { label: 'Rascunho', tom: 'amarelo' },
}

export function StatusPill({ status }: { status: StatusFormulario }) {
  return <Pill tom={STATUS[status].tom}>{STATUS[status].label}</Pill>
}

const STATUS_ALUNO: Record<StatusAluno, Tom> = {
  pendente: 'amarelo',
  andamento: 'azul',
  respondido: 'verde',
  encerrado: 'cinza',
}

export function StatusAlunoPill({ status }: { status: StatusAluno }) {
  return <Pill tom={STATUS_ALUNO[status]}>{ROTULO_STATUS_ALUNO[status]}</Pill>
}

/* Barras */

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-3 w-full overflow-hidden rounded-lg bg-white shadow-[inset_0_0_1px_rgba(0,0,0,0.45)]"
    >
      <div className="h-full rounded-lg bg-[#b8b8b8] shadow-[inset_0_0_1px_rgba(0,0,0,0.45)]" style={{ width: `${value}%` }} />
    </div>
  )
}

/* Campos */

export function Field({ label, className, ...rest }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={id} className="text-[18px] text-ink">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className={cx(
          'w-full rounded-lg border border-placeholder bg-white p-3 text-[16px] text-ink placeholder:text-placeholder read-only:text-placeholder',
          className,
        )}
      />
    </div>
  )
}

export function PasswordField({ label, placeholder, value, onChange, name }: { label?: string; placeholder: string; value: string; onChange: (v: string) => void; name: string }) {
  const id = useId()
  const [show, setShow] = useToggle()
  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-[18px] text-ink">
          {label}
        </label>
      )}
      <div className="flex items-center rounded-lg border border-placeholder bg-white p-3">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          aria-label={label ? undefined : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-placeholder"
        />
        <button
          type="button"
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={setShow}
          className="flex cursor-pointer text-[20px] text-placeholder"
        >
          <Icon name={show ? 'visibility' : 'visibility_off'} />
        </button>
      </div>
    </div>
  )
}

function useToggle(): [boolean, () => void] {
  const [v, setV] = useState(false)
  return [v, () => setV((x) => !x)]
}

export function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
  leading,
  leadingPad = 52,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: Array<{ value: string; label: string }>
  leading?: ReactNode
  leadingPad?: number
}) {
  const id = useId()
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={id} className="text-[18px] text-ink">
        {label}
      </label>
      <div className="relative flex items-center rounded-lg border border-placeholder bg-white">
        {leading && <div className="pointer-events-none absolute left-3 flex">{leading}</div>}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={leading ? { paddingLeft: leadingPad } : undefined}
          className={cx(
            'w-full cursor-pointer appearance-none bg-transparent p-3 pr-10 text-[16px] outline-none',
            value ? 'text-ink' : 'text-placeholder',
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="keyboard_arrow_down" round={false} className="pointer-events-none absolute right-3 text-placeholder" />
      </div>
    </div>
  )
}

/* Filtros da barra */

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex w-[200px] items-center gap-2 rounded-lg border border-line-input bg-white px-3 py-2 text-muted">
      <Icon name="search" className="text-[16px]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  )
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  all = 'Todos',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  disabled?: boolean
  all?: string
}) {
  return (
    <label
      className={cx(
        'relative inline-flex items-center rounded-lg border text-[14px]',
        disabled ? 'border-[#ebebeb] bg-[#ebebeb] text-[#7f7f7f]' : 'border-line-input bg-white text-ink',
      )}
    >
      <select
        aria-label={label}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent py-2 pl-3 pr-9 outline-none [field-sizing:content] disabled:cursor-not-allowed"
      >
        <option value="">{`${label}: ${all}`}</option>
        {options.map((o) => (
          <option key={o} value={o}>{`${label}: ${o}`}</option>
        ))}
      </select>
      <Icon name="expand_more" className="pointer-events-none absolute right-3" />
    </label>
  )
}

export function SortButton({ label, onClick, icon }: { label: string; onClick?: () => void; icon: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-line-input bg-white px-3 py-2 text-[14px] text-ink"
    >
      <img src={icon} alt="" className="size-[14px]" />
      {label}
    </button>
  )
}

/* Modal */

export function Modal({
  title,
  icon,
  onClose,
  children,
  width = 480,
}: {
  title: string
  icon: string
  onClose: () => void
  children: ReactNode
  width?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const first = ref.current?.querySelector<HTMLElement>('input, select, button')
    first?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [onClose])
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-[1px]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ maxWidth: width }}
        className="my-auto flex w-full flex-col items-center gap-6 rounded-lg bg-white px-9 py-8"
      >
        <h2 id={titleId} className="flex w-full items-center text-[22px] font-semibold text-ink">
          <Icon name={icon} round={false} />
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

/* Cartões de indicador */

export function KpiCard({
  titulo,
  valor,
  detalhe,
  destaque,
  detalheTamanho = 14,
  className,
}: {
  titulo: string
  valor: ReactNode
  detalhe: ReactNode
  destaque?: boolean
  detalheTamanho?: number
  className?: string
}) {
  return (
    <div className={cx('flex min-w-0 flex-1 flex-col gap-2 rounded-xl border border-line bg-panel p-4', className)}>
      <p className="text-[14px] text-muted">{titulo}</p>
      <p className={cx('text-[28px] font-bold', destaque ? 'text-ok' : 'text-ink')}>{valor}</p>
      <p className="text-muted" style={{ fontSize: detalheTamanho }}>
        {detalhe}
      </p>
    </div>
  )
}

export function Panel({ titulo, subtitulo, children, className, tituloTamanho = 20 }: { titulo: string; subtitulo?: string; children: ReactNode; className?: string; tituloTamanho?: number }) {
  return (
    <section className={cx('flex flex-col gap-4 rounded-xl border border-line bg-panel p-5', className)}>
      <header className="flex flex-col gap-1">
        <h3 className="font-bold text-ink" style={{ fontSize: tituloTamanho }}>
          {titulo}
        </h3>
        {subtitulo && <p className="text-[14px] text-muted">{subtitulo}</p>}
      </header>
      {children}
    </section>
  )
}

export function DifficultyLetter({ letra, className }: { letra: string; className?: string }) {
  return <span className={cx('font-plex font-semibold', className)}>{letra}</span>
}
