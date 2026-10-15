---
name: adapta-cliente:trabalhar
description: Entra pelo SkillMind Cliente para começar, continuar ou fazer a fase, construindo as tasks em sequência e parando so quando precisa do cliente.
argument-hint: "[nome do champion ou contexto opcional]"
disable-model-invocation: true
---

Carregue `skills/skill-mind-cliente/SKILL.md` como única porta de entrada. Preserve o pedido
“começar ou continuar o trabalho” e `$ARGUMENTS`, crie `CLIENTE_ENVELOPE v1`, respeite o estado e
siga o ciclo contínuo: uma task por vez, cada uma analisada, construída, verificada e publicada com
prova, até uma parada real da memória. Não dependa de hooks e não pare para pedir licença.
