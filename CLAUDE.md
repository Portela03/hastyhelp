# HastyHelp

Sistema de **autoavaliação** para alunos e professores. O aluno indica seu nível de compreensão sobre conteúdos/habilidades; o professor cria as autoavaliações, vê resultados individuais e coletivos e identifica dificuldades e padrões entre alunos.

Idioma: **português (pt-BR)** para UI, documentação, mensagens de commit e nomes de domínio. Identificadores técnicos genéricos (hooks, utilitários) podem ficar em inglês. Sempre com acentuação correta.

## Stack

- Vite + React 19 + TypeScript (strict) + Tailwind v4 (`@tailwindcss/vite`)
- Roteamento: `react-router-dom`
- Testes unitários/domínio: **Vitest** (+ Testing Library para componentes)
- Testes E2E: **Playwright**
- Sem backend por enquanto: persistência atrás de interfaces (repositórios) com implementação em memória/`localStorage`

Comandos (manter atualizados em `package.json`):

```
npm run dev          # servidor de desenvolvimento
npm run build        # tsc -b && vite build
npm run lint
npm run test         # vitest (watch)
npm run test:run     # vitest uma vez (CI)
npm run test:e2e     # playwright test
```

## Design System (obrigatório)

Toda tela nova (inclusive as do aluno) usa os tokens e componentes já existentes. **Leia [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) antes de criar ou alterar qualquer UI**; a página viva fica em `/design-system`.

- Componentes: `src/components/ui.tsx`, `layout.tsx`, `modals.tsx`. Tokens: `@theme` em `src/index.css`.
- Não escreva hex solto nem crie um segundo shell/botão/campo: reutilize; se faltar algo, crie o token/componente, documente no design system e mostre em `/design-system`.

## Design (Figma)

- MCP do Figma configurado em `.mcp.json` (autenticar com `/mcp`).
- Spec completo das telas, tokens, rotas e node IDs: [`docs/SPEC-TELAS.md`](docs/SPEC-TELAS.md).
- Arquivo: `6C4VTzYwxrg2DpZvmoMRtT`, frame `546:6577`. O Figma cobre apenas as telas do **professor** e o login/cadastro; as telas do **aluno** (N01–N06) não têm design: foram montadas com o design system (ver seção 5 de `docs/DESIGN-SYSTEM.md`) e precisam de validação.
- Ao implementar uma tela: `get_design_context` com screenshot, baixar assets para `src/assets/` (nunca deixar URL temporária do Figma no código) e adaptar às convenções deste projeto.

## Domínio (necessidades e requisitos)

### Aluno
- N01 Login individual · N02 ver autoavaliações disponibilizadas · N03 entender claramente o conteúdo/habilidade avaliado · N04 indicar nível de compreensão pelas opções · N05 revisar respostas antes de enviar · N06 histórico e evolução.

### Professor
- N07 criar autoavaliações dos conteúdos trabalhados · N08 definir perguntas e alternativas · N09 consultar respostas/dificuldades de um aluno · N10 ver resultados consolidados da turma · N11 identificar conteúdos com mais dificuldades · N12 identificar alunos com dificuldades semelhantes · N13 acompanhar evolução de alunos e grupos.

### Requisitos funcionais
- RF01 cadastro e autenticação (aluno e professor) · RF02 professor cria e disponibiliza autoavaliações para uma turma · RF03 aluno responde conforme os campos disponibilizados · RF04 respostas armazenadas associadas a **aluno, turma e conteúdo avaliado** · RF05 resultados individuais e coletivos · RF06 identificar conteúdos/aspectos de maior dificuldade (objetivo pedagógico principal) · RF07 agrupar alunos com respostas semelhantes · RF08 acompanhar resultados ao longo do tempo · RF09 aluno vê histórico das autoavaliações respondidas.

### Requisitos não funcionais
- RNF01 usabilidade clara e simples · RNF02 **responsividade** (desktop e mobile) · RNF03 segurança e acesso por permissão · RNF04 privacidade: respostas/desempenho só para usuários autorizados · RNF05 integridade das respostas armazenadas.

> Tela do Figma "Formulário" = autoavaliação; "Equipe" = turma; "Dificuldade" usa a escala **I / P / C** (níveis de compreensão; confirmar o significado exato com a equipe antes de nomear no domínio).

## Arquitetura — DDD

Organizar por **contexto delimitado**, não por tipo técnico. Cada contexto tem camadas com dependência apontando para dentro (`ui → application → domain`; `infra` implementa interfaces do domínio).

```
src/
  contexts/
    identidade/      # Usuário, Papel (Aluno|Professor), autenticação, autorização
    turmas/          # Turma (Equipe), Período letivo, Matrícula, convite
    autoavaliacoes/  # Autoavaliação (Formulário), Pergunta, Alternativa, Publicação/Status
    respostas/       # Resposta, Envio (rascunho → revisão → enviado), Histórico
    analise/         # Dificuldades, Agrupamento de alunos, Evolução, Métricas
      domain/          # entidades, value objects, agregados, serviços de domínio, eventos, interfaces de repositório
      application/     # casos de uso (um arquivo por caso de uso), DTOs
      infra/           # repositórios (memória/localStorage), adaptadores
      ui/              # componentes e páginas React específicos do contexto
  shared/            # kernel compartilhado: Result, Id, Data/Período, hooks, ui/ (Button, Modal, Input…)
  app/               # composição: rotas, providers, injeção de dependências
```

