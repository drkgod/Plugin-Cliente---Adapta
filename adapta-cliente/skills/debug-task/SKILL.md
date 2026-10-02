---
name: debug-task
description: Diagnostica causa raiz e corrige uma única falha da task ativa, preservando SPEC, evidência e gates; depois verifica e volta obrigatoriamente ao teste humano. Use pelo SkillMind Cliente quando o usuário disser “deu erro”, “não funcionou”, “teste falhou”, “está quebrado” ou “destravar”, com CLIENTE_ENVELOPE v1 e sem abrir outra task.
---

<!-- Origem: reempacotado de compound-engineering/ce-debug para o método Adapta Native. -->

# Debug Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: debug-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não altere arquivos. Preserve a task registrada em
`.adapta-cliente/estado-atual.md`; debug não autoriza trocar de task ou ampliar escopo.

## Limites

- Não edite SPEC, plano ou fase para fazer o bug caber.
- Requisito ambíguo ou decisão de produto: procure resposta anterior no chat; se não houver,
  peça ao champion somente a regra de produto. Mudança fora da SPEC vira sinal para o consultor
  no fechamento da fase e não é implementada nesta task.
- Não feche a task. Depois da correção, volte ao teste humano.
- Teste uma hipótese e uma correção por vez; preserve mudanças existentes.
- Não use comando destrutivo, force push, descarte global ou segredo para “destravar”.

## Processo

1. Atualize o estado para `em_correcao` e registre o sintoma relatado sem copiar prompt inteiro.
2. Identifique task, SPEC, TDD, resultado esperado, ambiente e evidência exata da falha.
3. Reproduza o problema pelo menor caso fiel. Se não reproduzir, registre tentativas e peça a
   evidência mínima; não adivinhe.
4. Confirme repo/branch, dependências, entradas, variáveis esperadas e mudanças locais.
5. Trace do sintoma até o primeiro estado inválido. Liste no máximo três hipóteses, cada uma com
   evidência, previsão e teste de descarte.
6. Só declare causa raiz quando a cadeia causal estiver demonstrada.
7. Aplique uma correção mínima dentro da task e reexecute reprodução, TDD, regressão e checagens
   relevantes. Não esconda a falha.
8. Inspecione o diff e registre o Debug Summary em
   `06_notas/debug/debug-AAAA-MM-DD-<slug>.md` quando houver causa, bloqueio ou dúvida.
9. Execute `aprendizado-continuo` inline e silenciosamente para a causa confirmada ou registre
   ausência de sinal. Não pergunte nem mencione essa rotina ao cliente.

Atualize `changelog.md`:

```markdown
- AAAA-MM-DD · [champion] · DEBUG task <ID>: <sintoma> → causa raiz <resumo> → <corrigido|bloqueado|dúvida>.
```

## Voltar ao portão humano

Se a verificação automática passar, atualize o estado para `aguardando_teste_humano`, mantenha o
teste humano pendente, apresente passos numerados e pergunte se funcionou. Encerre imediatamente;
não chame `concluir-task`.

Se falhar, mantenha `em_correcao` ou `bloqueada`, mostre causa/evidência/próxima ação e pare.

## Saída

```markdown
## Debug Summary
**Task e problema:**
**Reprodução:**
**Causa raiz:**
**Correção:**
**Verificação automática:**
**Gate atual:** aguardando teste humano | em correção | bloqueada | dúvida de produto para o champion
```
