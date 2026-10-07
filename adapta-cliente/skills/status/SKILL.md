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
2. Calcule o progresso pelas tasks reais. Em `fase-format:2`, conte todos os checkboxes (`[x]`
   concluída, `[/]` em andamento e `[ ]` a fazer), inclusive subtasks; caso contrário, use a tabela
   legada. Não copie percentual inconsistente sem sinalizar.
3. Para cada `07-sistemas/<sistema>/plataforma.md`, consulte `skip_project_status` (só leitura) e
   compare a versão atual com a publicada. Verifique também se o estado marca
   `pendente_github: sim`. Não publique nem envie nada.
4. Responda com:
   - fase atual e objetivo;
   - tasks feitas/total e percentual;
   - task ativa, executor, owner informativo e estado do gate;
   - versão publicada e URL de produção de cada sistema, sinalizando o que está aplicado e não
     publicado ou feito e não enviado ao GitHub;
   - uma única próxima ação permitida pela máquina de estados;
   - pendências com donos e travas ativas;
   - próxima reunião e evidência a demonstrar, se registradas;
   - fases já entregues, uma linha por fase.
5. Se for “para repassar”, gere também uma versão de cinco linhas em linguagem de negócio.

## Regras

- Reporte só o que os arquivos sustentam; diferencie ausente, desconhecido e bloqueado.
- Não prometa fase futura, não selecione nova task e não transforme pedido de status em execução.
- Trava sem responsável de resolução deve ser sinalizada, mas owner ausente ou diferente do
  executor nunca bloqueia uma task que tenha SPEC, pré-condições e prova suficientes.
