# HastyHelp — Spec de implementação das telas (Figma → React)

Sistema de autoavaliação para professores acompanharem **equipes (turmas)**, **formulários (avaliações)** e **métricas**.

- **Figma:** https://www.figma.com/design/6C4VTzYwxrg2DpZvmoMRtT/Sistema-de-Autoavalia%C3%A7%C3%A3o---4%C2%B0semestre?node-id=546-6577&m=dev
- **Frame raiz:** `546:6577` — "Protótipo/Alta fidelidade" (8950×4185, 15 telas de 1440×810)
- **fileKey:** `6C4VTzYwxrg2DpZvmoMRtT`
- **Stack do projeto:** Vite + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/vite`). Sem backend: usar dados mockados tipados.
- **MCP:** servidor Figma em `.mcp.json`. Autentique com `/mcp` antes de rodar os prompts.

> Regra do Figma MCP: para cada tela, chame `get_design_context` **com screenshot**, use o screenshot como alvo visual, baixe os assets retornados para `src/assets/` (nunca deixe URL temporária `figma.com/api/mcp/asset/...` no código) e adapte o React+Tailwind gerado às convenções deste projeto.

---

## 1. Design tokens

Definir em `src/index.css` com `@theme` (Tailwind v4) e usar como utilitários (`bg-sidebar`, `text-ink` …) em vez de valores soltos.

### Tipografia
| Uso | Fonte | Observação |
|---|---|---|
| Texto geral, títulos, botões | **Instrument Sans** (Regular 400, Medium 500, SemiBold 600, Bold 700) | Google Fonts; `font-variation-settings: "wdth" 100` |
| Textos pontuais ("Equipes ▾", "Mostrar turmas ocultas", "…") | **Inter** Regular | usada em alguns rótulos do Figma |
| Ícones | **Material Icons Round** (e Material Icons nos itens do menu) | ligaduras por nome: `groups`, `assignment`, `bar_chart`, `add`, `search`, `expand_more`, `more_horiz`, `chevron_right`, `edit`, `delete`, `visibility_off` |

Escala usada: 12 (rótulo do menu, uppercase, tracking .24px) · 14 (filtros) · 15/16 (corpo, nome de equipe com tracking −0.64px) · 20 (itens do menu, botões) · 28 bold (título do banner) · 30 semibold (sigla do card).

### Cores
| Token | Hex | Uso |
|---|---|---|
| `page` | `#fafafa` | fundo da área de conteúdo |
| `sidebar` | `#a08d77` | fundo da sidebar (borda `#9f9082`) |
| `sidebar-active` | `#5f574f` | aba ativa e divisor da sidebar |
| `sidebar-label` | `#fffaf2` (70% opacidade) | "NAVEGAÇÃO" |
| `topbar` | `#f7f2ec` | barra superior (borda `#e5ded4`) |
| `banner-from` / `banner-to` | `#f7f2ec` → `#efe4d8` | gradiente horizontal do banner |
| `line` | `#e5ded4` | bordas de banner/filtros |
| `line-input` | `#dbc9b1` | bordas de filtros/inputs, fundo do card de perfil |
| `btn-primary` | `#eee4da` | botão primário (borda `#333`, sombra sólida `2px 2px 0 #333`) |
| `ink` | `#333333` | texto principal |
| `ink-muted` | `#666666` | texto secundário |
| `card-secondary` | `#404040` | var `Cards/Secundario` |
| `card-border` | `#b7b7b7` | borda dos cards (sombra `0.5px 0.5px 0 #b7b7b7`) |
| `progress-fill` / `progress-track` | `#b8b8b8` / `#ffffff` | barra de resposta (12px, raio 8, sombra interna `0 0 1px rgba(0,0,0,.45)`) |
| `avatar-prof` | `#15593c` | avatar do professor "A" |
| Cores de equipe (6) | `#8fcbc5` (padrão, teal) · laranja · vermelho · verde · rosa · roxo | seletor "Cor" no modal Editar Equipe |
| Dificuldade I / P / C | azul `#5ab0d8` · marrom `#a08d77` · vermelho `#f0606a` | barras e donut (valores aproximados; confirmar via `get_design_context`) |
| Status | Ativo (verde) · Agendado (azul) · Inativo (cinza) · Rascunho (amarelo/oliva) | *pill* com bolinha; ver tela Formulários |

