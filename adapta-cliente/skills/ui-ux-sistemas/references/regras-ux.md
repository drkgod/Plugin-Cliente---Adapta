# Regras de UX para sistemas internos

Prioridade: **crítica** reprova a task; **alta** só fica de fora com motivo registrado na análise;
**média** é o padrão esperado. Regras filtradas para sistemas web internos no stack do Skip.

## Crítica — acessibilidade e segurança de uso

| Regra | Faça | Não faça |
|---|---|---|
| Rótulo de campo | `FormLabel` visível em todo campo | placeholder como único rótulo |
| Botão de ícone | `aria-label` que descreve a ação | ícone sem nome acessível |
| Foco | anel de foco visível (o do shadcn já vem pronto) | `outline-none` sem substituto |
| Teclado | Tab na ordem visual; Enter envia; Esc fecha | armadilha de foco; ação só com mouse |
| Contraste | 4,5:1 em texto normal; 3:1 em texto grande e ícones | cinza claro sobre cinza |
| Cor não basta | status com texto ou ícone além da cor | verde e vermelho como única pista |
| Erro anunciado | `FormMessage` (já liga `aria-describedby`); `Alert` em erro geral | erro só na borda vermelha |
| Destrutivo | `AlertDialog` dizendo o que será perdido | excluir com um clique |
| Envio | desabilitar o botão e mostrar carregamento | permitir clique duplo |
| Movimento | respeitar `prefers-reduced-motion` (prefixo `motion-safe:`) | animação obrigatória |

## Alta — feedback, estados e celular

| Regra | Faça | Não faça |
|---|---|---|
| Carregando | `Skeleton` no formato do conteúdo; indicador em ação acima de 300 ms | tela congelada |
| Vazio | mensagem útil e ação ("Cadastrar primeiro cliente") | área em branco ou "0 resultados" |
| Erro com saída | dizer o que houve, o que fazer e oferecer "Tentar de novo" | "Erro desconhecido" |
| Sucesso | `toast.success` curto (3 a 5 s) | sucesso silencioso |
| Layout estável | reservar o espaço do conteúdo que carrega depois | conteúdo empurrando a tela |
| Responsivo | celular primeiro; conferir em 375, 768, 1024 e 1440 px | só no tamanho do seu monitor |
| Rolagem | nenhuma rolagem horizontal da página | tabela larga estourando a tela |
| Toque | alvos de 44 × 44 px e 8 px entre eles no celular | ícones minúsculos colados |
| Texto no celular | base de 16 px; `inputMode` certo para o teclado | texto de 12 px |
| Altura de tela | `min-h-dvh` | `h-screen` em layout de celular |
| Hover | nada importante depende só do mouse em cima | menu que só aparece no hover |
| Navegação | item ativo destacado; voltar funciona; estado na URL | rotas que perdem o filtro |
| Camadas | componentes de sobreposição do shadcn já resolvem o z-index | `z-[9999]` |

## Média — formulários, conteúdo e ritmo

| Regra | Faça | Não faça |
|---|---|---|
| Validação | ao sair do campo e no envio (`mode: 'onTouched'`) | só no envio; a cada tecla |
| Posição do erro | abaixo do campo | lista única no topo |
| Obrigatório | "*" com legenda, ou "(opcional)" nos opcionais | sem indicação |
| Tipo de campo | `email`, `tel`, `url`, `inputMode="decimal"` | texto para tudo |
| Autopreenchimento | `autoComplete` correto (`email`, `name`, `current-password`) | bloquear autopreenchimento |
| Senha | alternar mostrar e ocultar | digitar às cegas |
| Texto longo | truncar com reticências e mostrar inteiro no detalhe ou em `Tooltip` | quebrar o layout |
| Números | separador de milhar, unidade, alinhados à direita | `1234567.8` cru |
| Datas | `dd/MM/yyyy` ou relativo ("há 2 dias") | formatos ambíguos |
| Tipografia | escala do projeto; títulos claramente maiores; linha de 1,5 | tamanhos aleatórios |
| Largura de leitura | 65 a 75 caracteres em texto corrido | parágrafo de tela inteira |
| Animação | 150 a 300 ms, só `transform` e `opacity`, 1 ou 2 elementos por tela | animar tudo; mais de 500 ms |
| Ações em massa | seleção múltipla quando a SPEC pedir operação em lote | repetir a ação linha a linha |
| Busca | resultado após 300 ms; "nenhum resultado" com dica | exigir Enter sem retorno |
| Dados de exemplo | exemplos realistas do domínio do cliente | "lorem ipsum" |

## Componente certo para cada caso

| Necessidade | Use | Não use |
|---|---|---|
| Confirmar exclusão ou ação irreversível | `AlertDialog` | `Dialog` comum ou `confirm()` |
| Formulário curto ou detalhe rápido | `Dialog` com `DialogTitle` e `DialogDescription` | div posicionada |
| Filtros, menu no celular, painel lateral | `Sheet` com `side` explícito | `Dialog` |
| Lista de ações de um item | `DropdownMenu` | `Popover` com botões |
| Conteúdo flutuante contextual | `Popover` | div absoluta |
| Dica de botão de ícone | `Tooltip` (o `TooltipProvider` já está no `App.tsx`) | atributo `title` |
| Escolher em lista fechada | `Select` completo (`SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`) | `<select>` nativo |
| Busca com sugestões | `Command` | input com lista improvisada |
| Dados tabulares | `Table` com `TableHeader` e `TableBody` | grade de divs |
| Seções alternáveis | `Tabs` com `defaultValue` | abas improvisadas |
| Aviso dentro da página | `Alert` (`variant="destructive"` para erro) | texto vermelho solto |
| Resultado de uma ação | `toast.success` e `toast.error` do `sonner` | `alert()` |
| Conteúdo carregando | `Skeleton` com as dimensões finais | spinner de página inteira |
| Gráfico | `ChartContainer` com `ChartTooltip` | Recharts direto com cores fixas |
| Status | `Badge` com texto | só uma bolinha colorida |

## Autocrítica antes de entregar

Releia a tela como quem vai usá-la amanhã cedo:

- Em cinco segundos dá para saber onde estou, o que posso fazer e qual é a ação principal?
- Cada palavra ajuda a agir? Corte enfeite, repetição e texto que explica o óbvio.
- Existe um único elemento chamando atenção, ou tudo grita ao mesmo tempo? Tire um.
- A tela continua compreensível com dados reais longos, lista vazia e erro de rede?
