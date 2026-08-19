---
name: proxima-task
description: Seleciona e analisa exatamente uma task elegível do handoff Adapta no Codex, persiste o relatório e para antes de implementar. Use quando o cliente pedir para começar, trabalhar ou ver a próxima task.
---

# Analisar próxima task

Carregue `../../personas/agente-cliente.md` e `../../references/estado-v2.md`. Esta skill é direta
e nativa no Codex.

1. Resolva a raiz pelo conjunto `handoff-manifest.json`, `04_fase-atual/fase.md`,
   `04_fase-atual/specs/`, `STATUS.md`, `changelog.md` e `07-sistemas/`.
2. Exija manifesto v2 com `consumer.surface: codex` e `consumer.plugin:
   adapta-cliente-codex`; manifesto v1 pode ser lido como legado com aviso.
3. Se `.adapta-cliente/estado-atual.md` tiver task aberta, gate ou bloqueio, retome-a.
4. Se o usuário indicar uma task pendente e elegível, escolha-a; senão escolha a primeira cujas
   pré-condições estejam atendidas. Nunca filtre ou bloqueie por owner/dono.
5. Leia a SPEC inteira, TDD, critério, arquivos afetados, estado atual, testes e diff. Caminho
   privado do consultor ou raiz executável ambígua vira `DÚVIDA:` e bloqueia.
6. Produza objetivo, estado atual, arquivos, plano, matriz critério→prova, riscos, verificações
   automáticas e teste humano.
7. Grave o relatório em `.adapta-cliente/analises/<task-id>.md` e mantenha
   `.adapta-cliente/estado-atual.md` no schema `adapta-cliente-state/v2`, com task, executor,
   owner informativo, SPEC, análise, etapa `aguardando_autorizacao`, gates pendentes e próxima ação.
8. Encerre: “Analisei a task <ID> e ainda não implementei nada. Posso implementar este plano?”

Não altere produto nem carregue outra task nesta resposta.
