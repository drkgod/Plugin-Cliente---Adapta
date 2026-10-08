---
name: status
description: Resume de forma somente leitura a fase atual, progresso, task ativa, em que ponto ela está, impedimentos com o porquê, próxima reunião e entregas do cliente, em linguagem simples. Use pelo SkillMind Cliente quando o usuário perguntar “como estamos?”, “qual o status?”, “quanto falta?” ou pedir um resumo para repassar, sem avançar task nem alterar gates.
---

# Status do Projeto

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: status`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md` e redirecione. Esta skill é somente leitura.

## Passos

1. Leia `STATUS.md`, `04_fase-atual/fase.md`, `.adapta-cliente/estado-atual.md` quando existir,
   as últimas entradas do `changelog.md` e o índice de `05_entregas/`.
2. Calcule o progresso pelas tasks reais. Em `fase-format:2`, conte todos os checkboxes (`[x]`
   concluída, `[/]` em andamento e `[ ]` a fazer), inclusive subtasks; caso contrário, use a tabela
   legada. Não copie percentual inconsistente sem sinalizar.
3. Para cada `07-sistemas/<sistema>/plataforma.md`, consulte `skip_project_status` (só leitura) e
   compare a versão atual com a publicada. Verifique também se o estado marca
   `pendente_github: sim`. Não publique nem envie nada.
4. Responda em linguagem simples (regra de comunicação da memória) com:
   - fase atual e objetivo;
   - tasks feitas/total e percentual;
   - task ativa, quem está executando, owner informativo e em que ponto ela está, dito em
     palavras simples;
   - o que está no ar de cada sistema (endereço) e o que foi feito mas ainda não foi ao ar ou não
     foi salvo no GitHub;
   - uma única próxima ação permitida pela máquina de estados;
   - pendências e impedimentos, cada um com o porquê e quem resolve;
   - próxima reunião e evidência a demonstrar, se registradas;
   - fases já entregues, uma linha por fase.
5. Se for “para repassar”, gere também uma versão de cinco linhas em linguagem de negócio.

## Regras

- Reporte só o que os arquivos sustentam; diferencie o que está ausente, o que não se sabe e o que
  tem impedimento.
- Não prometa fase futura, não selecione nova task e não transforme pedido de status em execução.
- Impedimento sem responsável deve ser sinalizado, mas owner ausente ou diferente do executor
  nunca impede uma task que tenha SPEC, pré-condições e prova suficientes.
