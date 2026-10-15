---
name: adapta-cliente:destravar-task
description: Entra pelo SkillMind Cliente para diagnosticar a falha de uma task, corrigir e pedir o reteste so do que falhou, sem abrir outra task.
argument-hint: "[erro, teste falhando, task ou evidencia opcional]"
disable-model-invocation: true
---

Carregue `skills/skill-mind-cliente/SKILL.md` como única porta de entrada. Preserve o pedido
“destravar a task” e `$ARGUMENTS`, crie `CLIENTE_ENVELOPE v1` para `debug-task`, investigue a
causa raiz, corrija, publique com prova e peça o reteste só do que falhou. Não conclua nem abra
outra task nesta etapa.
