---
name: debug-task
description: Diagnostica causa raiz e corrige uma única falha da task ativa, preservando SPEC, evidência e gates; depois verifica, publica e sincroniza com prova e volta obrigatoriamente ao teste humano. Use pelo SkillMind Cliente quando o usuário disser “deu erro”, “não funcionou”, “teste falhou”, “está quebrado” ou “destravar”, com CLIENTE_ENVELOPE v1 e sem abrir outra task.
---

<!-- Origem: reempacotado de compound-engineering/ce-debug para o método Adapta Native. -->

# Debug Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: debug-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não altere arquivos. Preserve a task registrada em
`.adapta-cliente/estado-atual.md`; debug não autoriza trocar de task ou ampliar escopo.

## Limites

- Não edite SPEC, plano ou fase para fazer o bug caber.
- Decisão de negócio que a SPEC não define: o cliente decide e você registra
  `DECISÃO DO CLIENTE:`. Mudança de escopo ou de critério de aceite vira `DÚVIDA:` no
  `changelog.md` para o consultor, explicada ao cliente com contexto.
- Três ciclos de correção sem resolver a mesma falha: indique o consultor com a mensagem pronta da
  persona, explicando o que já foi tentado.
- Não feche a task. Depois da correção, volte ao teste humano.
- Teste uma hipótese e uma correção por vez; preserve mudanças existentes.
- Não use comando destrutivo, force push, descarte global ou segredo para “destravar”.

## Processo

1. Atualize o estado para `em_correcao` e registre o sintoma relatado sem copiar prompt inteiro.
2. Identifique task, SPEC, TDD, resultado esperado, ambiente e evidência exata da falha. Falha de
   tela: peça, se faltar, a rota, o papel do usuário, os passos e um print.
3. Reproduza o problema pelo menor caso fiel. Se não reproduzir, registre tentativas e peça a
   evidência mínima ensinando como coletá-la (print, passos, horário, usuário usado); não
   adivinhe.
4. Confirme repo/branch, dependências, entradas, variáveis esperadas e mudanças locais. No Skip,
   confira `skip_project_status` e, para erro de hook ou backend, `skip_cloud_list_logs`.
5. Trace do sintoma até o primeiro estado inválido, seguindo o mapa do sistema (rota → página →
   componente → serviço → regra de acesso). Liste no máximo três hipóteses, cada uma com
   evidência, previsão e teste de descarte.
6. Só declare causa raiz quando a cadeia causal estiver demonstrada.
7. Aplique uma correção mínima dentro da task pelo protocolo de `../construir-codigo/SKILL.md`
   (edição cirúrgica, QA e revisão) e reexecute reprodução, TDD, regressão e checagens relevantes.
   Não esconda a falha.
8. Inspecione o diff e registre o Debug Summary em
   `06_notas/debug/debug-AAAA-MM-DD-<slug>.md` quando houver causa, bloqueio ou dúvida.
9. Execute `aprendizado-continuo` inline e silenciosamente para a causa confirmada ou registre
   ausência de sinal. Não pergunte nem mencione essa rotina ao cliente.

Atualize `changelog.md`:

```markdown
- AAAA-MM-DD · [executor] · DEBUG task <ID>: <sintoma> → causa raiz <resumo> → <corrigido|impedimento|dúvida> (skip <versionHash>).
```

Sem versão do Skip na correção, omita o parêntese.

## Voltar ao portão humano

Se a verificação automática passar, rode `../publicar-e-sincronizar/SKILL.md` em modo `entregar`,
com o estado em `aguardando_teste_humano` e o teste humano pendente. Correção sem alteração no
Skip não envia nada agora: os registros vão no commit da conclusão. Com a publicação provada,
responda ao cliente no formato da seção Saída e pergunte se funcionou. Encerre imediatamente; não
chame `concluir-task`.

Se a verificação ou a publicação falharem, mantenha `em_correcao` ou `bloqueada`, explique ao
cliente o impedimento com contexto e a próxima ação, e pare.

## Saída

Ao cliente, em linguagem simples:

- o que aconteceu, do ponto de vista de quem usa o sistema;
- por que aconteceu, em uma frase;
- o que foi corrigido e que já está no ar (ou o impedimento com contexto);
- como testar de novo, em passos numerados na URL de produção (para o cliente, “o endereço do
  sistema”);
- o aviso de envio pendente ao GitHub, se houver.

O registro técnico vai para `06_notas/debug/debug-AAAA-MM-DD-<slug>.md`:

```markdown
## Debug Summary
**Task e problema:**
**Reprodução:**
**Causa raiz:**
**Correção:**
**Verificação automática:**
**Situação:** aguardando teste humano | em correção | impedimento | decisão do consultor
```
