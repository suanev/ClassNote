# Prompt de Design — ClassNotes

> Enviar ao Claude design (ou ferramenta de design com IA) para criar a identidade visual do app, ícone e splash screen.

---

## PARTE 1 — Telas do aplicativo

### Contexto do projeto

**ClassNotes** é um aplicativo mobile (React Native) para professores registrarem observações sobre seus alunos em sala de aula. O professor anota comportamentos, progressos, situações ou qualquer evento relevante sobre um aluno específico, organizando por turma e turno escolar (manhã, tarde, noite).

O público é um único usuário — o próprio professor — que usa o app no dia a dia para consultar e criar registros rápidos.

---

### Navegação

**Não há barra de abas (bottom tab bar).** O app tem uma tela principal e todas as outras partes são acessadas a partir dela — como modal, tela empilhada ou bottom sheet.

**Estrutura de navegação:**

```
ObservationsScreen (tela raiz)
├── ObservationFormScreen    → empilhada (criar / editar observação)
│   └── NewClassBottomSheet  → bottom sheet inline (criar turma)
├── FilterBottomSheet        → bottom sheet (filtros e ordenação)
└── SettingsScreen           → tela empilhada (ajustes)
```

---

### Tela 1 — Observações (tela principal / raiz)

É a única tela permanente do app. Todas as navegações partem daqui.

**Cabeçalho fixo no topo:**

```
[ Observações ]          [ ⟳ sync ]  [ ⚙ ajustes ]
```

- Título "Observações" à esquerda
- Ícone de sincronização à direita (detalhe abaixo)
- Ícone de engrenagem (ajustes) ao lado do sync — abre a tela de Ajustes

**Ícone de sincronização — 3 estados:**
| Estado | Ícone | Cor | Tooltip ao tocar |
|---|---|---|---|
| Sincronizado | nuvem com check ✓ | cor primária | "Tudo sincronizado." |
| Sincronizando | spinner animado | cor primária | "Sincronizando com o servidor..." |
| Offline | nuvem com X | vermelho/danger | "Sem conexão — alterações salvas localmente." |

O tooltip aparece abaixo do ícone ao tocar e some após 3 segundos.

**Botão de filtro:**
- Ícone de filtro (funil) — posicionado abaixo do cabeçalho ou integrado a ele
- Com filtro ativo: indicação visual clara (badge com número de filtros ativos, ou cor preenchida vs. outline)
- Ao tocar: abre o **FilterBottomSheet**

**Lista de observações:**

Cada card exibe:
- Nome do aluno (destaque tipográfico — maior ou mais pesado)
- Turma + turno como subtítulo (ex: "2º Ano A · Manhã") — texto secundário/sutil
- Prévia do texto da observação (2–3 linhas com ellipsis)
- Tempo relativo no rodapé do card (ex: "há 2 horas", "ontem", "há 3 dias") — texto muted
- Ícone de estrela preenchida se a observação for favoritada

**Interações nos cards:**
- Tap no card → abre ObservationFormScreen em modo edição
- Swipe para a esquerda → revela botão vermelho de deletar
- Ao confirmar deleção: card some imediatamente (optimistic) + toast na parte inferior da tela com "Observação apagada" + botão **"Desfazer"** (fica visível ~4 segundos)
- Pull-to-refresh → sincroniza com a API

**FAB (Floating Action Button):**
- Posicionado no canto inferior direito
- Ícone de "+" — abre ObservationFormScreen em modo criação

**Estados especiais da lista:**

| Estado | O que mostrar |
|---|---|
| Carregando (1ª vez) | 4–5 cards fantasma com animação de pulse/shimmer (skeleton) |
| Lista vazia (sem observações) | Ilustração + "Nenhuma observação ainda" + "Toque no + para criar a primeira" |
| Lista vazia (filtro ativo) | Ilustração + "Nenhuma observação com esses filtros" + botão "Limpar filtros" |
| Erro de carregamento | Ícone de erro + "Não foi possível carregar" + botão "Tentar novamente" |
| Carregando mais (paginação) | Spinner sutil no rodapé da lista |

---

### Tela 2 — Formulário de Observação (criar / editar)

Abre como tela empilhada sobre a principal (slide da direita).

**Cabeçalho:**
- "← Voltar" à esquerda
- Título centralizado: "Nova observação" ou "Editar observação"
- Ícone de estrela à direita: preenchida (favoritada) ou contorno (não favoritada)

**Campos:**

| Campo | Tipo | Detalhe |
|---|---|---|
| Aluno | Input texto | Placeholder: "Nome do aluno" |
| Turma | Seletor de chips | Ver detalhe abaixo |
| Observação | Textarea multiline | Placeholder: "Descreva o que aconteceu em sala, com contexto e próximos passos." |

