---
name: construir-codigo
description: Skill de apoio que substitui o ambiente de programação que falta ao agente no Ethos. Mapeia o sistema antes de escrever, planeja em código (arquivos, tipos, serviços, estados, regras de acesso e teste de mesa), edita de forma cirúrgica, usa o QA do Skip como compilador, revisa o diff com checklist e entrega pelo publicar-e-sincronizar. Use dentro de proxima-task (mapa e plano), executar-task e debug-task, com CLIENTE_ENVELOPE v1, sempre que a task alterar código, banco, automação ou tela.
---

<!-- Origem: reempacotado de ui-ux-pro-max (github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT —
stacks/react, stacks/shadcn e react-performance) e dos guias oficiais do Skip Cloud
(skip_cloud_sdk_guide, skip_cloud_migrations_guide e skip_cloud_hooks_guide), adaptado ao método
Adapta Native (decisão D6). Sem scripts, buscas ou dependências externas. -->

# Construir Código

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1`. Esta skill não é rota: roda dentro da skill autorizada no envelope e
herda os limites dela. Em `proxima-task` use só MAPA e PLANO, sem alterar o produto; em
`executar-task` e `debug-task` use o protocolo inteiro. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não altere arquivos.

## Por que este protocolo existe

Você não tem busca no código, verificação de tipos local, navegador nem visão de diff. Cada etapa
abaixo substitui uma dessas ferramentas. Pular uma etapa é programar às cegas.

| Falta | Substituto |
|---|---|
| Busca no código | MAPA persistido e ordem fixa de leitura |
| Verificação de tipos e testes | QA do `skip_project_apply_changes` e teste de mesa |
| Ver a tela | `../ui-ux-sistemas/SKILL.md` e roteiro de teste humano |
| Diff e revisão | releitura completa dos arquivos alterados com checklist |
| Edição precisa | `skip_file_patch` com trecho lido na hora |

## 1. MAPA — antes de qualquer escrita

1. Leia `.adapta-cliente/mapas/<sistema>.md` se existir: ele é o seu índice do código.
2. Sem mapa, ou com mapa de versão do Skip anterior à registrada em
   `07-sistemas/<sistema>/plataforma.md`, rode `skip_file_list` e leia nesta ordem: `src/App.tsx`
   (rotas), `src/components/Layout.tsx` (menu), `src/lib/pocketbase/schema.json` (coleções e
   campos), os `src/services/*.ts` da área, a página e os componentes que a task toca e
   `src/main.css` (tokens do tema).
3. Grave ou atualize o mapa com o modelo abaixo. Ele vai para o GitHub no commit da próxima
   entrega.
4. Antes de usar componente, hook, função, coleção ou campo, confirme que existe lendo o arquivo
   ou o schema. Nunca importe pelo nome que "deveria" existir.

```markdown
# Mapa — <sistema> (versão Skip <versionHash>)
## Rotas
| Rota | Página | Componentes principais | Serviços |
## Coleções
| Coleção | Campos principais | Regras de acesso (list/view/create/update/delete) |
## Componentes reutilizáveis do projeto
## Padrões observados (nomes, pastas, formatação, mensagens)
## Arquivos gerados que não se editam
```

## 2. PLANO EM CÓDIGO — vai para a análise da task

A análise que pede autorização traz:

- arquivos a criar ou alterar, cada um com o motivo, na ordem: migration → hook → serviço →
  componentes → página → rota e menu;
- tipos TypeScript dos dados (registro e entrada de formulário);
- funções de serviço: nome, parâmetros, retorno e erros possíveis;
- árvore de componentes com props e estados (carregando, vazio, erro, sucesso);
- regras de acesso (`listRule`, `viewRule`, `createRule`, `updateRule`, `deleteRule`) de cada
  coleção nova ou alterada;
- teste de mesa de toda regra de negócio: tabela entrada → saída esperada com caso principal,
  limite e erro. O template do Skip não tem testes automatizados; o teste de mesa é a prova que
  você executa lendo o código, e no RED ele mostra a falha no código atual;
- riscos de dados: migration que remove ou renomeia campo, ou altera registro existente, é risco
  declarado, porque preview e produção usam o mesmo banco.

## 3. EDIÇÃO CIRÚRGICA

1. Leia o arquivo imediatamente antes de editar. Conteúdo lido em outra resposta está velho.
2. Arquivo existente: `skip_file_patch` com blocos SEARCH de 3 a 10 linhas copiadas do conteúdo
   atual e únicas no arquivo. Patch falhou: releia e refaça; nunca troque por reescrita inteira.
3. `skip_file_write` só para arquivo novo ou para arquivo pequeno que você acabou de ler inteiro,
   preservando tudo que não pertence à task.
4. Uma responsabilidade por arquivo; componente passou de 250 linhas, extraia partes.
5. Nunca edite: `.skip.config.json`, `src/lib/pocketbase/client.ts`,
   `src/lib/pocketbase/errors.ts`, `src/hooks/use-realtime.ts`, `src/components/ui/*`,
   `package.json`, lockfiles e configurações (`vite.config.ts`, `tsconfig*.json`,
   `.oxlintrc.json`). Componente de `ui/` não atende: componha um novo em `src/components/`.
6. Nenhuma dependência nova: use o que o template já tem (`references/stack-skip.md`).
7. Antes de migration ou hook, leia a seção certa do guia oficial (`skip_cloud_migrations_guide`
   ou `skip_cloud_hooks_guide`, com `regexSearch`). O resumo da referência não substitui o guia.

## 4. QA — o seu compilador

1. `skip_project_status`: as pendências devem ser os arquivos do plano, mais `.skip.config.json`.
   Diferença: explique ou corrija antes de aplicar.
2. `skip_project_apply_changes` com `message: "task <ID>: <resumo>"`; leia o resultado de cada
   etapa (setup, static check, build, test, commit).
3. Falhou: localize arquivo e linha no erro, releia o arquivo e corrija a causa. Proibido
   silenciar: `any`, `@ts-ignore`, desativar regra do lint, `catch` vazio, `|| true`, apagar código
   ou teste.
4. No máximo três ciclos de correção na mesma resposta. Depois, pare: estado `em_correcao`, motivo
   registrado e nada publicado.
5. QA verde prova que compila. Comportamento se prova com teste de mesa, revisão e teste humano.

## 5. REVISÃO — o seu diff

Releia inteiro cada arquivo alterado e marque:

- [ ] Cada mudança liga a um critério da SPEC; nada além do aceite.
- [ ] Imports existem e são usados; props e dados tipados; nenhum `any`.
- [ ] Componente não chama `pb` direto: dados só por `src/services/`.
- [ ] Entrada do usuário em filtro passa por `pb.filter(...)`.
- [ ] Permissão garantida na regra de acesso da coleção, não só escondendo botão.
- [ ] Erro mostra mensagem útil em PT-BR e nunca é engolido; escrita sem resposta do servidor não é
      repetida sozinha.
- [ ] Carregando, vazio e erro existem em toda tela com dados.
- [ ] Nenhum segredo no frontend: variável `VITE_*` é pública.
- [ ] Migration aditiva, com `down`, sem mudar tipo de campo existente.
- [ ] Teste de mesa refeito contra o código final.
- [ ] Task com tela: checklist da seção 4 de `../ui-ux-sistemas/SKILL.md` aplicado.

## 6. ENTREGA

Siga `../publicar-e-sincronizar/SKILL.md` em modo `entregar`. Sem publicação provada, não peça
teste humano.

## Referências (carregue só a necessária)

- `references/stack-skip.md` — regras do template Skip (React, shadcn, PocketBase) e do backend.
- `references/receitas-dados.md` — serviço da entidade, erros em PT-BR, formatos brasileiros,
  migration aditiva e teste de mesa.
- `references/receitas-telas.md` — página de lista com estados, tabela e cards, formulário em
  diálogo, confirmação de exclusão, rota e menu.
