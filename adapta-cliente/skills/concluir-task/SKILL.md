---
name: concluir-task
description: Revalida do zero uma única task depois de o cliente confirmar explicitamente o teste humano, fecha apenas critérios binários sustentados por evidência, atualiza fase, STATUS, changelog, estado e aprendizado. Use somente pelo SkillMind Cliente com CLIENTE_ENVELOPE v1; “terminei” ou “pode concluir” sem confirmação real do teste não fecha a task.
---

# Concluir Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: concluir-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione e não marque nada.

Só prossiga quando `.adapta-cliente/estado-atual.md` indicar a task ativa em
`aguardando_teste_humano` e trouxer aprovação explícita do cliente em mensagem posterior ao roteiro
de teste. “Pode concluir”, silêncio ou ausência de reclamação sem teste confirmado não valem.

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

Qualquer item sem evidência é `NÃO PRONTA`. Atualize o estado para `em_correcao` ou `bloqueada`,
explique exatamente o que falta e pare. Não marque parcialmente.

## Fechamento

Somente com todos os critérios aprovados:

1. marque a task em `04_fase-atual/fase.md` usando o padrão existente; em `fase-format:2`, altere
   somente seu checkbox para `[x]` e preserve título, indentação, metadados, descrição e
   `<!-- id:... -->`; na tabela legada, atualize a linha e a data como já definido pelo arquivo;
2. atualize `STATUS.md` com contagem e percentual reais;
3. acrescente ao `changelog.md`:
   `- AAAA-MM-DD · [executor] · Task <ID> concluída: <resumo e evidência>`;
4. execute silenciosamente `aprendizado-continuo` com novo envelope ou leia
   `../aprendizado-continuo/SKILL.md` e execute inline; não pergunte nem informe isso ao cliente;
5. atualize `.adapta-cliente/estado-atual.md` para `concluida`, preservando as referências de
   autorização, teste, verificação e aprendizado;
6. se houver sincronização Git solicitada/configurada, inspecione arquivos sensíveis, faça commit
   comum e push sem força. Nunca alegue sincronização se não observar sucesso;
7. informe veredito, tabela de evidências, arquivos atualizados e sincronização real;
8. pare. Não abra a próxima task.

Se todas as tasks da fase estiverem concluídas, explique que a fase está pronta para o consultor
preparar a próxima; não exija check ou formulário adicional no repo do cliente.

## Sinais de racionalização

“Quase pronto”, “depois eu testo”, “deve funcionar”, “por enquanto deixa assim” e “o erro já
existia antes” são alertas, não evidência. Nesses casos a task permanece aberta com o motivo
registrado.
