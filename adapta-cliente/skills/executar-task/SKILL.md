---
name: executar-task
description: Constrói com profundidade a task que a proxima-task acabou de analisar, seguindo sua SPEC, critérios e TDD pelo protocolo construir-codigo (e ui-ux-sistemas quando há tela); executa verificações automatizáveis, publica no Skip com prova e decide, pela regra da memória, se o teste do cliente é necessário agora (SPEC inteira entregue ou caso crítico), se a task espera o teste da SPEC ou se fecha pela prova automática. Use somente dentro do ciclo contínuo do SkillMind Cliente, com CLIENTE_ENVELOPE v1, estado implementando e o pedido de trabalho registrado; nunca pede licença para construir.
---

# Executar Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: executar-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos. Rejeite execução se
`.adapta-cliente/estado-atual.md` não estiver em `implementando` com a análise da task gravada e o
pedido de trabalho do cliente registrado em `autorizacao_implementacao`.

## Preparação

1. Leia a task em construção em `04_fase-atual/fase.md`, a SPEC indicada, a análise persistida em
   `.adapta-cliente/analises/<task-id>.md` e o estado atual.
2. Confirme que descrição, pré-condições, critério binário, evidência esperada e TDD estão
   identificados. Detalhe de negócio que surgir agora é pergunta real: registre-o na análise, pare
   antes de escrever o trecho que depende dele e devolva ao SkillMind, que leva a pergunta para a
   parada (ou segue com outra task que não dependa desta). Ambiguidade que muda escopo ou critério
   de aceite vira `DÚVIDA:` no `changelog.md` para o consultor, com a task em `em_espera`; explique
   isso ao cliente com contexto na parada. A resposta do cliente vira `DECISÃO DO CLIENTE:`.
   Owner ausente, divergente ou diferente do executor não é ambiguidade e nunca bloqueia.
3. Inspecione os arquivos afetados e mudanças existentes. Não sobrescreva trabalho alheio nem
   amplie o recorte.
4. Carregue `../construir-codigo/SKILL.md` e, se a task tem tela, `../ui-ux-sistemas/SKILL.md`.
   Releia o mapa do sistema e o plano em código da análise antes da primeira escrita.

## Implementação profunda de uma única task

1. Transforme cada item do critério em uma prova verificável.
2. Em task técnica, execute o RED ou registre o baseline equivalente antes da correção. No Skip,
   que não tem executor de testes, o RED é o teste de mesa contra o código atual. Em task não
   técnica, defina a evidência observável equivalente.
3. Implemente o menor recorte completo que satisfaz a SPEC, pela edição cirúrgica de
   `construir-codigo`. Reutilize o que existe, respeite os padrões do repositório e não comece
   outra task antes de esta terminar.
4. Trate explicitamente entradas inválidas, caminhos de erro, perda de dados, segurança,
   acessibilidade e LGPD quando aplicáveis. Essas áreas não podem ser “simplificadas”.
5. Rode GREEN, regressão, build, lint, checagem de tipos e testes relevantes que o projeto
   oferecer; no Skip, o QA do `skip_project_apply_changes` é o compilador (seção 4 de
   `construir-codigo`). Não esconda falhas com valores padrão, `catch` vazio, `|| true` ou remoção
   de testes.
6. Inspecione o diff contra a task: releia cada arquivo alterado com o checklist de revisão e,
   em task com tela, com o checklist de UI. Mudança sem vínculo com critério ou TDD deve ser
   removida ou registrada como impedimento, não justificada como melhoria extra.
7. Registre comandos, resultados e limitações reais. Ausência de ferramenta ou acesso não é PASS.

## Entrega: publicar com prova

Com as verificações aprovadas, rode `../publicar-e-sincronizar/SKILL.md` em modo `entregar`:
aplica, publica, prova e grava a plataforma e o espelho no repositório local. O envio ao GitHub
fica para a parada. Registre no estado `verificacao_automatica: passou` com resumo.

- Publicação não provada: estado `em_correcao` ou `bloqueada`. É impedimento: devolva ao
  SkillMind, que para e explica ao cliente o que não foi ao ar e por quê. Nunca peça teste sobre
  uma versão que não está no ar.
- Falha automática que `construir-codigo` não resolveu em três ciclos: nada é publicado, a task
  fica em `em_correcao` com o motivo registrado e o SkillMind para com o impedimento explicado.

## Decidir o teste

Com a publicação provada, aplique a regra da memória (“Quando pedir teste ao cliente”) e grave o
resultado no estado:

1. **Caso crítico** da regra: acrescente o ID em `aguardando_teste`, etapa
   `aguardando_teste_humano`, e monte o roteiro só do ponto crítico. O SkillMind para.
2. **Última task da SPEC** (`## Tasks vinculadas` toda no ar): acrescente o ID em
   `aguardando_teste`, etapa `aguardando_teste_humano`, e monte o roteiro da SPEC inteira. O
   SkillMind para.
3. **SPEC sem nada para o cliente ver ou usar** (só estrutura do banco, regra de acesso ou
   automação interna): `teste_humano: nao_aplicavel:<prova>`, com a prova automática (verificação
   do Skip, teste de mesa, leitura da configuração). O SkillMind segue para `concluir-task`.
4. **Qualquer outro caso**, inclusive tela nova pronta: acrescente o ID em `aguardando_teste`,
   `teste_humano: pendente`, e grave na análise os passos de teste desta task. O SkillMind segue
   com a próxima task.

### Roteiro de teste

Um roteiro só: no fim da SPEC, para todas as tasks dela em `aguardando_teste`, pelo critério de
aceite da SPEC; no caso crítico, só para a task crítica. Em linguagem simples:

- o que mudou, do ponto de vista de quem usa o sistema;
- que já está no ar, com o endereço; que ficou salvo no GitHub entra depois do envio da parada (ou
  o aviso de que o envio está pendente);
- o que o sistema já conferiu sozinho, em uma linha;
- passos numerados para testar o caminho real na URL de produção (para o cliente, “o endereço do
  sistema”); em task com tela, siga o roteiro da seção 5 de `../ui-ux-sistemas/SKILL.md`;
- o que deve aparecer em cada passo e como perceber que algo deu errado;
- o fechamento: “Faça esse teste e me diga se funcionou ou o que apareceu de diferente.”

Nunca chame `concluir-task` para uma task que espera teste do cliente. Não pergunte se pode
seguir para a próxima task: quem decide a parada é o SkillMind.
