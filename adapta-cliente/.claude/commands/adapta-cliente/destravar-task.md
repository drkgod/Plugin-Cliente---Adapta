---
name: adapta-cliente:destravar-task
description: Entra pelo SkillMind Cliente para diagnosticar a task ativa e voltar ao teste humano sem abrir outra task.
argument-hint: "[erro, teste falhando, task ou evidencia opcional]"
disable-model-invocation: true
---

Carregue `skills/skill-mind-cliente/SKILL.md` como única porta de entrada. Preserve o pedido
“destravar a task ativa” e `$ARGUMENTS`, crie `CLIENTE_ENVELOPE v1` para `debug-task`, investigue
causa raiz e pare obrigatoriamente no novo teste humano. Não conclua nem abra outra task.