Cores marcadas "aproximado/laranja/rosa…" devem ser lidas do Figma no `get_design_context` da tela indicada — não inventar.

### Raios, sombras e layout
- Raios: card 8 · filtro/input 8 · banner 16 · barra de filtros 12 · aba do menu 12 · perfil 14 · sigla 4 · modal ≈ 8.
- Sombra do banner: `0 4px 12px rgba(0,0,0,.08)` + inset `0 1px 4px rgba(255,255,255,.2)`. Efeito `Cards Effects`: `0 0 2.5px rgba(0,0,0,.30)`.
- **Shell:** viewport 1440×810 → sidebar fixa **220px** + coluna de **1220px**; topbar **54px**; conteúdo com `px-10` (40px) e `gap-5` (20px). Deve ser responsivo além disso (grid de cards colapsa 3→2→1 colunas).
- Modais: overlay escuro com `backdrop-blur`, card branco centralizado, largura 480 (equipes) ou 647 (formulários).

---

## 2. Rotas e navegação

| Rota | Tela |
|---|---|
| `/login` | Login |
| `/cadastro` | Cadastrar |
| `/equipes` | Minhas Equipes (+ modal Criar equipe via estado/`?criar=1`) |
| `/equipes/:id` | Detalhe da equipe — abas **Formulários** (padrão) · **Alunos** · **Resumo** (+ modal Editar equipe) |
| `/avaliacoes` | Formulários (+ modal Criar formulário) |
| `/avaliacoes/:id` | Detalhe do formulário — abas **Formulário** · **Alunos** · **Resumo** (+ modal Editar formulário) |
| `/metricas` | Métricas |

Use `react-router-dom`. Abas = sub-rotas ou `?aba=` (preferir sub-rotas `/equipes/:id/alunos`, `/equipes/:id/resumo`). Login/Cadastro **sem** sidebar; as demais dentro do `AppShell`.

---

## 3. Telas (mapa Figma → código)

| # | Tela | Node ID | Rota | Componente |
|---|---|---|---|---|
| 1 | Minhas Equipes | `449:2716` | `/equipes` | `pages/Equipes` |
| 2 | Modal "Criando Equipe" | `449:2758` | `/equipes` (modal) | `components/CriarEquipeModal` |
| 3 | Login | `449:2828` | `/login` | `pages/Login` |
| 4 | Cadastrar | `449:2847` | `/cadastro` | `pages/Cadastro` |
| 5 | Formulários (lista) | `449:2868` | `/avaliacoes` | `pages/Formularios` |
| 6 | Modal "Criando Formulário" | `449:2907` | `/avaliacoes` (modal) | `components/CriarFormularioModal` |
| 7 | Detalhe do formulário — aba Formulário | `449:3012` | `/avaliacoes/:id` | `pages/FormularioDetalhe` |
| 8 | Modal "Editando Formulário" | `449:3090` | `/avaliacoes/:id` (modal) | `components/EditarFormularioModal` |
| 9 | Detalhe do formulário — aba Alunos | `449:3227` | `/avaliacoes/:id/alunos` | idem |
| 10 | Detalhe da equipe — aba Formulários | `449:3310` | `/equipes/:id` | `pages/EquipeDetalhe` |
| 11 | Modal "Editando Equipe" | `449:3355` | `/equipes/:id` (modal) | `components/EditarEquipeModal` |
| 12 | Detalhe da equipe — aba Alunos | `449:3437` | `/equipes/:id/alunos` | idem |
| 13 | Detalhe do formulário — aba Resumo | `449:3534` | `/avaliacoes/:id/resumo` | idem |
| 14 | Métricas | `449:3633` | `/metricas` | `pages/Metricas` |
| 15 | Detalhe da equipe — aba Resumo | `449:3743` | `/equipes/:id/resumo` | idem |

Os quadros "TeamsPage" são nomes herdados; cada um é uma tela distinta acima.

