---
name: proxima-task
description: Seleciona e analisa exatamente uma task elegível do repositório operacional Adapta no Codex, persiste o relatório e para antes de implementar. Use quando o cliente pedir para começar, trabalhar ou ver a próxima task.
---

# Analisar próxima task

Carregue `../../personas/agente-cliente.md` e `../../references/estado-v2.md`. Esta skill é direta
e nativa no Codex.

1. Resolva a raiz pelo conjunto `04_fase-atual/fase.md`, `04_fase-atual/specs/`, `STATUS.md`,
   `changelog.md` e `07-sistemas/`.
2. Se `handoff-manifest.json` existir, valide no manifesto v2 `consumer.surface: codex` e
   `consumer.plugin: adapta-cliente-codex`; manifesto v1 pode ser lido como legado com aviso. A
   ausência do manifesto, sozinha, não bloqueia.
3. Se `.adapta-cliente/estado-atual.md` tiver task aberta, etapa esperando o cliente ou impedimento,
   retome-a.
4. Em `fase-format:2`, retome `- [/]` ou selecione `- [ ]` em ordem de leitura, respeitando
   hierarquia, dependências, descrição e `<!-- id:... -->`; sem o marcador, leia a tabela legada.
   Se o usuário indicar uma task pendente e elegível, prefira-a. Nunca filtre ou bloqueie por owner/dono.
5. Leia a SPEC inteira, TDD, critério, arquivos afetados, estado atual, testes e diff.
   - SPEC que depende de arquivo privado do consultor: `DÚVIDA:` para o consultor, explicada ao
     cliente com o porquê.
   - Raiz executável ambígua: impedimento; explique ao cliente e ensine como resolver.
   - Detalhe de negócio que a SPEC não define: pergunte ao cliente e registre
     `DECISÃO DO CLIENTE:`.
6. Produza objetivo, estado atual, arquivos, plano, matriz critério→prova, riscos, verificações
   automáticas e teste humano. Ao cliente, apresente um resumo em linguagem simples (persona): o
   que vai mudar para quem usa, o que ele precisa decidir ou providenciar e como vai testar; o
   detalhe técnico fica no arquivo da análise.
7. Grave o relatório em `.adapta-cliente/analises/<task-id>.md` e mantenha
   `.adapta-cliente/estado-atual.md` no schema `adapta-cliente-state/v2`, com task, executor,
   owner informativo, SPEC, análise, etapa `aguardando_autorizacao`, gates pendentes e próxima ação.
8. Encerre: “Analisei a task <ID> e ainda não implementei nada. Posso implementar este plano?”

Não altere produto nem carregue outra task nesta resposta.
