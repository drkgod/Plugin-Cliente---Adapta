---
name: ui-ux-sistemas
description: Skill de apoio para projetar e conferir telas de sistemas internos sem enxergar a tela. Produz a Ficha de Tela na análise (usuário, tarefa, dados, ações, padrão, estados, celular, acessibilidade e textos), escolhe o padrão certo (lista, formulário, detalhe, dashboard, kanban, importação, configurações), aplica regras de UX e de texto em PT-BR e fecha com checklist de UI e roteiro de teste visual. Use dentro de proxima-task, executar-task, debug-task e concluir-task, com CLIENTE_ENVELOPE v1, sempre que a task criar ou alterar tela, formulário, tabela, gráfico, menu ou texto visível.
---

<!-- Origem: reempacotado de ui-ux-pro-max (github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT —
bases ux-guidelines, app-interface, charts e stacks/shadcn) e de frontend-design (Anthropic,
Apache-2.0 — escrita de interface e autocrítica), filtrado para sistemas internos no stack do Skip
e adaptado ao método Adapta Native (decisão D6). Sem scripts, buscas ou dependências externas. -->

# UI/UX de Sistemas

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1`. Esta skill não é rota: roda dentro da skill autorizada no envelope
(`proxima-task`, `executar-task`, `debug-task` ou `concluir-task`) e herda os limites dela. Sem
envelope, carregue `../skill-mind-cliente/SKILL.md`, redirecione e não altere arquivos.

Pedido de mudança visual fora da task ativa não vira trabalho: registre a ideia em `06_notas/` e
explique ao cliente que ela fica guardada para as próximas fases.

## Princípio

Você não vê a tela que constrói. A qualidade vem de três hábitos:

1. **Decidir antes:** a Ficha de Tela fixa usuário, tarefa, dados, estados e textos antes do código.
2. **Usar o que já funciona:** padrão do catálogo, componentes do projeto, `src/components/ui/` e
   tokens do tema. Consistência com as telas existentes vale mais que novidade.
3. **Conferir por lista:** checklist de UI na revisão e roteiro de teste humano com os estados.

Sistema interno bom é claro, rápido e previsível. Não invente estilo novo a cada tela.

## 1. Ficha de Tela (na análise da task)

Para cada tela nova ou alterada, inclua no relatório `.adapta-cliente/analises/<task-id>.md`:

```markdown
### Ficha de Tela — <nome> (`<rota>`)
- Quem usa e onde: <papel; computador, celular ou ambos>
- Tarefa principal: <uma frase com verbo>
- Ação primária: <um único botão principal por tela ou área>
- Padrão: <nome do padrão em references/padroes-de-tela.md>
- Dados: <campo → coleção.campo → formato (moeda, data, status…)>
- Ações e permissões: <ação → quem pode → regra de acesso que garante isso no servidor>
- Estados: carregando · vazio de primeiro uso · vazio de filtro · erro com saída · sucesso · sem permissão
- Validações: <campo → regra → mensagem>
- Celular (< 768 px): <tabela vira cards, filtros em Sheet, ações em menu…>
- Acessibilidade: <rótulos, foco, teclado, alvos de toque, não depender só de cor>
- Textos: <título, botões, vazio e erros — ver references/textos-pt-br.md>
- Reuso: <componentes existentes que serão usados>
```

Informação que a SPEC não define (por exemplo, quem pode excluir) é decisão do cliente: pergunte
com as opções e a consequência de cada uma, registre `DECISÃO DO CLIENTE:` e nunca escolha por
ele. Se a resposta mudar o escopo ou o critério de aceite, é `DÚVIDA:` para o consultor.

Ao cliente, descreva a ficha em palavras simples: o que ele vai ver, o que vai poder fazer e como
a tela se comporta no celular. O formato completo fica no arquivo da análise. A ficha é aprovada
junto com o plano; mudar a ficha depois da autorização exige nova autorização.

## 2. Decidir pelo catálogo

- Escolha o padrão em `references/padroes-de-tela.md` e siga a estrutura dele.
- Antes de criar componente, procure no mapa do sistema (`.adapta-cliente/mapas/<sistema>.md`) um
  que já resolva. Reutilize; não duplique com outro nome.
- Copie o ritmo das telas existentes: cabeçalho, espaçamentos, tamanho de botões, tabelas.
- Cor só por token do tema: `bg-background`, `text-foreground`, `text-muted-foreground`,
  `bg-primary`, `border-border`, `bg-destructive`. Gráficos usam `--chart-1` a `--chart-5`.
  Nunca hex solto nem cor fixa como `bg-blue-500` em tela de sistema.
- Quando a SPEC pedir identidade visual nova, mude os tokens em `src/main.css` (`:root` e `.dark`),
  nunca componente por componente, e confira o contraste nos dois temas.

## 3. Linha vermelha de UI

Estas regras não se simplificam; violação reprova a task (linha vermelha da persona):

- todo campo tem rótulo visível; placeholder não é rótulo;
- botão só com ícone tem `aria-label`; imagem informativa tem `alt`;
- foco visível e teclado completo: Tab na ordem visual, Enter envia, Esc fecha diálogo;
- contraste mínimo de 4,5:1 no texto; status nunca indicado só por cor (texto ou ícone junto);
- ação destrutiva pede confirmação dizendo o que será perdido;
- envio desabilita o botão e mostra carregamento; erro aparece perto do campo e diz como resolver;
- falha nunca é silenciosa: o usuário sempre vê que algo deu errado e o que fazer;
- no celular, nada de rolagem horizontal da página, texto base de 16 px e alvos de toque de 44 px.

Detalhes e o restante das regras: `references/regras-ux.md`.

## 4. Checklist de UI (revisão antes de entregar)

- [ ] Cada item da Ficha de Tela está implementado.
- [ ] Carregando, vazio, erro e sucesso existem e são alcançáveis na tela real.
- [ ] Formulário: rótulos, obrigatórios marcados, validação ao sair do campo e no envio, mensagem
      abaixo do campo, botão com carregamento e dados preservados quando o envio falha.
- [ ] Lista ou tabela: colunas priorizadas, texto longo truncado com acesso ao completo, paginação
      ou limite declarado e versão em cards no celular.
- [ ] Ações destrutivas com `AlertDialog` e texto do que será apagado.
- [ ] Só tokens do tema; claro e escuro legíveis quando o projeto tem os dois.
- [ ] Foco visível, Tab na ordem, Esc fecha, `aria-label` em botão de ícone e `alt` em imagem.
- [ ] Textos e formatos de `references/textos-pt-br.md` (moeda, data, número, plural).
- [ ] Rota nova registrada em `src/App.tsx` e item no menu, com destaque do item ativo.

Item que não se aplica fica marcado `n/a` com o motivo; item sem prova não passa.

## 5. Roteiro de teste humano para telas

No portão de teste humano, o roteiro usa a URL de produção registrada em
`07-sistemas/<sistema>/plataforma.md`, tem no máximo oito passos simples e diz o que deve aparecer
em cada um:

1. abrir `<url-de-produção><rota>` e entrar com um usuário do papel certo;
2. fazer a tarefa principal com um dado real;
3. provocar um erro (campo obrigatório vazio ou valor inválido) e ler a mensagem;
4. ver a tela vazia (filtro sem resultado ou registro novo);
5. abrir no celular e repetir a tarefa principal;
6. quando houver exclusão, conferir que a tela pergunta antes de apagar.

## Referências (carregue só a necessária)

- `references/padroes-de-tela.md` — estrutura de cada tipo de tela e escolha de gráfico.
- `references/regras-ux.md` — regras completas por prioridade e o componente certo para cada caso.
- `references/textos-pt-br.md` — microtexto, mensagens prontas e formatação brasileira.
