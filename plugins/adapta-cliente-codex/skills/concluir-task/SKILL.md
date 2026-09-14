---
name: concluir-task
description: Revalida e conclui no Codex uma única task depois de confirmação explícita do teste humano, atualizando fase, status, histórico e estado sem iniciar outra task.
---

# Concluir task

Carregue `../../personas/agente-cliente.md` e `../../references/estado-v2.md`. Prossiga somente com task em
`aguardando_teste_humano` e mensagem atual dizendo que o teste solicitado foi executado e aprovado.

1. Releia task, SPEC, TDD, análise, estado, diff e evidências.
2. Refaça cada prova automática relevante e classifique cada critério como `PASSOU` ou `FALHOU`.
3. Confira caminho principal, erros, regressão, segredos, linha vermelha e falhas silenciosas.
4. Qualquer item sem evidência mantém a task aberta em `em_correcao` ou `bloqueada`.
5. Com tudo aprovado, marque a task em `04_fase-atual/fase.md`. Em `fase-format:2`, altere apenas
   o checkbox para `[x]` e preserve título, indentação, descrição, metadados e `<!-- id:... -->`;
   na tabela legada, mantenha o padrão existente. Atualize `STATUS.md`, `changelog.md` e o estado
   v2 para `concluida`; SPECs continuam imutáveis.
6. Execute `../aprendizado-continuo/SKILL.md` silenciosamente e pare. Não abra a próxima task.

Se todas as tasks estiverem concluídas, informe que a fase está pronta para o consultor preparar a
seguinte; não exija check ou formulário adicional.
