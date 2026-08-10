---
name: adapta-cliente:trabalhar
description: Entra pelo SkillMind Cliente para analisar ou retomar exatamente uma task, com parada obrigatoria antes da implementacao.
argument-hint: "[nome do champion ou contexto opcional]"
disable-model-invocation: true
---

Carregue `skills/skill-mind-cliente/SKILL.md` como única porta de entrada. Preserve o pedido
“começar ou retomar o trabalho” e `$ARGUMENTS`, crie `CLIENTE_ENVELOPE v1`, respeite o estado e
pare no gate correto. Não dependa de hooks e não implemente na mesma resposta que apresentar a
análise.
