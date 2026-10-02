---
name: skill-mind-cliente
description: Entrada obrigatória de todo trabalho do cliente; resolve modo padrão ou autônomo, mantém uma task ativa, aplica o teste humano dos validadores por task e fecha cada ciclo com aprendizado contínuo.
---

# SkillMind Cliente

Carregue `../../MEMORY.md` e `../../personas/agente-cliente.md`. Trate ambos como instruções
ativas. Este fluxo precisa funcionar sem hook, contrato, script auxiliar, chamada aninhada ou
subagente.

## 1. Interpretar e localizar

1. Preserve o pedido original e identifique a intenção real: status, iniciar/retomar, autorizar
   implementação, relatar falha, aprovar teste, concluir ou recuperar aprendizado.
2. Resolva a raiz caminhando para cima até encontrar `04_fase-atual/fase.md`. Confirme também
   `STATUS.md`, `changelog.md` e `04_fase-atual/specs/`. Ausência de item obrigatório é bloqueio;
   não invente estrutura nem procure o plano privado do consultor.
   Leia `01_projeto/constituicao.md` para o modo de execução e a lista de validadores. Se não
   declarar modo autônomo, preserve o modo padrão de autorização prévia.
3. Leia `.adapta-cliente/estado-atual.md` se existir. Se não existir, crie-o somente quando for
   abrir a primeira task, usando o modelo da seção “Estado persistente”.
4. Se houver task ativa, gate pendente ou bloqueio, trate isso antes de selecionar outra task.
5. Pedido em lote não amplia a autorização: escolha uma única task elegível e deixe as demais
   intactas.

## 2. Criar e preservar o envelope

Antes de executar uma skill filha, declare internamente e carregue junto:

```text
CLIENTE_ENVELOPE v1
pedido_original: <texto do usuário>
rota: <status|analisar|executar|debugar|concluir|aprender|recuperar>
skill_autorizada: <nome da skill filha>
task_id: <ID ou nenhuma>
etapa_atual: <estado persistido>
modo_execucao: <padrao|autonomo>
autorizacao_implementacao: <ausente|confirmada>
teste_humano: <pendente|aprovado|falhou por validador>
```

Se o runtime não invocar skills, leia o `SKILL.md` autorizado e execute-o inline com esse
envelope. Não carregue várias skills e misture seus fluxos na mesma etapa.

## 3. Rotear pelo estado, não só pelas palavras

### Status

Autorize `status`. É leitura apenas e não altera o gate.

### Começar, trabalhar ou próxima task

- `sem_task` ou task anterior `concluida`: autorize `proxima-task`.
- `em_analise`: retome a task_id já registrada e autorize `proxima-task`; a coleta de resposta
  anterior do chat faz parte da análise, sem selecionar outra task.
- `pronta_para_implementar` no modo autônomo: autorize `executar-task` para a mesma task sem
  autorização prévia; não abra outra.
- `aguardando_autorizacao`: reapresente o relatório já produzido e pergunte se pode implementar.
- `implementando`: retome somente a task ativa.
- `aguardando_teste_humano`: registre confirmações recebidas, apresente o teste básico apenas aos
  validadores ainda pendentes; não implemente nem conclua antes de todos aprovarem.
- `em_correcao`: autorize `debug-task`.
- `bloqueada`: mostre a trava e o responsável; não selecione outra sem decisão explícita.

### Autorização para implementar

No modo padrão, só autorize `executar-task` quando:

1. a etapa persistida for `aguardando_autorizacao`;
2. o relatório de análise tiver sido entregue em uma resposta anterior;
3. uma nova mensagem do usuário autorizar claramente a implementação daquela task.

No **modo autônomo por task**, a fase aprovada é a autorização de execução: `proxima-task`
analisa, persiste `pronta_para_implementar` e encaminha a mesma task a `executar-task` na mesma
interação, sem autorização prévia por task. Se faltar decisão de produto, consulte o histórico
do chat e depois o champion; não peça escolha técnica ao cliente.

