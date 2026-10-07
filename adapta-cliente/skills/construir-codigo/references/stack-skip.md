# Stack do Skip — regras para o código

Resumo operacional do template Skip (React, Vite, TypeScript, Tailwind, shadcn/ui e PocketBase) e
dos guias oficiais do Skip Cloud. Antes de migration ou hook, e sempre que houver dúvida, consulte
o guia pela ferramenta — `skip_cloud_sdk_guide`, `skip_cloud_migrations_guide` ou
`skip_cloud_hooks_guide`, com `regexSearch` para ler só a seção. O guia vence este resumo.

## O que o template já tem (não adicione dependência)

| Necessidade | Já disponível |
|---|---|
| Componentes | `src/components/ui/*` (shadcn/Radix): button, input, form, dialog, alert-dialog, sheet, table, select, tabs, dropdown-menu, popover, tooltip, badge, card, skeleton, chart, calendar, command, sidebar |
| Formulários | `react-hook-form`, `zod` e `zodResolver` de `@hookform/resolvers/zod` |
| Ícones | `lucide-react` |
| Avisos | `sonner` (`import { toast } from 'sonner'`) |
| Datas | `date-fns` e `ptBR` de `date-fns/locale` |
| Gráficos | `recharts` através de `src/components/ui/chart.tsx` |
| Rotas | `react-router-dom` em `src/App.tsx`, páginas com `lazy` e `Suspense` |
| Tema | `next-themes` e tokens em `src/main.css` |
| Classes | `cn()` de `@/lib/utils`; variantes com `class-variance-authority` |
| Backend | `pocketbase` através de `@/lib/pocketbase/client` |
| Celular | `useIsMobile()` de `@/hooks/use-mobile` (quebra em 768 px) |

Antes de importar algo fora desta lista, confira o `package.json` (só leitura).

## Pastas e responsabilidades

| Pasta | Contém | Regra |
|---|---|---|
| `src/pages/` | uma página por rota | monta componentes e chama serviços ou hooks |
| `src/components/<área>/` | componentes do domínio | nunca chama o `pb` direto |
| `src/components/ui/` | primitivos shadcn gerados | não editar; compor por fora |
| `src/services/<entidade>.ts` | todo acesso a dados | único lugar que importa o `pb` |
| `src/hooks/` | lógica reutilizável (`use-*`) | regras dos hooks do React |
| `src/lib/` | utilitários puros (formatos, cálculos) | sem React e sem `pb` |
| `pocketbase/migrations/` | `NNNN_descricao.js` | ordinal novo; migration aplicada é imutável |
| `pocketbase/hooks/` | um hook ou rota por arquivo | nome começa com letra, sem número na frente |

Nunca edite os arquivos gerados: `src/lib/pocketbase/client.ts`, `src/lib/pocketbase/errors.ts`,
`src/hooks/use-realtime.ts`, `src/components/ui/*`, `.skip.config.json`, `package.json`, lockfiles,
`vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json` e `.oxfmtrc.json`.

## Dados no frontend (SDK do PocketBase)

- `import pb from '@/lib/pocketbase/client'` só dentro de `src/services/`.
- Antes de usar coleção ou campo, confira em `src/lib/pocketbase/schema.json` ou com
  `skip_cloud_get_collection_details`. Campo inexistente em `filter`, `sort` ou `expand` dá 400.
- Entrada do usuário em filtro sempre com `pb.filter('status = {:s}', { s: valor })`; nunca
  concatenar texto.
- `expand` só em campo de relação; ordenar por `created` ou `updated` exige os campos autodate.
- Lista que cresce usa `getList(pagina, porPagina, opcoes)`; `getFullList` só para conjunto
  pequeno e limitado.
- Não passe `{ requestKey: null }`: o cancelamento automático já está desligado.
- Tempo real só com `useRealtime('colecao', callback)`; nunca `subscribe` direto e nunca
  `unsubscribe('*')`. Lista com filtro ou ordenação recarrega dentro do callback.
- Rota própria do backend com `pb.send('/backend/v1/...', { method })`; nunca `fetch` relativo à
  página e nunca `/api/` para rota própria.
- Erros chegam como `ClientResponseError` (`status`, `response.data` por campo). Devolva o erro ao
  campo do formulário e traduza para PT-BR antes de mostrar.
- Leitura com status 0, 429 ou 503: no máximo três novas tentativas com espera crescente; depois,
  estado "sistema ocupado". Escrita com status 0 **nunca** é repetida sozinha: o servidor pode já
  ter salvo. Mantenha o formulário preenchido e avise.
- Sem laços de requisição: nada de chamada no corpo do render, `useEffect` com dependência errada
  ou `setInterval` abaixo de 30 s.
