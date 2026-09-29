import { useState } from 'react'
import { AppShell, Banner } from '../components/layout'
import { FilterSelect, KpiCard } from '../components/ui'
import { EVOLUCAO_SEMESTRE, PERIODOS } from '../data/mock'
import { useStore } from '../store'

const TURMAS_METRICAS = [
  { nome: 'Programação para Dispositivos Móveis', valor: 78, cor: '#8fcbc5' },
  { nome: 'Estatística Aplicada', valor: 64, cor: '#b98fcb' },
]

export function Metricas() {
  const { equipes } = useStore()
  const [periodo, setPeriodo] = useState('2026/02')
  const [turma, setTurma] = useState('')
  const [aluno, setAluno] = useState('')
  const [formulario, setFormulario] = useState('')
  const [status, setStatus] = useState('')
  const [data, setData] = useState('Últimos 30 dias')

  const turmas = [...new Set(equipes.map((e) => e.nome))]

  return (
    <AppShell>
      <Banner
        variante="lista"
        titulo="Métricas"
        subtitulo="Aqui você acompanha o desempenho de todas suas turmas podendo escolher quais dados ver"
      >
        <div className="flex flex-col items-end gap-1">
          <span className="text-[18px]">Visão atual</span>
          <strong className="text-[22px] font-bold">{turma || 'Todas as turmas'}</strong>
        </div>
      </Banner>

      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-white p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect label="Período" all="Todos" value={periodo} onChange={setPeriodo} options={[...PERIODOS]} />
            <FilterSelect label="Turma" all="Todas" value={turma} onChange={(v) => { setTurma(v); if (!v) setAluno('') }} options={turmas} />
            <FilterSelect label="Aluno" value={aluno} onChange={setAluno} disabled={!turma} options={['Sarah Chen', 'James Park', 'Michael Torres', 'Lisa Anderson']} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect label="Formulário" value={formulario} onChange={setFormulario} options={['Teste', 'Média, mediana e moda']} />
            <FilterSelect label="Status do formulário" value={status} onChange={setStatus} options={['Ativo', 'Agendado', 'Inativo', 'Rascunho']} />
          </div>
        </div>
        <FilterSelect label="Data" all="Todos" value={data} onChange={setData} options={['Últimos 30 dias', 'Últimos 7 dias', 'Semestre']} />
      </div>

      <section className="flex flex-col gap-[18px] rounded-xl border border-line bg-white p-5">
        <header className="flex flex-col gap-[3px]">
          <h2 className="text-[22px] font-bold text-ink">Visão geral</h2>
          <p className="text-[13px] text-muted">{`Consolidado de todas as turmas · semestre ${periodo || '—'}`}</p>
        </header>
        <div className="flex flex-wrap gap-3.5">
          <KpiCard className="min-w-[200px] gap-[7px] bg-panel" titulo="Desempenho médio" valor="68%" destaque detalhe="+4 p.p. em relação a 2026/1" detalheTamanho={13} />
          <KpiCard className="min-w-[200px] gap-[7px]" titulo="Taxa de respostas" valor="82%" detalhe="148 de 180 alunos" detalheTamanho={13} />
          <KpiCard className="min-w-[200px] gap-[7px]" titulo="Formulários concluídos" valor="23" detalhe="de 28 formulários publicados" detalheTamanho={13} />
          <KpiCard className="min-w-[200px] gap-[7px]" titulo="Maior dificuldade" valor="P" detalhe="34% das respostas incorretas" detalheTamanho={13} />
        </div>
        <div className="flex flex-col gap-[18px] lg:flex-row">
          <section className="flex min-w-0 flex-1 flex-col gap-3.5 rounded-xl border border-line bg-panel p-[18px]">
            <header className="flex flex-col gap-[3px]">
              <h3 className="text-[18px] font-bold text-ink">Desempenho por turma</h3>
              <p className="text-[13px] text-muted">Média de domínio nos formulários respondidos</p>
            </header>
            <ul className="flex flex-col gap-3">
              {TURMAS_METRICAS.map((t) => (
                <li key={t.nome} className="flex flex-col gap-1.5">
                  <div className="flex flex-col text-[13px] text-ink">
                    <span className="font-semibold">{t.nome}</span>
                    <strong>{t.valor}%</strong>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-track" role="progressbar" aria-label={t.nome} aria-valuenow={t.valor} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full" style={{ width: `${t.valor}%`, backgroundColor: t.cor }} />
                  </div>
                </li>
              ))}
              <li className="flex flex-col gap-1.5">
                <div className="flex flex-col text-[13px] text-[#7f7f7f]">
                  <span className="font-semibold">2 turmas sem dados</span>
                  <strong>...</strong>
                </div>
                <div className="h-2.5 rounded-full bg-track" />
              </li>
            </ul>
          </section>
          <section className="flex w-full shrink-0 flex-col gap-3.5 rounded-xl border border-line bg-panel p-[18px] lg:w-[390px]">
            <header className="flex flex-col gap-[3px]">
              <h3 className="text-[18px] font-bold text-ink">Evolução do semestre</h3>
              <p className="text-[13px] text-muted">Média consolidada por mês</p>
            </header>
            <div role="img" aria-label="Evolução mensal da média consolidada" className="flex h-[145px] items-end justify-between border-b border-line px-[22px] pb-0">
              {EVOLUCAO_SEMESTRE.map((m, i) => (
                <div key={m.mes} className="flex w-11 flex-col items-center gap-1">
                  <span className="text-[12px] font-bold text-ink">{m.valor}%</span>
                  <div
                    className="w-5 rounded-t-[5px]"
                    style={{ height: (m.valor - 48) * 3, backgroundColor: i === EVOLUCAO_SEMESTRE.length - 1 ? '#34785c' : '#8fcbc5' }}
                  />
                </div>
              ))}
            </div>
            <div className="-mt-1.5 flex justify-between px-[22px] text-[12px] text-muted">
              {EVOLUCAO_SEMESTRE.map((m) => (
                <span key={m.mes} className="w-11 text-center">
                  {m.mes}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  )
}
