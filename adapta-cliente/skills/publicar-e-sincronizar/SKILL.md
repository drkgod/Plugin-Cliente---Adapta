---
name: publicar-e-sincronizar
description: Skill de apoio que cumpre a regra de entrega da memória. Aplica as alterações do Skip com QA, publica, prova que a versão no ar é a atual, registra a plataforma, espelha os arquivos alterados e atualiza o GitHub em um único commit por momento de envio (entrega, conclusão, configuração), com push sem força, prova pelo SHA e no máximo uma nova tentativa. Use dentro de proxima-task (só conferência), executar-task, debug-task e concluir-task, e pelo SkillMind nas rotas configurar e recuperar, sempre com CLIENTE_ENVELOPE v1.
---

<!-- Regra de entrega da memória adapta-cliente-memory 0.6.1: toda alteração no Skip termina
aplicada, publicada e provada, e o GitHub recebe um único commit por momento de envio. -->

# Publicar e Sincronizar

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1`. Esta skill não é rota de trabalho: roda dentro da skill autorizada no
envelope (`proxima-task`, `executar-task`, `debug-task` ou `concluir-task`) ou é autorizada pelo
SkillMind nas rotas `configurar` e `recuperar`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não publique nem envie nada.

Ela não abre task, não aprova teste humano, não conclui task e não decide escopo.

## Modos

| Modo | Quem chama | Skip | GitHub |
|---|---|---|---|
| `configurar` | SkillMind, rota `configurar` | identifica o projeto (só leitura) | um commit com `plataforma.md` |
| `entregar` | `executar-task`, `debug-task` com alteração no Skip | aplica, publica e prova | um commit com registros, plataforma e espelho |
| `registrar` | `concluir-task` | confere a versão no ar (só leitura) | um commit com os registros da conclusão |
| `verificar` | baseline da `proxima-task` e recuperação | confere (só leitura) | não envia; na recuperação, reenvia o pendente |

Análise, status e debug sem alteração no Skip não enviam nada ao GitHub: os arquivos ficam no
repositório local e vão no próximo envio.

Task sem plataforma de construção (`skip_projeto: nao_aplicavel`): pule as seções do Skip e faça
só o GitHub.

## 1. Identificar o projeto

1. Leia `07-sistemas/<sistema>/plataforma.md`; o `projectId` vem dele.
2. Sem o arquivo (rota `configurar` ou primeira task do sistema): encontre o projeto com
   `skip_project_list` (parâmetro `query` com o nome ou a URL informados pelo cliente) e confirme
   com `skip_project_get`. Mais de um candidato, ou nenhum: pergunte ao cliente. Nunca adivinhe o
   `projectId`.
3. Crie o arquivo com o modelo da seção 6.

## 2. Aplicar (modo `entregar`)

1. `skip_project_status`: `pendingChanges` deve listar só os arquivos do plano da task, mais
   `.skip.config.json`. Arquivo inesperado é alteração feita fora da task: não aplique, registre
   e explique ao cliente que existe uma mudança no Skip que não veio desta task (por exemplo,
   feita pelo chat do próprio Skip); pergunte se ela deve entrar junto.
2. `skip_project_apply_changes` com `message: "task <ID>: <resumo curto>"`. Nunca passe
   `confirmPrune: true` sem autorização explícita do cliente: isso apaga versões.
3. Leia o resultado de cada etapa. Falhou: volte à seção 4 de `../construir-codigo/SKILL.md`.
   Depois de três falhas, pare sem publicar: estado `em_correcao`,
   `skip_publicacao: falhou:<etapa e erro>` e as pendências listadas; siga para a seção 4 só com
   os registros, sem espelho.
4. Guarde o `versionHash` da versão criada.

## 3. Publicar e provar (modo `entregar`)

1. Rode `skip_project_publish` logo depois do apply aprovado. Nunca publique versão com QA ou
   build falhando.
2. Guarde a URL de produção e a referência publicada que a ferramenta devolve.
3. Prove com `skip_project_status`:
   - `version.versionHash` igual à referência publicada (ou a `deployment.lastPublishedRef` de
     `.skip.config.json`);
   - `build.isPublished: true`;
   - `pendingChanges` vazio ou só com `.skip.config.json`.
4. `.skip.config.json` é da plataforma, que grava nele os dados de publicação. Nunca edite esse
   arquivo e nunca rode `skip_project_apply_changes` só por causa dele: isso cria uma versão nova
   sem publicar e entra em loop.
5. Publicação falhou ou não foi provada: não contorne. Registre
   `skip_publicacao: falhou:<motivo>` com o estado em `em_correcao` ou `bloqueada`, siga para a
   seção 4 (o GitHub recebe os registros da falha), explique ao cliente o impedimento (o que não
   foi ao ar e por quê) e não peça teste humano sobre uma versão que não está no ar.
6. Com a prova, registre no estado `skip_versao: <versionHash>` e
   `skip_publicacao: publicada:<ref> em <ISO-8601>`.

### Conferir sem publicar (modos `registrar` e `verificar`)

Só leitura com `skip_project_status`. Versão atual diferente da publicada, ou pendências além de
`.skip.config.json`: registre a divergência e avise o cliente. Em `concluir-task`, divergência
impede concluir. Nunca publique nesses modos.

## 4. Atualizar o GitHub — uma vez por momento

Ordem obrigatória: Skip provado → registros escritos → um commit → prova. Cada envio custa tempo
do cliente: não envie fora dos momentos da tabela de modos e nunca envie a mesma coisa duas vezes.

1. Escreva tudo antes de enviar, com `pendente_github: nao` no estado:
   - `.adapta-cliente/estado-atual.md` já com a etapa em que esta resposta termina (por exemplo,
     `aguardando_teste_humano`);
   - análise, mapa (`.adapta-cliente/mapas/`), `changelog.md` e notas em `06_notas/` que estejam
     esperando envio;
   - na conclusão, `04_fase-atual/fase.md` e `STATUS.md`;
   - no modo `entregar`, `07-sistemas/<sistema>/plataforma.md` atualizado e o espelho.
2. Espelho (modo `entregar`): para cada arquivo alterado no Skip nesta resposta, leia a versão
   final com `skip_file_read` e grave em `07-sistemas/<sistema>/codigo/<mesmo caminho>`. Arquivo
   apagado no Skip sai do espelho. Na primeira vez, crie `07-sistemas/<sistema>/codigo/LEIA-ME.md`
   dizendo que é cópia de consulta e que a fonte executável é o Skip. Espelho completo do projeto
   só quando o cliente ou o consultor pedirem.
3. Nunca vai para o GitHub: `.env*`, chaves, tokens, senhas, `.skip.config.json`, lockfiles,
   binários, imagens, vídeos e dados pessoais. Revise a lista de arquivos antes de enviar.
4. Envie tudo em um único commit com a mensagem `task <ID>: <resumo> (skip <versionHash>)` (sem
   versão do Skip, omita o parêntese):
   - com git: `git add` dos arquivos da lista, `git commit` e push sem força;
   - com conector do GitHub: a operação que grava vários arquivos em um commit (como
     `push_files`); arquivo por arquivo só quando ela não existir.
5. Prova: o SHA do commit devolvido pelo push ou pelo conector; com git, `git ls-remote origin
   <branch>` igual a `git rev-parse HEAD`. Não releia os arquivos para provar.
6. Falhou: uma nova tentativa no máximo. No git, recusa por divergência pede `git pull --rebase`
   (só reaplica os seus commits locais) e novo push; conflito pede `git rebase --abort`, parada e
   aviso ao cliente. Nunca force, nunca use `reset --hard` e nunca descarte trabalho.
7. Falhou de novo: grave `pendente_github: sim:<motivo>` no estado local, diga ao cliente em uma
   linha que a entrega está pronta mas não chegou ao GitHub e siga o fluxo. A recuperação agendada
   reenvia. Não diga "sincronizado".
8. Ferramentas reiniciadas no meio do envio: antes de reenviar, consulte o último commit da branch
   (uma chamada). Se o commit da task já está lá, não reenvie; se faltou arquivo, envie só o que
   faltou.

## 5. Modo `verificar` na recuperação

- Skip: só a conferência sem publicar.
- GitHub: com `pendente_github: sim` ou commits locais não enviados
  (`git log --branches --not --remotes`), uma tentativa de envio pelas regras da seção 4. Nenhum
  commit novo de produto; só os registros da própria recuperação.

## 6. Modelo de `07-sistemas/<sistema>/plataforma.md`

```markdown
# <Sistema> — plataforma de construção

- plataforma: Skip
- projeto_id: <número>
- url_producao: <https://<app>.goskip.app>
- url_preview: <https://<app>--preview.goskip.app>
- versao_aplicada: <versionHash>
- versao_publicada: <ref> em <ISO-8601>
- ultima_task: <ID>
- espelho: `codigo/` guarda a última versão de cada arquivo alterado pelas tasks. É cópia de
  consulta; a fonte executável é o Skip. Nunca edite o espelho para mudar o sistema.

## Histórico de entregas

| Data | Task | Versão publicada | Arquivos alterados |
|---|---|---|---|
```

## Saída

Informe ao cliente só o que foi provado, em linguagem simples: “já está no ar em <URL>” e “salvei
no GitHub”. Versão, hash e SHA vão para os registros, não para a conversa. Sem prova, use o
formato de impedimento: o que não aconteceu, por quê e uma única próxima ação.
