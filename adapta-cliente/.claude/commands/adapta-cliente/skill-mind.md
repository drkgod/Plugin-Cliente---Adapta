---
name: adapta-cliente:skill-mind
description: Entrada canonica que interpreta qualquer pedido do cliente, aplica a maquina de estados e constroi as tasks em sequencia, uma por vez, sem hooks.
argument-hint: "[pedido, erro, resposta, resultado de teste ou contexto]"
disable-model-invocation: true
---

Carregue `MEMORY.md`, `personas/agente-cliente.md` e
`skills/skill-mind-cliente/SKILL.md`. Preserve `$ARGUMENTS` como pedido original, crie
`CLIENTE_ENVELOPE v1` e siga a rota do estado: no ciclo contínuo, uma task por vez, sem pedir
licença, parando só nas paradas reais da memória, com o teste do cliente nos momentos certos e o
aprendizado silencioso antes de cada parada. Não dependa de hook, contrato, script ou subagente.
