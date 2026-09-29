import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import blob1 from '../assets/figma/bg-blob-1.svg'
import blob2 from '../assets/figma/bg-blob-2.svg'
import chevron from '../assets/figma/chevron-down.svg'
import notification from '../assets/figma/notification.svg'
import { Avatar, Icon, cx } from './ui'

const NAV_PROFESSOR = [
  { to: '/equipes', label: 'Equipes', icon: 'groups' },
  { to: '/avaliacoes', label: 'Avaliações', icon: 'assignment' },
  { to: '/metricas', label: 'Métricas', icon: 'bar_chart' },
]

const NAV_ALUNO = [
  { to: '/aluno/turmas', label: 'Turmas', icon: 'groups' },
  { to: '/aluno/autoavaliacoes', label: 'Autoavaliações', icon: 'assignment' },
  { to: '/aluno/desempenho', label: 'Desempenho', icon: 'bar_chart' },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { sessao, sair } = useStore()
  const navigate = useNavigate()
  const aluno = sessao?.papel === 'aluno'
  const NAV = aluno ? NAV_ALUNO : NAV_PROFESSOR
  const nome = sessao?.nome ?? 'Alberto'
  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col justify-between border-r border-sidebar-line bg-sidebar px-4 py-6 shadow-[1px_0_1.8px_rgba(0,0,0,0.2)]">
      <nav aria-label="Navegação principal" className="flex flex-col gap-2.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24px] text-sidebar-label opacity-70">Navegação</p>
        <ul className="flex flex-col gap-2">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    'flex h-[52px] items-center gap-2.5 rounded-xl px-3 py-2.5 text-[20px] text-white',
                    isActive ? 'bg-sidebar-active font-semibold' : 'font-medium',
                  )
                }
              >
                <span className="flex size-8 items-center justify-center">
                  <Icon name={item.icon} round={false} className="text-[26px]" />
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-3">
        <div className="h-px bg-sidebar-active" />
        <button
          type="button"
          title="Sair"
          aria-label={`Sair (${nome})`}
          onClick={() => {
            sair()
            navigate('/login')
          }}
          className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-sidebar-line bg-btn-brown px-3 py-2.5 text-left drop-shadow-[0_2px_3px_rgba(0,0,0,0.06)]"
        >
          <Avatar letra={nome[0]} cor={aluno ? '#a67b5b' : undefined} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-[15px] font-semibold text-ink">{nome}</p>
            <p className="text-[12px] text-muted">{aluno ? 'Aluno' : 'Professor'}</p>
          </div>
          <Icon name="chevron_right" round={false} className="text-[18px] text-muted" />
        </button>
      </div>
    </aside>
  )
}

const ESTILO_VOLTAR =
  'flex items-center gap-2 rounded-xl bg-sidebar-active px-3 py-1.5 text-[16px] font-semibold text-white'

/**
 * Botão de voltar no estilo da aba ativa do menu.
 * Com `para`, leva à página-mãe; sem `para`, volta no histórico do navegador
 * (e fica desabilitado quando não há para onde voltar).
 */