**Campo Turma — chips clicáveis:**
- Exibe as turmas cadastradas pelo professor como chips/pills em linha (scroll horizontal se necessário)
- Chip selecionado: destaque com cor primária
- Chip especial ao final: **"+ Nova turma"** com estilo diferenciado (outline tracejado, ícone de +)
- Tocar em "+ Nova turma" → abre NewClassBottomSheet

**NewClassBottomSheet:**
- Título: "Nova turma"
- Campo: Nome da turma (texto livre — ex: "2º Ano A")
- Campo: Turno — chips de seleção única: **Manhã · Tarde · Noite · Outro**
- Botões: "Cancelar" (outline) + "Criar turma" (primário)
- Ao criar: bottom sheet fecha e a nova turma já aparece selecionada nos chips do formulário

**Rodapé do formulário:**

- **Modo criação:** botão primário em largura total — "Salvar observação"
- **Modo edição:** dois botões lado a lado
  - Botão de lixeira (danger/vermelho) — abre ConfirmDeleteBottomSheet
  - Botão primário — "Atualizar observação"

**ConfirmDeleteBottomSheet:**
- Título: "Apagar observação?"
- Texto: "Essa ação não pode ser desfeita. A observação será removida permanentemente."
- Botões: "Cancelar" (outline) + "Apagar" (danger)

---

### Tela 3 — Filtros (bottom sheet)

Abre a partir do botão de filtro na tela principal.

**Cabeçalho do sheet:** título "Filtros" + botão "Limpar filtros" (danger/vermelho com ícone X) no lado direito

**Seção 1 — Turno:**
Chips de seleção única: **Todos · Manhã · Tarde · Noite · Outro**
- Quando um turno é selecionado, a seção de turmas abaixo filtra automaticamente

**Seção 2 — Turma:**
Chips das turmas cadastradas — se turno selecionado, mostra só as do turno; senão, mostra todas.
Inclui chip "Todas" como primeira opção para deselecionar.

**Seção 3 — Tipo:**
Chip toggle: ★ "Somente favoritas"

**Seção 4 — Ordenação:**
Lista de opções com radio visual:
- Mais recentes primeiro *(padrão)*
- Mais antigas primeiro
- Favoritas primeiro

---

### Tela 4 — Ajustes

Abre como modal ou tela empilhada ao tocar no ícone de engrenagem no cabeçalho.

Seções com cards agrupados (estilo lista nativa iOS/Android).

**Seção — Aparência:**
- Segmented control: **Claro · Escuro · Sistema**

**Seção — Minhas Turmas:**
- Lista de turmas cadastradas pelo professor
- Cada item: nome da turma em destaque + turno como descrição (ex: "2º Ano A" / "Manhã")
- Ação de deletar: swipe para esquerda ou ícone de lixeira
- Se a turma tiver observações vinculadas: dialog de aviso — "Essa turma tem X observações. Apague-as antes de remover a turma."
- Empty state da seção (sem turmas): texto sutil — "Nenhuma turma cadastrada ainda. Crie sua primeira turma ao registrar uma observação."

**Seção — Dados:**
- Item informativo: "Última sincronização" + data e hora formatada
- Botão danger: "Limpar cache local" → dialog de confirmação — "Os dados locais serão removidos. Você precisará de conexão para recarregá-los." + "Cancelar" + "Limpar"

**Seção — Ajuda:**
- Item clicável: "Como usar o ClassNotes" → abre a OnboardingScreen

**Seção — Sobre:**
- Item: "ClassNotes" + número da versão (ex: "v1.0.0")
- Item: Ambiente (Desenvolvimento / Produção)

---

### Tela 5 — Onboarding / Tutorial

Tela de tutorial em tela cheia. Aparece **automaticamente na primeira abertura do app** e pode ser acessada novamente em Ajustes → "Como usar o ClassNotes".

**Estrutura:** sequência de passos (paginada — swipe horizontal ou botão "Próximo"), com indicador de progresso (dots ou barra) no topo ou base.

**Passo 1 — Boas-vindas**
- Ícone/ilustração central grande (logo do app ou ilustração de caderno/anotação)
- Título: "Bem-vindo ao ClassNotes"
- Texto: "Seu espaço para registrar observações sobre seus alunos — rápido, organizado e sempre disponível."

**Passo 2 — Registrar uma observação**
- Ilustração: tela do formulário ou ícone de lápis + cartão
- Título: "Registre o que importa"
- Texto: "Toque no botão **+** para criar uma observação. Informe o nome do aluno, a turma e descreva o que aconteceu."

**Passo 3 — Criar turmas**
- Ilustração: chips de turma com o chip "+ Nova turma" em destaque
- Título: "Organize por turma e turno"
- Texto: "Na hora de criar uma observação, você pode criar uma nova turma com nome e turno (manhã, tarde, noite). Assim você nunca confunde o 2º Ano A da manhã com o da tarde."

**Passo 4 — Filtrar e encontrar**
- Ilustração: ícone de filtro ou bottom sheet aberto
- Título: "Encontre o que precisa"
- Texto: "Use o filtro para buscar observações por turno, turma ou favoritas. Você também pode ordenar por data ou destacar as favoritas primeiro."

