---
name: executar-task
description: Implementa com profundidade exatamente uma task já analisada e explicitamente autorizada pelo cliente, seguindo sua SPEC, critérios e TDD; executa verificações automatizáveis e para obrigatoriamente no teste humano. Use somente quando o SkillMind Cliente fornecer CLIENTE_ENVELOPE v1 e o estado registrar autorização posterior ao relatório de análise.
---

# Executar Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: executar-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos. Rejeite execução se
`.adapta-cliente/estado-atual.md` não estiver em `aguardando_autorizacao` com autorização explícita
registrada depois do relatório de análise.

## Preparação

1. Leia a task ativa em `04_fase-atual/fase.md`, a SPEC indicada, o relatório de análise e o
   estado persistente.
2. Confirme que descrição, dono, pré-condições, critério binário, evidência esperada e TDD estão
   identificados. Ambiguidade que muda o resultado vira `DÚVIDA:` no `changelog.md` e bloqueia.
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
5. Rode GREEN, regressão, build, lint, checagem de tipos e testes relevantes que o projeto
   oferecer. Não esconda falhas com valores padrão, `catch` vazio, `|| true` ou remoção de testes.
6. Inspecione o diff contra a task. Mudança sem vínculo com critério ou TDD deve ser removida ou
   registrada como bloqueio, não justificada como melhoria extra.
7. Registre comandos, resultados e limitações reais. Ausência de ferramenta ou acesso não é PASS.

## Portão de teste humano

Ao terminar as verificações automatizáveis:

1. atualize o estado para `aguardando_teste_humano`;
2. mantenha `teste_humano: pendente`;
3. registre `verificacao_automatica: passou|falhou` com resumo;
4. apresente ao cliente:
   - o que mudou;
   - os testes automáticos e resultados;
   - passos numerados para testar o caminho real;
   - resultado esperado e como reconhecer falha;
5. pergunte “Faça esse teste e me diga se funcionou. Não vou concluir nem iniciar outra task até
   sua confirmação.”;
6. encerre a resposta imediatamente.

Falha automática não autoriza conclusão. Explique-a, mantenha a task aberta e deixe a próxima
ação como debug. Nunca chame `concluir-task` nem `proxima-task` nesta mesma resposta.
