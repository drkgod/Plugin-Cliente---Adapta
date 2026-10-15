---
name: adapta-cliente:finalizar-task
description: Entra pelo SkillMind Cliente e so conclui as tasks testadas depois de o cliente dizer que testou e funcionou, com reverificacao completa, e segue o ciclo.
argument-hint: "[task ou evidencia opcional]"
disable-model-invocation: true
---

Carregue `skills/skill-mind-cliente/SKILL.md` como única porta de entrada. Preserve o pedido
“o teste funcionou, finalizar” e `$ARGUMENTS`. Exija confirmação explícita do teste; execute o
checklist de `agents/verificador-de-entrega.md` inline se não houver agente, conclua uma task por
vez e volte ao ciclo contínuo até a próxima parada real. Não presuma hook ou sincronização.
