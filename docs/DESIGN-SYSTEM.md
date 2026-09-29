# HastyHelp — Design System

Fonte única de verdade visual do projeto. **Toda tela nova (inclusive as do aluno) deve ser montada com estes tokens e componentes**, sem inventar cores, tamanhos ou padrões novos.

- Origem: Figma `6C4VTzYwxrg2DpZvmoMRtT`, frame `546:6577` (ver [`SPEC-TELAS.md`](SPEC-TELAS.md)).
- Página viva com os componentes reais: rota **`/design-system`** (`src/pages/DesignSystem.tsx`).
- Tokens: `src/index.css` (`@theme`). Componentes: `src/components/ui.tsx`, `layout.tsx`, `modals.tsx`.

> Regra de ouro: **se já existe um componente ou token para o caso, use-o.** Se o Figma trouxer algo realmente novo, adicione ao design system (token/componente + esta página + `/design-system`) antes de usar numa tela.

---

## 1. Identidade visual

Estilo **acolhedor e sóbrio**: paleta terrosa (bege/marrom) sobre fundo quase branco, cantos arredondados (8–16px), bordas finas e um único elemento "gráfico" marcante — o **botão com sombra sólida deslocada** (`2px 2px 0 #333`). Tipografia limpa (Instrument Sans). Sem gradientes fortes, sem sombras difusas pesadas.

## 2. Tokens

### Cores (`@theme` → utilitários `bg-*`, `text-*`, `border-*`)
| Token | Hex | Uso |
|---|---|---|
| `page` | `#fafafa` | fundo da área de conteúdo |
| `sidebar` | `#a08d77` | fundo da sidebar (borda `sidebar-line` `#9f9082`) |
| `sidebar-active` | `#5f574f` | item ativo do menu, divisor |
| `sidebar-label` | `#fffaf2` | rótulo "NAVEGAÇÃO" (70% de opacidade) |
| `topbar` | `#f7f2ec` | barra superior, cabeçalho de tabela, início do gradiente do banner |
| `banner-to` | `#efe4d8` | fim do gradiente do banner |
| `line` | `#e5ded4` | bordas de painéis, banner, abas |
| `line-input` | `#dbc9b1` | bordas de filtros e linhas de lista |
| `btn` | `#eee4da` | botão primário da barra superior |
| `btn-brown` | `#dbc9b1` | botão principal de formulário/modal |
| `ink` | `#333333` | texto principal, borda e sombra do botão |
| `muted` | `#666666` | texto secundário |
| `placeholder` | `#878787` | placeholder, borda de input, texto somente-leitura |
| `card-line` | `#b7b7b7` | borda dos cards de equipe |
| `card-sec` | `#404040` | texto secundário dentro de cards |
| `professor` | `#15593c` | avatar do professor |
| `panel` | `#faf9f7` | fundo de painéis/KPIs internos |
| `track` | `#e7e1d9` | trilho de barras de progresso |
| `ok` | `#34785c` | valor positivo / barra destacada |
| `diff-i` `diff-p` `diff-c` | `#5ab3d4` `#a08d77` `#ee5e5e` | dificuldade **I / P / C** |
| `bar-gray` | `#bebebe` | barras sem dado ("??%") |

**Cores de equipe** (`CORES_EQUIPE`): `#8fcbc5` (padrão) · `#f3ae8d` · `#f27c7e` · `#8df3b6` · `#df8bb3` · `#b98fcb`.
**Cores de aluno** (avatares): marrom `#a67b5b` · azul `#3b82f6` · vermelho `#ef4444` · violeta `#8b5cf6`.

**Status de formulário** (`StatusPill`): Ativo (fundo `#eaf7ec`, texto `#2f7a3f`, bolinha `#69be3a`) · Agendado (`#eaf2f7`, `#2f5b7a`, `#3a97be`) · Inativo (`rgba(0,0,0,.08)`, `rgba(0,0,0,.46)`) · Rascunho (`#f7f5ea`, `#7a712f`, `#beaf3a`).

### Tipografia
| Token | Fonte | Uso |
|---|---|---|
| `font-sans` | **Instrument Sans** 400/500/600/700, `wdth 100` | todo o texto (padrão do `body`) |
| `font-inter` | Inter 400 | rótulos pontuais ("Equipes ▾", "…", "Mostrar turmas ocultas") |
| `font-plex` / `font-plex-mono` | IBM Plex Sans 600 / Mono | letras de dificuldade **I / P / C** |
| Ícones | Material Icons Round (padrão) e Material Icons | via `<Icon name="…" />` |