- Arquivo: `FormData` no `create` ou `update`; URL com `pb.files.getURL(registro, registro.campo)`.

## Autenticação

- Guarda de rota por `isAuthenticated` (baseado em `pb.authStore.isValid`), nunca por `!!user`.
- Use o `AuthProvider`, o `useAuth` e o componente de rota protegida que o projeto já tem.
- Esconder botão não é permissão: quem protege é a regra de acesso da coleção.

## Banco: migrations (leia o guia antes)

- Arquivo `pocketbase/migrations/NNNN_descricao.js` com o próximo ordinal livre; confira com
  `skip_cloud_list_migrations`. Status `applied` é imutável: mudança vira migration nova. Status
  `failed`: corrija o mesmo arquivo.
- Runtime goja: o arquivo é só `migrate((app) => {...}, (app) => {...})`, sem `import`, `export` ou
  `await`.
- Coleção nova: todos os campos e as cinco regras (`listRule`, `viewRule`, `createRule`,
  `updateRule`, `deleteRule`) no mesmo `new Collection({...})`, com `created` e `updated` autodate.
- Coleção existente: `app.findCollectionByNameOrId(...)` e `col.fields.add(new TextField({...}))`
  dentro de `if (!col.fields.getByName('campo'))`; nunca `new Collection` com nome existente.
- Nunca mude o tipo de um campo nem o `collectionId` de uma relação: crie campo novo e migre os
  dados.
- Regras de acesso usam `=`, `!=` e `~`; autenticado é `@request.auth.id != ''`; campos do usuário
  levam `@request.auth.`; corpo da requisição é `@request.body.*`. Regra `null` libera só o
  superusuário.
- Toda migration tem `down` que desfaz. Preview e produção usam o mesmo banco: sem autorização
  específica, só mudanças aditivas.
- Depois de aplicar, confirme os campos com `skip_cloud_get_collection_details`.

## Backend: hooks e rotas (leia o guia antes)

- Um hook ou uma rota por arquivo; nome começando com letra.
- `$app` (não `app`) para o banco; `e.next()` exatamente uma vez em todo caminho que segue;
  rejeição com `throw`, nunca `return` vazio.
- Rotas em `/backend/v1/...` com `routerAdd`; nada de `routerUse` global.
- Nunca bloqueie o superusuário da plataforma: em hook de autenticação ou de regra, deixe
  `e.hasSuperuserAuth()` passar antes de qualquer checagem.
- Validação de entrada no servidor; falha de validação responde 400, não 500.
- Segredos com `$secrets.get('CHAVE')`, nunca no código; logs com `$app.logger()`, sem dado pessoal.
- Webhook externo usa a URL do backend (`skip_cloud_get_backend_url`) mais `/backend/v1/...`, nunca
  o domínio `*.goskip.app`.
- Erro de hook em produção: consulte `skip_cloud_list_logs` antes de levantar hipótese.

## React e TypeScript

- Props e dados tipados com `interface`; nenhum `any`; tipos do registro no serviço da entidade.
- Hooks só no topo do componente; `useEffect` com todas as dependências e limpeza de assinatura.
- Não guarde em estado o que dá para calcular no render; não use `useEffect` para derivar dados.
- `key` estável (o `id` do registro), nunca o índice em lista que muda.
- `onClick={handle}` ou `onClick={() => handle(item)}`, nunca `onClick={handle()}`.
- Busca com espera de 300 ms (hook de debounce do projeto, se existir, ou `setTimeout` com limpeza).
- `useMemo` só para filtro ou ordenação pesada; não envolva tudo em `memo`.
- Página nova com `lazy` e `Suspense`, igual às outras do `src/App.tsx`.
- Erro de chamada assíncrona tratado com `try/catch` no handler, com aviso ao usuário.
- `{lista.length && ...}` pode mostrar `0` na tela: use `lista.length > 0 ? ... : null`.
- Ordene uma cópia (`[...lista].sort(...)`), nunca o array do estado.

## shadcn/ui

- Variante e tamanho por props (`variant="destructive"`, `size="sm"`); ajuste pontual com
  `className` e `cn()`; variante recorrente nova vira componente próprio, sem editar `ui/`.
- `Dialog` sempre com `DialogTitle` e `DialogDescription`; estado controlado (`open` e
  `onOpenChange`).
- Formulário com `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` e
  `zodResolver`.
- `Select` completo; `Sheet` com `side`; `AlertDialog` com `AlertDialogCancel` e
  `AlertDialogAction`.
- `Toaster` e `TooltipProvider` já estão no `App.tsx`; não adicione outros nas páginas.
- Gráfico com `ChartContainer` e `config` usando `hsl(var(--chart-1))` a `hsl(var(--chart-5))`.
- Import nomeado do arquivo do componente: `import { Button } from '@/components/ui/button'`.