### Descrição por tela

**Compartilhado (AppShell)**
- *Sidebar* (220px): rótulo "NAVEGAÇÃO"; abas **Equipes** (`groups`), **Avaliações** (`assignment`), **Métricas** (`bar_chart`) — ativa com `sidebar-active`, texto branco 20px semibold; inativas medium. Rodapé: divisor + card de perfil (avatar "A" verde, "Alberto", "Professor", `chevron_right`).
- *Topbar* (54px): sino com bolinha vermelha (notificação), **ação primária que muda por tela** (ver abaixo), `more_horiz`.
- *Banner* (100px, raio 16, gradiente + 2 *blobs* SVG decorativos): título 28 bold + subtítulo 16 `#666`; à direita métricas da tela (quando houver).
- *Abas* (detalhes): "Formulários/Formulário", "Alunos", "Resumo"; aba ativa em branco com borda, linha inferior `line`.

**1 · Equipes** — topbar: **+ Criar equipe**. Banner "Minhas Equipes" / "Bem-vindo(a) de volta! Aqui você acompanha o progresso e o engajamento das suas turmas com facilidade.". Barra: busca "Buscar equipes…", filtro "Período: Todos ▾", checkbox "Mostrar turmas ocultas", ordenação "Alfabeticamente". Seção "Equipes ▾" com grid de 3 colunas de **TeamCard**: quadrado 60px com sigla ("PD") na cor da equipe, nome (semibold 16), "…" menu, "30 Alunos • Último formulário a 2 dias", "Taxa de resposta: 43%" + barra de progresso.

**2 · Criar equipe (modal)** — "+ Criando Equipe"; campos: *Nome da equipe* (placeholder "Ex: Engenharia de Software - 5° Semestre"), *Período letivo* (select "Selecione o período"), *Docente* (somente leitura, avatar + "Alberto"); botões **Concluir** (primário) e **Cancelar** (texto); nota: "Novos alunos podem ser adicionados acessando a aba 'Alunos' dentro da equipe ou enviando o link de convite".

**3 · Login** — fundo geométrico *low-poly* bege/marrom (exportar como asset), card branco 460px centralizado: "Login", *Email*, *Senha* (ícone olho mostra/oculta), link "Esqueceu a senha?", **Concluir** e **Cadastrar**.

**4 · Cadastrar** — mesmo layout: "Cadastrar", *Nome* ("Nome completo"), *Email*, *Senha* ("Digite uma senha forte"), *Confirme sua senha* (ambas com olho); **Cadastrar** e **Login**. Validar: e-mail válido, senha ≥ 8, confirmação igual.

**5 · Formulários** — topbar: **+ Criar formulário**. Banner "Formulários". Filtros: busca, "Turma: Todas", "Status: Todos", "Período: Todos", ordenação "Data de publicação". Lista de **FormRow**: sigla colorida, título, "Programação para Dispositivos Móveis • Período", "20/30 respostas", *pill* de status à direita (**Agendado**, **Ativo**, **Inativo**, **Rascunho**) e data "09/08/26". Rascunho não tem sigla: mostra "Última modificação: 09/08/26".

**6 · Criar formulário (modal)** — "+ Criando Formulário": *Nome do Formulário*, *Período letivo* (select com equipe/sigla), *Data de publicação* (date) + *Horário* (time), checkbox "Postar ao criar formulário" (desabilita data/hora), lista **Perguntas** numeradas (ícones editar/excluir), botão "+ Adicionar", **Criar** / **Cancelar**.

**7 · Formulário — aba Formulário** — topbar: **Notificar pendentes**. Banner: título "Teste Algebra Linear - Média, mediana e moda", "Algebra Linear - 2026/2", à direita "Maior dificuldade **P**". Faixa de status: *pill* "Ativo", "Publicado em 12/08/26", barra "20/30 Alunos responderam". Card com perguntas numeradas (círculo escuro): Q1 rádio (3 opções, 1 marcada), Q2 checkbox (múltipla), etc. Somente visualização.

