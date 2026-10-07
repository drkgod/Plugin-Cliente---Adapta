# Padrões de tela para sistemas internos

Escolha um padrão por tela e siga a estrutura dele. Os componentes citados ficam em
`src/components/ui/`; confirme que existem no projeto antes de usar. Remova o que a SPEC não pede:
o aceite é teto, não só piso.

## Estrutura comum a toda página

```
┌ Cabeçalho ────────────────────────────────────────────────────┐
│ Título (h1) + descrição ou contador          [Ação primária]  │
├───────────────────────────────────────────────────────────────┤
│ Busca, filtros ou abas (quando houver)                        │
├───────────────────────────────────────────────────────────────┤
│ Conteúdo: lista, formulário, cards, gráficos                  │
└───────────────────────────────────────────────────────────────┘
```

- Um `h1` por página; seções com `h2` e `h3` em ordem, sem pular nível.
- Uma ação primária por área (`Button` padrão); as demais em `variant="outline"` ou `"ghost"`.
- A página vive dentro do `Layout` existente (menu e topo); não crie outro layout.
- Texto corrido com largura de leitura limitada (`max-w-prose`); tabelas podem ocupar a largura.

## 1. Lista / cadastro (CRUD)

Uso: ver, buscar e manter os registros de uma coleção.

- Cabeçalho com título, contador ("124 clientes") e ação primária "Novo <entidade>".
- Busca com espera de 300 ms após a digitação; até três filtros visíveis (`Select`); filtros
  extras em `Sheet` ou `Popover`. Mostre os filtros ativos e um "Limpar filtros".
- Computador: `Table` com 4 a 7 colunas priorizadas; a primeira identifica o registro; números
  alinhados à direita; status em `Badge` com texto.
- Ações por linha em `DropdownMenu`, aberto por botão de ícone com
  `aria-label="Ações de <registro>"`; excluir sempre passa por `AlertDialog`.
- Paginação (`getList`) a partir de cerca de 50 itens; ordenação indicada no cabeçalho da coluna.
- Celular: cada linha vira um `Card` com o identificador, dois ou três campos e as ações.
- Estados: `Skeleton` no formato das linhas; vazio de primeiro uso ("Nenhum cliente cadastrado" +
  botão de criar); vazio de filtro ("Nenhum resultado para…" + limpar filtros); erro com
  "Tentar de novo".

## 2. Formulário (criar e editar)

- Até cerca de 6 campos e sem seções: `Dialog`. Mais que isso, seções ou anexos: página própria.
- `Form` + `FormField` + `FormItem` + `FormLabel` + `FormControl` + `FormMessage`, com esquema `zod`.
- Uma coluna no celular; duas colunas só para campos curtos e relacionados no computador.
- Agrupe por assunto com título de seção; marque obrigatórios ("*" com legenda) ou opcionais.
- Tipo certo de campo: `type="email"`, `inputMode="numeric"` ou `"decimal"`, `Select` para lista
  fechada, `Calendar` em `Popover` para data, `Textarea` para texto longo, `Switch` para ligar e
  desligar.
- Rodapé: "Cancelar" (`outline`) e a ação primária "Salvar <entidade>".
- Envio: botão desabilitado com carregamento; erro do servidor por campo volta para o campo;
  sucesso fecha o diálogo, atualiza a lista e mostra `toast.success`.
- Fechar com alterações não salvas pergunta antes de descartar (`formState.isDirty`).
- Edição abre preenchida e envia somente os campos do formulário.

## 3. Detalhe do registro

- Cabeçalho com identificador, `Badge` de status e ações (editar; o resto em menu).
- Corpo em `Card`s por assunto ou `Tabs` quando há muitos blocos (dados, histórico, anexos).
- Histórico em linha do tempo: data, quem e o que mudou.
- Rota própria (`/clientes/:id`) para permitir link direto; voltar preserva os filtros da lista.
- Registro inexistente ou sem permissão: mensagem clara e link para a lista, nunca tela branca.

## 4. Dashboard / painel de indicadores

- Topo com 3 a 5 indicadores (`Card`): valor, rótulo, período e comparação com o período anterior
  (seta com texto, não só cor).
- Um filtro de período que vale para a página inteira.
- Gráficos com `ChartContainer` (`src/components/ui/chart.tsx`) e cores `--chart-1` a `--chart-5`;
  título que diz a conclusão, legenda, eixos com unidade e alternativa em texto ou tabela.