Escala usada: 11–13 (legendas, eixos) · 14 (filtros, KPIs de apoio) · 16 (corpo) · 18 (rótulos de campo, títulos de painel) · 20 (botões, menu, títulos de card) · 22–24 (títulos de seção) · **28 bold** (título de banner e KPI) · 40 semibold (título de login/cadastro).

### Espaçamento, raios, sombras
- Grade de **4px**. Padding de painel 16–24; gap entre blocos da página 20; gutters da página 40px (16px no mobile).
- Raios: `4` (sigla/checkbox) · `8` (inputs, botões, cards) · `12` (painéis, barra de filtros, aba do menu) · `14` (perfil) · `16` (banner) · `999` (pills, barras).
- Sombras: `shadow-btn` (`2px 2px 0 #333`) · `shadow-card` (`.5px .5px 0 #b7b7b7`) · `shadow-banner` (`0 4px 12px rgba(0,0,0,.08)` + inset claro).

### Layout base (desktop 1440×810)
Sidebar fixa **220px** + coluna fluida; topbar **54px**; conteúdo com `gap-5`; abaixo de `lg` (1024px) a sidebar vira menu lateral (drawer) e grids colapsam 3 → 2 → 1 colunas.

---

## 3. Componentes

### `src/components/ui.tsx`
| Componente | Para quê | Props principais |
|---|---|---|
| `Icon` | ícone Material | `name`, `round` (padrão `true`), `className` (`text-[Npx]` define o tamanho) |
| `ButtonPrimary` | ação da barra superior ("Criar equipe") | `icon`, `iconRound`, `children` |
| `ButtonBrown` | ação principal de formulário/modal ("Concluir") | `type="submit"` |
| `ButtonGhost` | ação secundária ("Cancelar") | `onClick` |
| `Avatar` | círculo com inicial | `letra`, `cor`, `size` |
| `TeamBadge` | quadrado com sigla colorida | `sigla`, `cor`, `size`, `fontSize` |
| `StatusPill` | status do formulário | `status: 'ativo' \| 'agendado' \| 'inativo' \| 'rascunho'` |
| `ProgressBar` | barra de taxa de resposta (acessível) | `value` (0–100), `label` |
| `Field` | input de texto com rótulo | `label` + props de `<input>` |
| `PasswordField` | senha com olho mostrar/ocultar | `label?`, `placeholder`, `value`, `onChange`, `name` |
| `SelectField` | select de formulário com rótulo | `label`, `options`, `placeholder`, `leading` |
| `SearchBox` | busca da barra de filtros | `value`, `onChange`, `placeholder` |
| `FilterSelect` | filtro "Rótulo: Valor ▾" | `label`, `options`, `all`, `disabled` |
| `SortButton` | ordenação | `label`, `icon`, `onClick` |
| `Modal` | diálogo (Esc/overlay fecham, foco, `aria-modal`) | `title`, `icon`, `onClose`, `width` |
| `KpiCard` | indicador (título, valor grande, detalhe) | `titulo`, `valor`, `detalhe`, `destaque` |
| `Panel` | painel com título/subtítulo | `titulo`, `subtitulo`, `tituloTamanho` |
| `DifficultyLetter` | letra I/P/C na fonte Plex | `letra` |

### `src/components/layout.tsx`
| Componente | Para quê |
|---|---|
| `AppShell` | página autenticada: sidebar + topbar + conteúdo. Props: `action` (botão da topbar), `onMore`, `voltar` (`{ para, rotulo }`: mostra o botão **Voltar** no canto esquerdo da topbar, estilo da aba ativa do menu; use em toda página de detalhe, apontando para a página-mãe) |
| `Banner` (+ `BannerStat`) | faixa de título da página; `variante="lista"` muda a posição das manchas decorativas; `leading` para sigla/avatar; `children` = métricas à direita |
| `TabBar` | abas de página (usa rotas; aba ativa branca) |
| `Toolbar` | barra branca de filtros/ordenação |
| `Section` | seção recolhível com título ("Equipes ▾") |
| `DataTable` | tabela com cabeçalho `topbar`, colunas em grid, `role="table"` |

### `src/components/modals.tsx`
`CriarEquipeModal`, `EditarEquipeModal`, `CriarFormularioModal`, `EditarFormularioModal` — referência de como compor um modal (título com ícone, campos, `ButtonBrown` + `ButtonGhost`, nota final).