**8 · Editar formulário (modal)** — "✎ Editando Formulário": *Nome*, *Status* (select com *pill* "Ativo — Aberto para alunos responderem"; opções Ativo/Agendado/Inativo/Rascunho), *Período letivo* (somente leitura), lista de perguntas, **Concluir** / **Cancelar**.

**9 · Formulário — aba Alunos** — seções recolhíveis: "Responderam (2/4)" (colunas ALUNO · Autoavaliação · Maior Dificuldade · AÇÃO "…"), "Visualizaram (1/4)", "Pendente (1/4)" (só ALUNO). Avatares com iniciais e cor por aluno.

**10 · Equipe — aba Formulários** — topbar: **✎ Editar equipe**. Banner com sigla 75px, nome, "Wellington Fernando Bastos • 30 alunos", à direita "Domínio médio 67%" e "Engajamento 80%". Filtros: busca, "Status: Todos", "Data de publicação". Linhas: bolinha de status, título, "Taxa de resposta: 25/50" + barra, "Domínio Médio 50%", "Maior dificuldade P", "Data de criação 29/08", "…".

**11 · Editar equipe (modal)** — "✎ Editando Equipe": *Nome*, *Período letivo* ("2026/02"), *Sigla* ("PD"), *Cor* (preview 80px + 6 amostras selecionáveis), **Concluir** / **Cancelar**. A sigla/cor atualiza o card e o banner.

**12 · Equipe — aba Alunos** — "Docentes (1)" (tabela ALUNO) e "Alunos (4)" (ALUNO · DOMÍNIO MÉDIO · FORMULÁRIOS ENVIADOS · AÇÃO): Sarah Chen 85% 4/4 · James Park 74% 3/4 · Michael Torres 58% 2/4 · Lisa Anderson 42% 1/4.

**13 · Formulário — aba Resumo** — card "Resumo da autoavaliação": 4 KPIs (Taxa de respostas 75% · Valor médio da nota 6,8/10 · Observações enviadas 3 · Maior dificuldade P); "Principal dificuldade dividida em 3 grupos" (barras I 40% / P 58% / C 20%); "Observações dos alunos" (citações com "N alunos"); "Dificuldades gerais" (lista com contagem, ex.: "Fórmula da média aritmética — 18"). *Rolagem:* a tela do Figma é cortada — pedir `get_design_context` do nó para ver o restante.

**14 · Métricas** — topbar sem ação primária. Banner "Métricas" + "Visão atual **Todas as turmas**". Filtros: Período 2026/2, Turma, Aluno (desabilitado até escolher turma), Formulário, Status do formulário, Data (últimos 30 dias). Card "Visão geral": KPIs (Desempenho médio 68% verde · Taxa de respostas 82% · Formulários concluídos 23 · Maior dificuldade P); "Desempenho por turma" (barras coloridas com cor da equipe, "2 turmas sem dados"); "Evolução do semestre" (gráfico de colunas Mai→Set, último destacado em verde escuro). Rolagem: restante da tela fica abaixo da dobra.

**15 · Equipe — aba Resumo** — "Resumo da equipe": KPIs (Engajamento 86% · Valor médio da nota 7,5/10 · Desempenho geral +6% · Maior dificuldade I); "Evolução do desempenho" (5 colunas: Diagnóstico 58%, Atividade 1 63%, três "A definir" com "??%" cinza); "Distribuição de Dificuldade" (donut I 25% / P 35% / C 45%); "Maior dificuldade por formulário" (lista "Média, mediana e moda: P", …).

---

## 4. Estrutura de código sugerida

```
src/
  assets/            # SVGs/imagens baixados do Figma (blobs, fundo do login, ícones)
  components/
    layout/          # AppShell, Sidebar, Topbar, PageBanner, Tabs
    ui/              # Button, Input, Select, Checkbox, Modal, StatusPill, Avatar, ProgressBar, KpiCard, DataTable
    charts/          # BarChart, DonutChart, HorizontalBars (SVG/CSS simples, sem lib pesada)
    equipes/  formularios/
  pages/             # Login, Cadastro, Equipes, EquipeDetalhe, Formularios, FormularioDetalhe, Metricas
  data/              # mocks tipados (equipes, formularios, alunos, metricas)
  types/
  routes.tsx  main.tsx  index.css
```

