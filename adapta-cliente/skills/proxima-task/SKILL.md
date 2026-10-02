---
name: proxima-task
description: Seleciona exatamente uma task elegível, inspeciona SPEC e projeto; no modo padrão para antes de implementar, no modo autônomo entrega o plano ao executar-task sem nova autorização técnica.
---

# Analisar a Próxima Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: proxima-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos do produto.

Carregue `../../personas/agente-cliente.md`. Esta skill analisa e prepara; ela nunca implementa.

## Seleção

1. Leia `.adapta-cliente/estado-atual.md`, se existir. Task ativa, gate ou bloqueio deve ser
   retomado; não abra outra.
2. Leia `04_fase-atual/fase.md` e identifique a primeira task pendente elegível. No modo autônomo,
   o dono é a IA ou o papel executor definido na constituição; o champion/validador não precisa
   ser dono da implementação. No modo padrão, preserve a seleção de tasks do champion. Não pule a
   primeira task aberta por causa do nome do validador.
3. Confirme pré-condições e dependências. Não pule uma task bloqueada silenciosamente; mostre a
   trava, o dono da resolução e registre-a em `STATUS.md`/`changelog.md` quando aplicável.
4. Localize a SPEC em `04_fase-atual/specs/`. Para decisão de produto, procure no histórico do chat
   a resposta anterior do champion, registre data, autor e regra numa nota da task e não repita a
   pergunta. Se não houver resposta, pergunte somente o ponto de produto ao champion. Ausência de
   SPEC ou conflito material fica registrado para a validação do consultor no fim da fase; não
   invente resultado nem implemente uma regra conflitante.

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

## Persistir e rotear

Crie ou atualize `.adapta-cliente/estado-atual.md` com a task, SPEC, modo de execução, validadores,
teste humano pendente e aprendizado pendente. No modo autônomo, marque
`pronta_para_implementar` e passe o plano a `executar-task` na mesma interação, sem autorização
prévia, desde que a fase esteja aprovada e não haja dúvida de produto ou ação externa pendente.
Não selecione uma segunda task. No modo padrão, mantenha `aguardando_autorizacao` e uma única
próxima ação: `aguardar autorização para implementar`.

Somente no modo padrão, encerre com:

> Analisei a task <ID> e ainda não implementei nada. Posso implementar este plano?

Pare imediatamente depois da pergunta no modo padrão. No modo autônomo, a análise é interna,
`executar-task` implementa a mesma task e para no teste básico do cliente.
