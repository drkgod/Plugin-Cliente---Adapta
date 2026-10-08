---
name: debug-task
description: Reproduz, diagnostica e corrige a falha da task ativa no Codex, preservando SPEC e gates, e retorna obrigatoriamente ao teste humano, explicando ao cliente em linguagem simples.
---

# Debugar task ativa

Carregue `../../personas/agente-cliente.md` e `../../references/estado-v2.md`. Exija uma task ativa
no estado v2; não troque de task.

1. Registre o sintoma e mude a etapa para `em_correcao`.
2. Releia task, SPEC, TDD, análise, ambiente e evidência. Reproduza o menor caso fiel. Faltou
   evidência: ensine o cliente a coletá-la (print, passos, horário, usuário usado).
3. Trace o primeiro estado inválido e teste até três hipóteses com previsão e descarte.
4. Só declare causa raiz quando demonstrada. Corrija o mínimo dentro da SPEC e reexecute reprodução,
   TDD e regressão.
5. Registre `06_notas/debug/debug-AAAA-MM-DD-<slug>.md` e uma linha no `changelog.md`.
6. Se passar, volte a `aguardando_teste_humano` e conte ao cliente, em linguagem simples, o que
   aconteceu, por que aconteceu, o que foi corrigido e como testar de novo; pare. Se falhar,
   mantenha `em_correcao` ou `bloqueada` e explique o impedimento com contexto. Nunca conclua a
   task nesta resposta.
7. Três ciclos de correção sem resolver a mesma falha: indique o consultor com a mensagem pronta da
   persona, explicando o que já foi tentado.