No modo padrão, “faça tudo”, a solicitação inicial ou silêncio não cumprem esse gate. Em ambos os
modos, um pedido em lote não dispensa o teste humano nem abre a próxima task automaticamente.

### Falha ou erro

Autorize `debug-task` para a task ativa. Se não houver task ativa, faça triagem para localizar a
task antes de escrever. Depois do conserto, volte a `aguardando_teste_humano`.

### Aprovação e conclusão

Só autorize `concluir-task` depois que todos os validadores listados na constituição declararem
que executaram o teste básico e aprovaram. Confirmações podem chegar em mensagens distintas;
registre as recebidas e aguarde as demais. “Pode concluir” sem teste exige uma pergunta. Falha
relatada sempre vence a palavra “concluir” e roteia para debug.

### Aprendizado e recuperação

Autorize `aprendizado-continuo`. Em recuperação agendada, não autorize nenhuma implementação,
conclusão, publicação ou novo trabalho. Execute a triagem silenciosamente: não peça autorização,
não faça perguntas e não exponha o resultado na resposta normal ao cliente.

## 4. Portões que encerram a resposta

No modo padrão há dois hard stops; no modo autônomo apenas o segundo:

1. No modo padrão, depois de `proxima-task`, perguntar “Analisei a task <ID>. Posso implementar este plano?” e
   encerrar imediatamente. No modo autônomo, analisar e implementar a mesma task sem esse stop.
2. Depois de `executar-task` ou `debug-task`, apresentar o teste básico aos validadores e perguntar se funcionou;
   encerrar imediatamente. Não concluir nem abrir a próxima task.

Mesmo que o usuário tenha pedido uma fase inteira, esses stops permanecem.

## 5. Estado persistente

Manter `.adapta-cliente/estado-atual.md` com exatamente estes campos:

```markdown
# Estado atual — Adapta Cliente

- task_id: <ID ou nenhuma>
- champion: <nome ou desconhecido>
- modo_execucao: <padrao|autonomo>
- validadores: <nomes definidos na constituição>
- spec: <caminho ou nenhuma>
- etapa: <sem_task|em_analise|aguardando_autorizacao|pronta_para_implementar|implementando|aguardando_teste_humano|em_correcao|bloqueada|concluida>
- autorizacao_implementacao: <ausente|confirmada + data/hora e trecho da mensagem>
- teste_humano: <estado por validador + data/hora e trecho de cada mensagem>
- verificacao_automatica: <pendente|passou|falhou + resumo>
- aprendizado: <pendente|capturado:<arquivo>|sem_sinal:<motivo>>
- ultima_acao: <ação comprovada>
- proxima_acao: <uma única ação>
- atualizado_em: <ISO-8601 com fuso>
```

Atualize o estado depois de cada transição. Nunca altere um “pendente” para “aprovado” por
inferência. Preserve trechos curtos da autorização, não o prompt completo.

## 6. Fechar cada ciclo

Antes de declarar uma task concluída:

1. exigir aprovação explícita de todos os validadores designados para o teste básico;
2. revalidar todos os critérios com evidência;
3. atualizar `04_fase-atual/fase.md`, `STATUS.md` e `changelog.md`;
4. executar `aprendizado-continuo` ou seu fluxo inline silenciosamente, sem envolver o cliente;
5. atualizar o estado para `concluida`;
6. informar arquivos, provas, sincronização realmente observada e próxima ação, omitindo a rotina
   interna de aprendizado salvo se o usuário perguntar especificamente sobre ela;
7. parar. Não chamar `proxima-task` automaticamente.

O consultor valida o conjunto no fim da fase, não cada task. O aceite dos validadores fecha a
task, mas não libera sozinho a fase seguinte.

## Saída mínima

Informe: rota escolhida, task ativa, etapa atual, ações realmente feitas, evidências, gate
pendente e uma única próxima ação. Nunca diga “sincronizado”, “testado”, “publicado” ou “pronto”
sem prova observável. Não inclua status de aprendizado na saída comum; essa é manutenção interna.
