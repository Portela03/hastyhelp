import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import type { Papel } from './data/aluno'
import { useStore } from './store'
import {
  AlunoAutoavaliacaoDetalhe,
  AlunoAutoavaliacoes,
  AlunoDesempenho,
  AlunoRespostas,
  AlunoResultado,
  AlunoTurmaAutoavaliacoes,
  AlunoTurmaDetalhe,
  AlunoTurmaResumo,
  AlunoTurmas,
} from './pages/Aluno'
import { Cadastro, Login } from './pages/Auth'
import { DesignSystem } from './pages/DesignSystem'
import { EquipeAlunos, EquipeDetalhe, EquipeFormularios, EquipeResumo, Equipes } from './pages/Equipes'
import { FormularioAlunos, FormularioDetalhe, FormularioPerguntas, FormularioResumo, Formularios } from './pages/Formularios'
import { Metricas } from './pages/Metricas'

const inicioDo = (papel: Papel) => (papel === 'aluno' ? '/aluno/turmas' : '/equipes')

/** Só deixa passar quem está logado com o papel esperado (RNF03). */
function Protegida({ papel }: { papel: Papel }) {
  const { sessao } = useStore()
  if (!sessao) return <Navigate to="/login" replace />
  if (sessao.papel !== papel) return <Navigate to={inicioDo(sessao.papel)} replace />
  return <Outlet />
}

function Inicio() {
  const { sessao } = useStore()
  return <Navigate to={sessao ? inicioDo(sessao.papel) : '/login'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/convite/:codigo" element={<Cadastro convite />} />
      <Route path="/design-system" element={<DesignSystem />} />

      <Route element={<Protegida papel="professor" />}>
        <Route path="/equipes" element={<Equipes />} />
        <Route path="/equipes/:id" element={<EquipeDetalhe />}>
          <Route index element={<EquipeFormularios />} />
          <Route path="alunos" element={<EquipeAlunos />} />
          <Route path="resumo" element={<EquipeResumo />} />
        </Route>

        <Route path="/avaliacoes" element={<Formularios />} />
        <Route path="/avaliacoes/:id" element={<FormularioDetalhe />}>
          <Route index element={<FormularioPerguntas />} />
          <Route path="alunos" element={<FormularioAlunos />} />
          <Route path="resumo" element={<FormularioResumo />} />
        </Route>

        <Route path="/metricas" element={<Metricas />} />
      </Route>

      <Route element={<Protegida papel="aluno" />}>
        <Route path="/aluno/turmas" element={<AlunoTurmas />} />
        <Route path="/aluno/turmas/:id" element={<AlunoTurmaDetalhe />}>
          <Route index element={<AlunoTurmaAutoavaliacoes />} />
          <Route path="resumo" element={<AlunoTurmaResumo />} />
        </Route>

        <Route path="/aluno/autoavaliacoes" element={<AlunoAutoavaliacoes />} />
        <Route path="/aluno/autoavaliacoes/:id" element={<AlunoAutoavaliacaoDetalhe />}>
          <Route index element={<AlunoRespostas />} />
          <Route path="resultado" element={<AlunoResultado />} />
        </Route>

        <Route path="/aluno/desempenho" element={<AlunoDesempenho />} />
      </Route>

      <Route path="*" element={<Inicio />} />
    </Routes>
  )
}

export default App
