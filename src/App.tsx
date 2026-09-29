import { Navigate, Route, Routes } from 'react-router-dom'
import { Cadastro, Login } from './pages/Auth'
import { EquipeAlunos, EquipeDetalhe, EquipeFormularios, EquipeResumo, Equipes } from './pages/Equipes'
import { FormularioAlunos, FormularioDetalhe, FormularioPerguntas, FormularioResumo, Formularios } from './pages/Formularios'
import { Metricas } from './pages/Metricas'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

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
      <Route path="*" element={<Navigate to="/equipes" replace />} />
    </Routes>
  )
}

export default App