---

## 4. Padrões de tela

1. **Página autenticada** = `AppShell` → `Banner` → (`TabBar` | `Toolbar`) → conteúdo. Nunca criar outro shell.
2. **Lista de cards/linhas**: item branco, borda `card-line` (equipes) ou `line-input` (formulários), raio 8, `TeamBadge` à esquerda, dado principal em semibold 16, status à direita.
3. **Dashboard**: painel branco `border-line` raio 12 → linha de `KpiCard` (4 colunas, `flex-wrap`) → `Panel`s em `panel`. Gráficos são CSS/SVG simples com `role="img"` e `aria-label`.
4. **Formulário/modal**: rótulo 18px acima do campo; campos com borda `placeholder`; ações `ButtonBrown` (esquerda) + `ButtonGhost`; erro em `text-diff-c` com `role="alert"`.
5. **Tabela**: `DataTable`; primeira coluna com `Avatar` 32px + nome semibold; números centralizados.
6. **Estados vazios**: texto `text-muted` 16px simples, sem ilustração.
7. **Acessibilidade**: `label` em todo campo, foco visível, `aria-*` em barras/abas/modais, alvo de clique ≥ 32px, contraste mínimo AA (texto `muted` só sobre fundo claro).

## 5. Telas do aluno (implementadas)

Mesmo shell e mesmos componentes do professor; muda o **recorte** (menu, dados e ações). Código em `src/pages/Aluno.tsx`, regras em `src/data/aluno.ts`. O aluno **não tem design no Figma**: estas telas são uma proposta montada com o design system e devem ser validadas.

| Professor | Aluno | Rota |
|---|---|---|
| Equipes | **Turmas** (só as dele; sem criar, sem ocultas) | `/aluno/turmas` |
| Detalhe da equipe | Detalhe da turma: abas **Autoavaliações** e **Meu resumo** (sem aba Alunos) | `/aluno/turmas/:id` |
| Formulários | **Autoavaliações** de todas as turmas dele (sem criar) | `/aluno/autoavaliacoes` |
| Detalhe do formulário | **Responder → Revisar → Enviar**; depois **Minhas respostas** e **Resultado** | `/aluno/autoavaliacoes/:id` |
| Métricas | **Desempenho** (só dados dele) | `/aluno/desempenho` |
| Cadastro | Cadastro por **link de convite** | `/convite/:codigo` |

Login escolhe o papel ("Sou professor" / "Sou aluno"); `Protegida` em `App.tsx` redireciona quem abrir rota do outro papel. Clicar no cartão de perfil da sidebar faz logout.

**Decisões de produto já tomadas**
- O aluno entra na turma por **link** ou **convite do professor**. Um usuário tem **um** papel (nunca os dois).
- O aluno pode estar em **várias turmas/matérias**.
- **Prazo** é opcional e definido pelo professor (`prazo`).
- Resposta **enviada não pode ser alterada**; rascunho é salvo automaticamente (`salvarResposta`); só envia com todas as perguntas respondidas (`enviarAutoavaliacao`).
- O **gabarito** é decisão do professor (`mostrarGabarito`). O aluno **sempre** vê nota, compreensão e evolução.
- Status do aluno: **Pendente → Em andamento → Respondido**, ou **Encerrado** (prazo passou sem resposta). Visual via `StatusAlunoPill`.

**Em aberto (aguardando o professor da disciplina)**
- Significado e cálculo de **I / P / C** (hoje aparece só como dado, `compreensao`).
- Formato da pergunta de **nível de compreensão** (hoje: múltipla escolha com gabarito opcional).
- Fórmula da nota: hoje `acertos / perguntas com gabarito × 10` (`calcularNota`).
## 6. Regras para manter o sistema

- **Tokens, não hex**: nunca escreva `#xxxxxx` em componentes novos — use `bg-*`/`text-*` do tema. Se faltar cor, crie o token em `@theme` e documente aqui.
- **Uma variação nova = componente novo (ou prop) + entrada em `/design-system`.**
- **Ícones**: `text-[Npx]` na classe do `Icon` (aplicado inline, porque o CSS do Google Fonts não usa camadas do Tailwind).
- **Não** editar textos do Figma que estejam corretos; corrigir acentos ("Móveis", "Domínio") é permitido.
- **Antes de fechar uma tela**: comparar com o screenshot do Figma (1440×810) e conferir a versão mobile.