- Cada indicador leva à lista filtrada que o explica.
- Menos de 4 pontos de dado: mostre o número em card, não um gráfico.

Escolha do gráfico:

| Dado | Gráfico | Evite quando | Alternativa acessível |
|---|---|---|---|
| Evolução no tempo | Linha (ou área) | menos de 4 pontos; mais de 6 séries | tabela com data e valor |
| Comparar categorias | Barras (horizontais se o rótulo é longo) | mais de 15 categorias | valores visíveis nas barras |
| Parte do todo | Rosca ou barra 100% | mais de 5 fatias; diferenças < 5% | tabela com percentuais |
| Meta x realizado | Barra de progresso | não existe meta | valor e % da meta em texto |
| Funil de etapas | Barras na ordem das etapas | etapas não sequenciais | lista com contagem e queda em % |
| Ranking | Barras ordenadas | mais de 20 itens | tabela paginada |
| Distribuição ou correlação | Dispersão | menos de 20 pontos | tabela com resumo |

## 5. Kanban / pipeline

- Colunas = etapas do fluxo definido na SPEC, com contagem no título; card com identificador,
  responsável, prazo e sinal de atenção (texto com ícone).
- Arrastar é atalho, nunca o único caminho: cada card tem o menu "Mover para…", que funciona no
  teclado e no celular.
- A mudança de etapa é salva no servidor; se falhar, desfaça a mudança visual e mostre o erro.
- No celular, uma coluna por vez com `Tabs` ou rolagem horizontal só dentro do quadro.
- Filtros (responsável, período) acima do quadro.

## 6. Importação de planilha

Fluxo em etapas com indicador de progresso:

1. **Arquivo:** aceitar CSV ou XLSX, oferecer o modelo para baixar e informar limites.
2. **Mapeamento:** coluna da planilha → campo, com sugestão automática pelo nome.
3. **Pré-visualização:** primeiras linhas em tabela, erros por linha e campo, contagem de linhas
   válidas e inválidas.
4. **Confirmação:** "Importar 120 registros (8 linhas com erro serão ignoradas)".
5. **Resultado:** importados, ignorados com motivo e relatório de erros para baixar.

Nunca grave antes da confirmação nem importe parcialmente sem dizer. A validação definitiva é no
servidor (hook), não só no navegador; arquivos grandes são processados no servidor.

## 7. Relatórios e exportação

- Filtros no topo (período, responsável, status) e botão "Gerar relatório".
- Resultado em tabela com totais; exportação CSV com os mesmos filtros e a data no nome do arquivo.
- Processamento demorado mostra andamento e não trava a tela.

## 8. Configurações e administração

- Seções em `Card` ou `Tabs`, cada uma com "Salvar" explícito e confirmação de sucesso.
- Usuários e permissões: lista mais formulário; cada papel explicado em uma linha.
- Ações perigosas (apagar dados, reiniciar o sistema) ficam em uma área "Zona de risco" separada,
  com `AlertDialog` que pede para digitar o nome do que será apagado.
- O que a tela esconde por permissão também é bloqueado na regra de acesso da coleção.

## 9. Login e conta

- E-mail e senha com rótulos, alternar mostrar senha e "Esqueci minha senha".
- Erro genérico ("E-mail ou senha incorretos"), sem dizer qual dos dois falhou.
- Botão com carregamento; Enter envia; foco inicial no e-mail.
- Rotas protegidas pelo componente de rota protegida que o projeto já tem; sessão expirada volta
  ao login com aviso.

## 10. Notificações

- Sino no topo com contador (no máximo "9+") e `aria-label="Notificações (3 novas)"`.
- Lista em `Popover` ou página: título, tempo relativo, link para o registro e marcar como lida.
- Atualização em tempo real pelo `useRealtime`; nada de consultas repetidas em intervalo curto.

## 11. Navegação

- Menu do `Layout` existente com o item ativo destacado (cor e indicador, não só cor).
- Até cerca de 7 itens no primeiro nível; o resto agrupado sob títulos de grupo.
- Breadcrumb só a partir de três níveis de profundidade.
- Estado relevante (filtro, aba, registro aberto) refletido na URL, para o voltar do navegador e o
  link direto funcionarem.
- Celular: menu em `Sheet`, aberto pelo botão de menu do topo.
