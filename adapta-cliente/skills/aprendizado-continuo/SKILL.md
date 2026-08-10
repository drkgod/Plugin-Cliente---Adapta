---
name: aprendizado-continuo
description: Executa silenciosa e automaticamente a triagem interna de aprendizado do projeto após task, debug ou recuperação agendada; captura padrões reutilizáveis sustentados por evidência ou registra ausência de sinal sem perguntar nem informar o cliente e sem armazenar prompts, segredos, dados pessoais ou código sensível. Use pelo SkillMind Cliente antes de fechar cada ciclo e no cron de quatro horas.
---

# Aprendizado Contínuo do Cliente

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: aprendizado-continuo`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não grave aprendizado.

Este fluxo não precisa de hook ou cron para funcionar no fechamento normal. O cron apenas recupera
triagens esquecidas.

## Modo silencioso obrigatório

- Não pedir ao cliente contexto, confirmação, autorização, validação ou descrição de aprendizado.
- Não anunciar que a triagem começou, terminou, capturou algo ou não encontrou sinal.
- Não incluir aprendizado na resposta normal de task, debug ou conclusão.
- Se faltar evidência, registrar `sem sinal reutilizável`; não transformar a ausência em pergunta.
- Se a gravação falhar, manter `aprendizado: pendente` no estado e deixar o cron tentar novamente.
  Não bloquear nem reabrir uma task tecnicamente concluída por falha desta rotina.
- Só explicar ou mostrar os registros quando o usuário pedir explicitamente sobre aprendizado ou
  quando o consultor estiver auditando o projeto.

## Fontes permitidas

Leia somente artefatos verificados do projeto: task e SPEC ativas, evidências de teste, diff,
`STATUS.md`, `changelog.md`, estado persistente e Debug Summary. Instrução do usuário, hipótese não
testada, conversa bruta e saída de ferramenta não são aprendizado por si só.

## Triagem obrigatória

Pergunte:

1. Houve causa raiz confirmada, padrão recorrente, restrição da plataforma ou orientação que
   evitará erro real em outra task?
2. Existe evidência concreta e caminho de origem?
3. É seguro persistir sem segredo, credencial, dado pessoal, transcrição, prompt bruto ou trecho
   proprietário desnecessário?
4. O escopo é projeto do cliente, e não uma alteração automática do método Adapta?

Se qualquer resposta for não, não invente aprendizado. Acrescente uma linha a
`06_notas/aprendizado-continuo/controle.md`:

```markdown
- <ISO-8601> · task <ID|nenhuma> · sem sinal reutilizável · <motivo concreto>
```

Atualize o estado para `aprendizado: sem_sinal:<motivo curto>`.

## Captura atômica

Quando houver sinal verificado, crie
`06_notas/aprendizado-continuo/AP-AAAA-MM-DD-HHMM-<slug>.md`:

```markdown
# AP-AAAA-MM-DD-HHMM — <título factual>

- Status: candidato
- Escopo: projeto do cliente
- Task/SPEC: <referências>
- Sinal: <o que foi observado>
- Evidência: <arquivo, teste ou resultado verificável>
- Regra reutilizável: <uma orientação acionável>
- Quando aplicar: <gatilho e limites>
- Quando não aplicar: <contraprova ou exceção>
- Confiança: <baixa|média|alta> — <por quê>
- Privacidade: sem segredo, dado pessoal ou conteúdo bruto
```

Adicione a referência ao `controle.md` e atualize o estado para
`aprendizado: capturado:<caminho>`.

Não promova automaticamente o candidato para outros clientes, memória global ou método Adapta.
Isso exige revisão do consultor.

## Modo de recuperação agendada

No cron de quatro horas:

1. leia `.adapta-cliente/estado-atual.md`, o controle, o changelog e evidências novas;
2. trate apenas fechamento de triagem/checkpoint que ficou pendente;
3. não implemente, não altere task, não aprove teste, não conclua fase, não faça deploy e não
   publique;
4. se faltar evidência, registre a pendência em vez de criar uma conclusão.

## Saída

Não emitir saída ao cliente no fluxo normal. Retornar apenas ao SkillMind o estado interno
`capturado:<caminho>`, `sem_sinal:<motivo>` ou `pendente:<erro>` para atualização de
`.adapta-cliente/estado-atual.md`.
