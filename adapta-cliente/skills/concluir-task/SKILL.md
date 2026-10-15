---
name: concluir-task
description: Revalida do zero, uma por vez, as tasks que o cliente disse ter testado e aprovado ou que fecham pela prova automática (sem nada para o cliente testar), fecha apenas critérios binários sustentados por evidência, confere que a versão no ar é a testada, atualiza fase, STATUS, changelog e estado e devolve o ciclo ao SkillMind sem parar. Use somente pelo SkillMind Cliente com CLIENTE_ENVELOPE v1; “terminei”, “ok” ou “pode concluir” sem confirmação real do teste não fecham uma task que espera teste.
---

# Concluir Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: concluir-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não marque nada.

Só prossiga em um destes casos, registrados em `.adapta-cliente/estado-atual.md`:

1. **teste aprovado**: a task está em `aguardando_teste` e o cliente disse, em mensagem posterior ao
   roteiro, que testou e funcionou; guarde o trecho em `teste_humano`. “Pode concluir”, “ok” solto,
   silêncio ou ausência de reclamação sem teste confirmado não valem;
2. **prova automática**: a task tem `teste_humano: nao_aplicavel:<prova>`, decidido por
   `executar-task` pela regra da memória (“Quando pedir teste ao cliente”).

Com várias tasks aprovadas no mesmo teste, conclua uma por vez, cada uma com a própria
verificação.

## Verificação independente de subagentes

Leia `../../agents/verificador-de-entrega.md` e execute seu checklist em série no agente principal.
Se o runtime oferecer subagente, ele pode ser usado como verificação adicional, nunca como
dependência obrigatória.

1. Releia a task em `04_fase-atual/fase.md`, a SPEC, TDD, estado e diff/artefatos entregues.
2. Refaça do zero cada prova automática relevante. Não valide apenas o item que falhou antes.
3. Para cada critério, registre evidência observável e `PASSOU` ou `FALHOU`.
4. Confira caminho real, caminhos de erro declarados, regressão, build/testes, segredos, diff,
   linha vermelha e falhas silenciosas.
5. Em task não técnica, confira a evidência externa declarada pelo cliente sem copiar credencial
   ou dado pessoal para o repositório.
6. Em task com tela, aplique o checklist de UI de `../ui-ux-sistemas/SKILL.md` com evidência por
   item.
7. Em task no Skip, faça a conferência sem publicar de `../publicar-e-sincronizar/SKILL.md` (modo
   `registrar`): a versão no ar precisa ser a mesma que o cliente testou (ou, na prova automática,
   a mesma que foi verificada). Divergência é `NÃO PRONTA`.

Qualquer item sem evidência é `NÃO PRONTA` no registro interno. Não marque nada parcialmente:
falha que você mesmo corrige vai para `em_correcao` e o SkillMind segue com `debug-task`; falta de
acesso ou dependência vai para `bloqueada` e vira impedimento na parada. Ao cliente, na parada, em
linguagem simples: “Ainda não dá para concluir: falta <o quê>, porque <por quê>. Próximo passo:
<o que fazer e quem faz>.”

## Fechamento

Somente com todos os critérios aprovados:

1. marque a task em `04_fase-atual/fase.md` usando o padrão existente; em `fase-format:2`, altere
   somente seu checkbox para `[x]` e preserve título, indentação, metadados, descrição e
   `<!-- id:... -->`; na tabela legada, atualize a linha e a data como já definido pelo arquivo;
2. atualize `STATUS.md` com contagem e percentual reais;
3. acrescente ao `changelog.md`:
   `- AAAA-MM-DD · [executor] · Task <ID> concluída: <resumo e evidência>`;
4. atualize `.adapta-cliente/estado-atual.md`: etapa `concluida`, a task fora de
   `aguardando_teste`, as referências de pedido, teste e verificação preservadas e
   `aprendizado: pendente`. A triagem é feita pelo SkillMind, que executa silenciosamente
   `aprendizado-continuo` antes da parada, para todas as tasks fechadas desde a última; não
   pergunte nem informe isso ao cliente;
5. não envie nada ao GitHub agora: fase, STATUS, changelog e estado ficam no repositório local e
   vão no envio da próxima parada (`../publicar-e-sincronizar/SKILL.md`, seção 4);
6. ao cliente, só uma linha de progresso (“Task <ID> concluída.”); o resumo do que foi entregue e
   conferido vai na mensagem da parada, e a tabela de evidências fica no registro e só aparece se
   ele pedir;
7. devolva ao SkillMind, que segue o ciclo com a próxima task.

Se todas as tasks da fase estiverem concluídas, é a parada de fim: explique que a fase está pronta
e que o próximo passo é o consultor preparar a fase seguinte; não exija check ou formulário
adicional no repo do cliente.

## Sinais de racionalização

“Quase pronto”, “depois eu testo”, “deve funcionar”, “por enquanto deixa assim” e “o erro já
existia antes” são alertas, não evidência. Nesses casos a task permanece aberta com o motivo
registrado.
