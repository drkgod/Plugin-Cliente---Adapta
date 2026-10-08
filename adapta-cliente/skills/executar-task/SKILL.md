---
name: executar-task
description: Implementa com profundidade exatamente uma task já analisada e explicitamente autorizada pelo cliente, seguindo sua SPEC, critérios e TDD pelo protocolo construir-codigo (e ui-ux-sistemas quando há tela); executa verificações automatizáveis, publica no Skip e atualiza o GitHub com prova e para obrigatoriamente no teste humano. Use somente quando o SkillMind Cliente fornecer CLIENTE_ENVELOPE v1 e o estado registrar autorização posterior ao relatório de análise.
---

# Executar Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: executar-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos. Rejeite execução se
`.adapta-cliente/estado-atual.md` não estiver em `aguardando_autorizacao` com autorização explícita
registrada depois do relatório de análise.

## Preparação

1. Leia a task ativa em `04_fase-atual/fase.md`, a SPEC indicada, o relatório persistido em
   `.adapta-cliente/analises/<task-id>.md` e o estado atual.
2. Confirme que descrição, pré-condições, critério binário, evidência esperada e TDD estão
   identificados. Detalhe de negócio em aberto: pergunte ao cliente e registre
   `DECISÃO DO CLIENTE:`. Ambiguidade que muda escopo ou critério de aceite vira `DÚVIDA:` no
   `changelog.md` e impede seguir até o consultor responder; explique isso ao cliente com contexto.
   Owner ausente, divergente ou diferente do executor não é ambiguidade e nunca bloqueia.
3. Inspecione os arquivos afetados e mudanças existentes. Não sobrescreva trabalho alheio nem
   amplie o recorte.
4. Carregue `../construir-codigo/SKILL.md` e, se a task tem tela, `../ui-ux-sistemas/SKILL.md`.
   Releia o mapa do sistema e o plano em código aprovado antes da primeira escrita.
5. Atualize a etapa para `implementando` antes da primeira alteração de produto.

## Implementação profunda de uma única task

1. Transforme cada item do critério em uma prova verificável.
2. Em task técnica, execute o RED ou registre o baseline equivalente antes da correção. No Skip,
   que não tem executor de testes, o RED é o teste de mesa contra o código atual. Em task não
   técnica, defina a evidência observável equivalente.
3. Implemente o menor recorte completo que satisfaz a SPEC, pela edição cirúrgica de
   `construir-codigo`. Reutilize o que existe, respeite os padrões do repositório e não comece
   outra task.
4. Trate explicitamente entradas inválidas, caminhos de erro, perda de dados, segurança,
   acessibilidade e LGPD quando aplicáveis. Essas áreas não podem ser “simplificadas”.
5. Rode GREEN, regressão, build, lint, checagem de tipos e testes relevantes que o projeto
   oferecer; no Skip, o QA do `skip_project_apply_changes` é o compilador (seção 4 de
   `construir-codigo`). Não esconda falhas com valores padrão, `catch` vazio, `|| true` ou remoção
   de testes.
6. Inspecione o diff contra a task: releia cada arquivo alterado com o checklist de revisão e,
   em task com tela, com o checklist de UI. Mudança sem vínculo com critério ou TDD deve ser
   removida ou registrada como bloqueio, não justificada como melhoria extra.
7. Registre comandos, resultados e limitações reais. Ausência de ferramenta ou acesso não é PASS.

## Entrega: publicar e sincronizar

Com as verificações aprovadas, rode `../publicar-e-sincronizar/SKILL.md` em modo `entregar`. No
passo de registros, o estado vai com `aguardando_teste_humano`, `teste_humano: pendente` e
`verificacao_automatica: passou` com resumo.

- Publicação não provada: estado `em_correcao` ou `bloqueada`, explique ao cliente o impedimento
  (o que não foi ao ar e por quê) e pare sem pedir teste humano.
- Envio ao GitHub que falhar depois da publicação provada: avise o cliente com o motivo e siga para
  o teste humano; a versão está no ar e a recuperação agendada reenvia os commits.

## Portão de teste humano

Com a publicação provada:

1. confirme no estado `aguardando_teste_humano` e `teste_humano: pendente`;
2. apresente ao cliente, em linguagem simples:
   - o que mudou, do ponto de vista de quem usa o sistema;
   - que já está no ar, com o endereço, e que ficou salvo no GitHub (ou o aviso de que o envio
     está pendente);
   - o que o sistema já conferiu sozinho, em uma linha;
   - passos numerados para testar o caminho real na URL de produção (para o cliente, “o endereço
     do sistema”); em task com tela, siga o roteiro da seção 5 de `../ui-ux-sistemas/SKILL.md`;
   - o que deve aparecer em cada passo e como perceber que algo deu errado;
3. pergunte “Faça esse teste e me diga se funcionou. Não vou concluir nem iniciar outra task até
   sua confirmação.”;
4. encerre a resposta imediatamente.

Falha automática não autoriza publicação nem conclusão. Explique-a, mantenha a task aberta e
deixe a próxima ação como debug. Nunca chame `concluir-task` nem `proxima-task` nesta mesma
resposta.
