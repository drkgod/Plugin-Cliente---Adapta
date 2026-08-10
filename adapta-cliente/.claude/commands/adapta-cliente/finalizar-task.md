---
name: adapta-cliente:finalizar-task
description: Entra pelo SkillMind Cliente e so conclui a task ativa depois de teste humano explicitamente aprovado e reverificacao completa.
argument-hint: "[task ou evidencia opcional]"
disable-model-invocation: true
---

Carregue `skills/skill-mind-cliente/SKILL.md` como única porta de entrada. Preserve o pedido
“finalizar a task ativa” e `$ARGUMENTS`. Exija confirmação explícita do teste humano; execute o
checklist de `agents/verificador-de-entrega.md` inline se não houver agente; registre aprendizado
e pare sem iniciar a próxima task. Não presuma hook ou sincronização.