export function BotaoVoltar({ para, rotulo, className }: { para?: string; rotulo?: string; className?: string }) {
  const navigate = useNavigate()
  if (para) {
    return (
      <Link to={para} aria-label={`Voltar para ${rotulo ?? 'a página anterior'}`} className={cx(ESTILO_VOLTAR, className)}>
        <Icon name="arrow_back" className="text-[20px]" />
        Voltar
      </Link>
    )
  }
  const semHistorico = (window.history.state?.idx ?? 0) === 0
  return (
    <button
      type="button"
      aria-label="Voltar para a página anterior"
      disabled={semHistorico}
      onClick={() => navigate(-1)}
      className={cx(ESTILO_VOLTAR, 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', className)}
    >
      <Icon name="arrow_back" className="text-[20px]" />
      Voltar
    </button>
  )
}

export function AppShell({
  children,
  action,
  onMore,
  voltar,
}: {
  children: ReactNode
  action?: ReactNode
  onMore?: () => void
  voltar?: { para: string; rotulo: string }
}) {
  const [aberto, setAberto] = useState(false)
  return (
    <div className="flex min-h-screen bg-page">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar />
      </div>
      {aberto && (
        <div className="fixed inset-0 z-40 flex lg:hidden" onClick={() => setAberto(false)}>
          <div className="h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar onNavigate={() => setAberto(false)} />
          </div>
          <div className="flex-1 bg-black/45" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-6 pb-6">
        <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-line bg-topbar px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setAberto(true)}
              className="flex cursor-pointer text-[24px] text-ink lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <BotaoVoltar para={voltar?.para} rotulo={voltar?.rotulo} />
          </div>
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Notificações" className="size-9 cursor-pointer">
              <img src={notification} alt="" className="size-full" />
            </button>
            {action}
            <button type="button" aria-label="Mais opções" onClick={onMore} className="flex cursor-pointer text-[20px] text-black">
              <Icon name="more_horiz" />
            </button>
          </div>
        </header>
        <main className="flex flex-col gap-5 px-4 sm:px-10">{children}</main>
      </div>
    </div>
  )
}

export function Banner({
  titulo,
  subtitulo,
  leading,
  children,
  variante = 'padrao',
}: {
  titulo: string
  subtitulo?: ReactNode
  leading?: ReactNode
  children?: ReactNode
  variante?: 'padrao' | 'lista'
}) {
  return (
    <section className="relative flex min-h-[100px] items-center justify-between gap-6 overflow-hidden rounded-2xl border border-line bg-linear-to-r from-topbar to-banner-to px-6 py-5 shadow-banner">
      {variante === 'padrao' ? (
        <>
          <img src={blob1} alt="" className="pointer-events-none absolute -left-[41px] -top-[21px] size-[180px]" />
          <img src={blob2} alt="" className="pointer-events-none absolute -top-[31px] right-[81px] hidden size-[140px] md:block" />
        </>
      ) : (
        <>
          <img src={blob1} alt="" className="pointer-events-none absolute left-[310px] top-[27px] hidden size-[180px] md:block" />
          <img src={blob2} alt="" className="pointer-events-none absolute -top-[71px] right-[17px] hidden size-[140px] md:block" />
          <img src={blob2} alt="" className="pointer-events-none absolute -top-[91px] left-[268px] hidden size-[140px] md:block" />
        </>
      )}
      <div className="relative flex min-w-0 items-center gap-4">
        {leading}
        <div className="flex min-w-0 max-w-[860px] flex-col gap-1">
          <h1 className="text-[28px] font-bold leading-tight text-ink">{titulo}</h1>
          {subtitulo && <p className="text-[16px] text-muted">{subtitulo}</p>}
        </div>
      </div>
      {children && <div className="relative flex shrink-0 items-center gap-8 text-right text-muted">{children}</div>}
    </section>
  )
}

export function BannerStat({ rotulo, valor, tamanho = 20 }: { rotulo: string; valor: ReactNode; tamanho?: number }) {
  return (
    <div className="flex flex-col items-center leading-normal" style={{ fontSize: tamanho }}>
      <span>{rotulo}</span>
      <strong className="font-bold">{valor}</strong>
    </div>
  )
}

export function TabBar({ tabs }: { tabs: Array<{ to: string; label: string; end?: boolean }> }) {
  return (
    <div role="tablist" className="flex h-[46px] w-full gap-3.5 overflow-x-auto overflow-y-hidden border-b border-line">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          role="tab"
          className={({ isActive }) =>
            cx(
              'flex items-center rounded-t-lg border px-6 py-3 text-[16px] font-medium whitespace-nowrap text-muted',
              isActive ? 'h-[45px] border-line border-b-white bg-white' : 'h-[44px] border-transparent',
            )
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">{children}</div>
}

export function Section({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(true)
  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="flex w-fit cursor-pointer items-center gap-1 font-inter text-[20px] text-ink"
      >
        {titulo}
        <img src={chevron} alt="" className={cx('h-1 w-[5.5px] transition-transform', !aberto && '-rotate-90')} />
      </button>
      {aberto && children}
    </section>
  )
}

export function DataTable({
  colunas,
  linhas,
  cabecalhoAlto,
}: {
  colunas: Array<{ titulo: string; largura?: string; centro?: boolean }>
  linhas: Array<ReactNode[]>
  cabecalhoAlto?: boolean
}) {
  const grid = colunas.map((c) => c.largura ?? 'minmax(0,1fr)').join(' ')
  return (
    <div role="table" className="overflow-x-auto rounded-xl border border-line bg-white">
      <div className="min-w-[640px]">
        <div
          role="row"
          className={cx('grid items-center bg-topbar px-4 text-[13px] font-semibold uppercase text-ink', cabecalhoAlto ? 'h-[65px]' : 'h-12')}
          style={{ gridTemplateColumns: grid }}
        >
          {colunas.map((c) => (
            <div key={c.titulo} role="columnheader" className={cx(c.centro && 'text-center')}>
              {c.titulo}
            </div>
          ))}
        </div>
        {linhas.map((linha, i) => (
          <div
            key={i}
            role="row"
            className="grid min-h-16 items-center border-t border-line px-4 text-[14px] text-ink first:border-t-0"
            style={{ gridTemplateColumns: grid }}
          >
            {linha.map((cel, j) => (
              <div key={j} role="cell" className={cx(colunas[j]?.centro && 'text-center')}>
                {cel}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
