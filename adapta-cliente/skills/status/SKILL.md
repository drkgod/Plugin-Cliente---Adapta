---
name: status
description: Resume de forma somente leitura a fase atual, progresso, task ativa, gate pendente, travas, próxima reunião e entregas do cliente. Use pelo SkillMind Cliente quando o usuário perguntar “como estamos?”, “qual o status?”, “quanto falta?” ou pedir um resumo para repassar, sem avançar task nem alterar gates.
---

# Status do Projeto

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: status`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md` e redirecione. Esta skill é somente leitura.

## Passos

1. Leia `STATUS.md`, `04_fase-atual/fase.md`, `.adapta-cliente/estado-atual.md` quando existir,
   as últimas entradas do `changelog.md` e o índice de `05_entregas/`.
2. Calcule o progresso pela tabela real; não copie percentual inconsistente sem sinalizar.
3. Responda com:
   - fase atual e objetivo;
   - tasks feitas/total e percentual;
   - task ativa, champion e estado do gate;
   - uma única próxima ação permitida pela máquina de estados;
   - pendências com donos e travas ativas;
   - próxima reunião e evidência a demonstrar, se registradas;
   - fases já entregues, uma linha por fase.
4. Se for “para repassar”, gere também uma versão de cinco linhas em linguagem de negócio.

## Regras

- Reporte só o que os arquivos sustentam; diferencie ausente, desconhecido e bloqueado.
- Não prometa fase futura, não selecione nova task e não transforme pedido de status em execução.
- Trava sem dono é o primeiro risco a apontar e deve virar dúvida para o consultor.
