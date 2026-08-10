---
name: proxima-task
description: Seleciona exatamente uma task elegível da fase atual, inspeciona profundamente sua SPEC e o estado real do projeto, apresenta achados, riscos, plano e testes e para antes de implementar. Use pelo SkillMind Cliente quando o usuário disser “trabalhar”, “próxima task”, “o que faço agora?” ou quiser começar/retomar, nunca como autorização de implementação.
---

# Analisar a Próxima Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: proxima-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos do produto.

Carregue `../../personas/agente-cliente.md`. Esta skill analisa e prepara; ela nunca implementa.

## Seleção

1. Leia `.adapta-cliente/estado-atual.md`, se existir. Task ativa, gate ou bloqueio deve ser
   retomado; não abra outra.
2. Leia `04_fase-atual/fase.md` e identifique a primeira task pendente elegível cujo dono é o
   champion. Se o nome não estiver disponível, pergunte antes de selecionar.
3. Confirme pré-condições e dependências. Não pule uma task bloqueada silenciosamente; mostre a
   trava, o dono da resolução e registre-a em `STATUS.md`/`changelog.md` quando aplicável.
4. Localize a SPEC em `04_fase-atual/specs/`. Ausência, ambiguidade ou conflito material bloqueia
   a implementação e vira `DÚVIDA:` para o consultor.

## Análise profunda, sem escrita de produto

1. Leia a task, a SPEC inteira, critérios, TDD e arquivos do projeto que seriam afetados.
2. Inspecione a implementação atual, padrões existentes, dependências, testes e mudanças locais.
3. Quando seguro, execute somente verificações de baseline que não alterem o produto. Registre
   falhas preexistentes separadamente.
4. Percorra a escada de decisão da persona e delimite o menor recorte completo.
5. Produza:
   - objetivo e resultado observável;
   - estado atual e erros encontrados;
   - arquivos/componentes provavelmente afetados;
   - plano concreto de implementação;
   - matriz critério → prova;
   - riscos, casos de erro, segurança, acessibilidade e LGPD aplicáveis;
   - dependências e perguntas realmente bloqueantes;
   - roteiro de verificação automática e teste humano.

## Persistir e parar

Crie ou atualize `.adapta-cliente/estado-atual.md` com a task selecionada, sua SPEC, a etapa
`aguardando_autorizacao`, autorizações ausentes, teste humano pendente, aprendizado pendente e uma
única próxima ação: `aguardar autorização para implementar`.

Encerre com:

> Analisei a task <ID> e ainda não implementei nada. Posso implementar este plano?

Pare imediatamente depois da pergunta. Não edite código, configuração ou conteúdo do produto;
não carregue `executar-task`; não trate o pedido inicial como autorização; não selecione uma
segunda task.