Regras:
- **Linguagem ubíqua** em pt-BR nos nomes do domínio (`Turma`, `Autoavaliacao`, `Resposta`, `NivelDeCompreensao`, `PeriodoLetivo`). Sem acentos em identificadores de código; acentos nos textos exibidos.
- `domain/` é TypeScript puro: **sem React, sem `localStorage`, sem `fetch`**. Invariantes ficam no domínio (ex.: autoavaliação só publica com ≥ 1 pergunta; resposta enviada é imutável; envio exige todas as perguntas respondidas).
- Agregados pequenos, referenciando outros por **Id** (não por objeto). Value objects imutáveis (`Email`, `Senha`, `PeriodoLetivo`, `Sigla`, `PercentualDeResposta`).
- Casos de uso recebem dependências por construtor/parâmetro (repositórios, relógio, gerador de Id) para serem testáveis. Componentes React chamam casos de uso via hooks; **regra de negócio não mora em componente**.
- Comunicação entre contextos por Id e eventos de domínio/serviços de aplicação, sem importar `domain/` de outro contexto diretamente (usar `shared/` ou uma interface pública `index.ts` do contexto).
- Autorização (RNF03/RNF04) é regra de domínio/aplicação: aluno só lê as próprias respostas; professor só vê turmas que leciona. Nunca depender apenas de esconder botão na UI.

## TDD — obrigatório

Ciclo **Red → Green → Refactor** para todo código de domínio e aplicação:

1. Escreva o teste que falha (descreva o comportamento em pt-BR: `it('não permite publicar autoavaliação sem perguntas')`).
2. Rode e **veja falhar pelo motivo certo**.
3. Implemente o mínimo para passar.
4. Refatore com os testes verdes.

Regras:
- Testes de `domain/` e `application/` são unitários, rápidos, sem DOM nem rede, ao lado do código (`*.test.ts`).
- Componentes: Vitest + Testing Library, testando comportamento visível (papéis/labels), não implementação.
- Bug corrigido = teste de regressão escrito antes da correção.
- Não entregar funcionalidade sem teste. Não afrouxar/pular teste para passar (`.skip`, asserts removidos) sem justificar ao usuário.
- Antes de concluir qualquer tarefa: `npm run test:run`, `npm run lint` e `npm run build` passando.

## Playwright — E2E

- Testes em `e2e/` (`*.spec.ts`), config em `playwright.config.ts` com `webServer` subindo `npm run dev`.
- Cobrem **fluxos de usuário** ligados aos requisitos, nomeados com o ID: ex. `RF01 - professor se cadastra e faz login`, `RF02 - professor cria e publica autoavaliação`, `RF03/N05 - aluno responde, revisa e envia`, `RF05 - professor vê resultados da turma`.
- Selecionar por **papel/label/texto** (`getByRole`, `getByLabel`), evitar seletores CSS frágeis; `data-testid` só quando não houver alternativa semântica.
- Cada teste é independente: prepara o próprio estado (seed em memória/`localStorage`) e não depende de ordem.
- Rodar em viewport desktop (1440×810) **e** mobile para cobrir RNF02 nas telas principais.
- Validação visual: comparar com os screenshots do Figma em 1440×810 ao finalizar uma tela; usar Playwright para capturar.
- Ordem: unitário (TDD) primeiro, E2E do fluxo depois de a tela existir. E2E não substitui teste de domínio.

## Convenções de código

- TypeScript `strict`; sem `any` (usar `unknown` + estreitamento). Tipos de domínio explícitos, sem `enum` (preferir uniões literais).
- Tailwind com tokens definidos em `src/index.css` (`@theme`); não espalhar hex soltos. Ver tokens em `docs/SPEC-TELAS.md`.
- Componentes funcionais pequenos; acessibilidade obrigatória (labels, foco visível, `role="dialog"` + `aria-modal` + Esc nos modais, `role="tablist"` nas abas).
- Responsivo desde o início (mobile-first, breakpoints Tailwind); o Figma é 1440×810 mas RNF02 exige mobile.
- Nomes de arquivos: componentes `PascalCase.tsx`; demais `kebab-case.ts`. Um caso de uso por arquivo, nome no infinitivo (`publicar-autoavaliacao.ts`).
- Não introduzir dependências novas sem necessidade clara; se necessário, dizer o porquê.
- Dados mockados só em `infra/` ou `tests/`, nunca dentro de `domain/`.

## Git

- Trabalhar em branch/worktree próprio; **nunca** commit direto nem push forçado em `main`.
- Commits pequenos e em português no imperativo (`Adiciona agregado Turma`), preferencialmente um por ciclo TDD relevante.
- **Nunca** adicionar `Co-Authored-By` nem "Generated with Claude" em commits ou PRs (preferência do usuário).
- Não commitar `node_modules`, `dist`, `playwright-report`, `test-results`, `.env`.

## Ordem de trabalho sugerida

1. Fundação: Vitest + Playwright + tokens + `AppShell` + roteamento (com testes de fumaça).
2. `identidade` (RF01, N01) → `turmas` → `autoavaliacoes` (RF02, N07/N08) → `respostas` (RF03/RF04, N04/N05/N09) → `analise` (RF05–RF08, N10–N13) e histórico do aluno (RF09, N06).
3. Cada fatia vertical: testes de domínio → casos de uso → UI conforme Figma → E2E do fluxo.