**Passo 5 — Funciona offline**
- Ilustração: ícone de nuvem offline + seta de sincronização
- Título: "Funciona sem internet"
- Texto: "Sem conexão? Sem problema. Suas anotações são salvas localmente e sincronizadas automaticamente quando a conexão voltar."

**Rodapé de cada passo:**
- Botão "Próximo" (primário) em todos os passos
- No último passo: botão "Começar" (primário) que fecha o onboarding e vai para a tela principal
- Link discreto "Pular" nos primeiros passos (exceto no último)

---

### Padrões de UX e microinterações

- **Toasts** na parte inferior: sucesso (verde), erro (vermelho), neutro/informativo. Duração ~3–4s. Podem ter botão de ação (ex: "Desfazer").
- **Botões com loading:** spinner substitui o label ao processar — não desabilita sem feedback visual.
- **Skeleton loading:** animação de pulse/shimmer nos cards, nunca spinner global sobreposto à lista.
- **Optimistic updates:** criar, favoritar e deletar têm efeito imediato — o usuário não espera a API.
- **Ícone de sync:** reflete o estado de conexão em tempo real. Ao tocar, exibe tooltip posicionado abaixo do ícone.
- **Dark mode:** total — todos os elementos adaptam cor de fundo, texto, bordas e ícones.
- **Animação de transição:** tela de formulário entra com slide da direita. Bottom sheets entram com slide de baixo.

---

### Identidade visual — diretrizes livres

- Tom: **profissional e limpo**, contexto educacional — funcional, não infantil, mas acessível
- Hierarquia tipográfica clara: nome do aluno em destaque visual, turma e tempo em texto secundário sutil
- Cards com sombra leve ou borda discreta para separar da cor de fundo
- Paleta que funcione bem tanto em **light mode quanto dark mode**
- FAB com sombra evidente — elemento de ação principal da tela
- Stack técnica: React Native + React Native Paper + Styled Components (componentes totalmente customizáveis)

---

## PARTE 2 — Ícone do app

Criar o ícone do **ClassNotes** em **duas versões de cor** para suportar troca de ícone nativa (funcionalidade alternateAppIcon do iOS e equivalente no Android).

### Conceito

O ícone deve traduzir visualmente a ideia de **anotações escolares** — um professor que registra e acompanha seus alunos. Deve ser reconhecível em 60px (tela inicial) e legível em 1024px (App Store/Play Store).

Sugestões de símbolo: caderno com lápis, folha com marca de estrela, balão de fala com linhas de texto. O designer tem liberdade para propor outro símbolo desde que traduza o conceito.

### Especificações técnicas

- Formato: **PNG sem bordas arredondadas** (o sistema operacional aplica o mask automaticamente)
- Tamanho de entrega: **1024 × 1024 px**
- Fundo sólido, sem transparência

### Versão 1 — Padrão

Identidade principal do app. Será o ícone padrão ao instalar.

### Versão 2 — Alternativa

Mesmo símbolo/forma da versão 1, esquema de cor diferente. Exemplos de variação:
- Versão clara se a principal for escura (ou vice-versa)
- Versão em cor de destaque (ex: âmbar, índigo, verde) se a principal for neutra
- Versão monocromática se a principal for colorida

Ambas devem ser **identificáveis como o mesmo app** — o símbolo é o mesmo, só a paleta muda.

---

## PARTE 3 — Splash Screen

### Conceito

A splash screen é exibida por ~1–2 segundos enquanto o app inicializa. Deve ser simples, direta e visualmente consistente com o ícone e a identidade do app.

### Elementos obrigatórios

- Símbolo/logo do ClassNotes (o mesmo do ícone do app)
- Nome "**ClassNotes**" em tipografia limpa
- Fundo em cor sólida (preferencialmente a mesma cor de fundo da tela principal para evitar flash)

### Especificações técnicas

- Formato: **PNG**
- Tamanho: **2732 × 2732 px** (cobre todos os tamanhos de tela iOS e Android)
- O conjunto logo + nome deve estar contido em uma área central de ~**500 × 500 px** para não ser cortado em nenhum dispositivo
- Fundo sólido — sem gradiente complexo próximo às bordas

### Variantes obrigatórias

| Variante | Uso |
|---|---|
| Splash clara | Modo claro do sistema (fundo claro, elementos escuros) |
| Splash escura | Modo escuro do sistema (fundo escuro, elementos claros) |

---

## Resumo do que entregar

| Artefato | Variantes | Formato | Tamanho |
|---|---|---|---|
| Telas do app (5 telas + bottom sheets) | — | Figma / imagem | — |
| Ícone | Versão 1 + Versão 2 | PNG | 1024 × 1024 |
| Splash screen | Clara + Escura | PNG | 2732 × 2732 |
