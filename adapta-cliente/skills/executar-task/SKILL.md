---
name: executar-task
description: Implementa uma task analisada contra SPEC e critérios; no modo padrão exige autorização posterior, no modo autônomo usa a aprovação da fase e para no teste básico do cliente.
---

# Executar Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: executar-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos. Rejeite execução se
`.adapta-cliente/estado-atual.md` não registrar uma das condições: no modo padrão,
`aguardando_autorizacao` com autorização explícita posterior à análise; no modo autônomo,
`pronta_para_implementar` com fase aprovada e sem autorização prévia por task. Não confunda
autonomia técnica com autorização de publicação, convite ou acesso real.

## Preparação

1. Leia a task ativa em `04_fase-atual/fase.md`, a SPEC indicada, o relatório de análise e o
   estado persistente.
2. Confirme que descrição, dono, pré-condições, critério binário, evidência esperada e TDD estão
   identificados. Para ambiguidade de produto, procure a resposta anterior no chat; se faltar,
   peça ao champion apenas essa decisão. Não invente regra nem peça escolha técnica ao cliente.
3. Inspecione os arquivos afetados e mudanças existentes. Não sobrescreva trabalho alheio nem
   amplie o recorte.
4. Atualize a etapa para `implementando` antes da primeira alteração de produto.

## Implementação profunda de uma única task

1. Transforme cada item do critério em uma prova verificável.
2. Em task técnica, execute o RED ou registre o baseline equivalente antes da correção. Em task
   não técnica, defina a evidência observável equivalente.
3. Implemente o menor recorte completo que satisfaz a SPEC. Reutilize o que existe, respeite os
   padrões do repositório e não comece outra task.
4. Trate explicitamente entradas inválidas, caminhos de erro, perda de dados, segurança,
   acessibilidade e LGPD quando aplicáveis. Essas áreas não podem ser “simplificadas”.
5. A IA roda internamente build, checagens e testes relevantes disponíveis. O cliente não recebe
   comandos técnicos como tarefa de validação. Não esconda falhas com valores padrão, `catch`
   vazio, `|| true` ou remoção de testes.
6. Inspecione o diff contra a task. Mudança sem vínculo com critério ou TDD deve ser removida ou
   registrada como bloqueio, não justificada como melhoria extra.
7. Registre comandos, resultados e limitações reais. Ausência de ferramenta ou acesso não é PASS.

## Portão de teste humano

Ao terminar as verificações automatizáveis:

1. atualize o estado para `aguardando_teste_humano`;
2. mantenha `teste_humano: pendente`;
3. registre `verificacao_automatica: passou|falhou` com resumo;
4. apresente aos validadores designados:
   - o que mudou;
   - os testes automáticos e resultados;
   - um teste básico de 1 a 3 passos na interface, sem comandos técnicos;
   - resultado esperado e como reconhecer falha;
5. peça a cada validador designado que execute o teste básico e confirme o resultado; não conclua
   nem inicie outra task até receber todas as confirmações;
6. encerre a resposta imediatamente.

Falha automática não autoriza conclusão. Explique-a, mantenha a task aberta e deixe a próxima
ação como debug. Nunca chame `concluir-task` nem `proxima-task` nesta mesma resposta.
