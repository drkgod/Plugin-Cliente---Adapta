---
name: adapta-cliente:skill-mind
description: Entrada canonica que interpreta qualquer pedido do cliente, aplica a maquina de estados e orquestra uma task por vez sem hooks.
argument-hint: "[pedido, erro, confirmacao ou contexto]"
disable-model-invocation: true
---

Carregue `MEMORY.md`, `personas/agente-cliente.md` e
`skills/skill-mind-cliente/SKILL.md`. Preserve `$ARGUMENTS` como pedido original, crie
`CLIENTE_ENVELOPE v1` e execute somente a rota autorizada pelo estado. Respeite os dois hard stops,
o teste humano e o fechamento com aprendizado. Não dependa de hook, contrato, script ou subagente.