Regras: componentes pequenos e reutilizáveis (um `TeamCard`, um `FormRow`, um `DataTable`, um `KpiCard` servem várias telas); acessibilidade (labels associados, foco visível, `role="dialog"` + `aria-modal` + Esc para fechar nos modais, `role="tablist"` nas abas, `aria-valuenow` nas barras); teclado navegável.

---

## 5. Prompt principal (colar no Claude Code)

```
Implemente as telas do sistema HastyHelp neste projeto (Vite + React + TypeScript + Tailwind v4)
seguindo docs/SPEC-TELAS.md.

Design: https://www.figma.com/design/6C4VTzYwxrg2DpZvmoMRtT/Sistema-de-Autoavalia%C3%A7%C3%A3o---4%C2%B0semestre?node-id=546-6577&m=dev

Passos:
1. Configure fontes (Instrument Sans, Inter, Material Icons Round) e os tokens de cor/raio/sombra
   da seção 1 em src/index.css (@theme). Instale react-router-dom.
2. Monte o AppShell (Sidebar 220px + Topbar 54px + Banner) e os componentes ui/ reutilizáveis.
3. Para CADA tela da tabela da seção 3, chame get_design_context (com screenshot) no node ID
   indicado, baixe os assets para src/assets/ e implemente como componente React interativo
   (filtros, busca, ordenação, abas, modais, show/hide de senha, seleção de cor, checkbox
   "Postar ao criar formulário"), usando dados mockados tipados em src/data/.
4. Não deixe URLs figma.com/api/mcp/asset no código. Não use posicionamento absoluto quando um
   layout flex/grid reproduz o design.
5. Compare cada tela com o screenshot do Figma em 1440×810 e corrija diferenças.
6. Rode `npm run build` e `npm run lint` no final e corrija erros.

Entregue por etapas: (a) fundação + Equipes, (b) Login/Cadastro, (c) Formulários, (d) detalhes de
equipe, (e) detalhe de formulário, (f) Métricas. Faça um commit por etapa.
```

## 6. Prompts por tela (formato do Figma)

Use um por vez após a fundação estar pronta:

```
Implement this design from Figma.
@https://www.figma.com/design/6C4VTzYwxrg2DpZvmoMRtT/Sistema-de-Autoavalia%C3%A7%C3%A3o---4%C2%B0semestre?node-id=449-2716&m=dev
```

Troque `node-id` por: `449-2758` (modal criar equipe) · `449-2828` (login) · `449-2847` (cadastro) · `449-2868` (formulários) · `449-2907` (modal criar formulário) · `449-3012` (formulário/aba formulário) · `449-3090` (modal editar formulário) · `449-3227` (formulário/aba alunos) · `449-3310` (equipe/aba formulários) · `449-3355` (modal editar equipe) · `449-3437` (equipe/aba alunos) · `449-3534` (formulário/aba resumo) · `449-3633` (métricas) · `449-3743` (equipe/aba resumo).

## 7. Critérios de aceite

- As 15 telas existem, navegáveis pelas rotas da seção 2, iguais ao Figma em 1440×810 (tolerância de 2px).
- Modais abrem/fecham (botão Cancelar, Esc, clique no overlay) e atualizam o estado mockado.
- Filtros, busca e ordenação funcionam nas listas; abas trocam sem recarregar.
- Sem URLs temporárias do Figma; todos os assets locais e não vazios.
- `npm run build` e `npm run lint` passam.

## 8. Pontos em aberto (confirmar com o design)

1. Cores exatas de Status, Dificuldade I/P/C e das 6 cores de equipe — ler no `get_design_context` das telas 5, 13 e 11.
2. Telas 7, 13 e 14 têm conteúdo abaixo da dobra (rolagem) — pedir o contexto completo do nó.
3. Textos com erros no Figma ("Moveis", "Dominio", "Ultimo") — manter fiel ou corrigir acentuação? Sugestão: **corrigir** ("Móveis", "Domínio", "Último").
4. Fluxo real de autenticação/backend não está no design — usar mock local até definir API.
