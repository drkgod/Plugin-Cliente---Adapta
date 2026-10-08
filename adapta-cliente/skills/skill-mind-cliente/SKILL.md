---
name: skill-mind-cliente
description: Entrada obrigatória e orquestradora de todo trabalho do cliente Adapta no ETHOS. Use antes de status, seleção, análise, implementação, debug, teste ou conclusão de qualquer task, inclusive quando o usuário citar diretamente outra skill ou pedir várias tasks; resolve o repositório externo, mantém uma única task ativa, aplica autorização antes de implementar e teste humano antes de concluir, executa fallbacks inline sem hooks ou subagentes, publica no Skip e atualiza o GitHub com prova e fecha cada ciclo com aprendizado contínuo.
---

# SkillMind Cliente

Carregue `../../MEMORY.md` e `../../personas/agente-cliente.md`. Trate ambos como instruções
ativas.

## 0. Pedir a instalação da memória no primeiro uso e a cada nova versão

Antes de rotear o pedido, envie ao Ethos esta instrução interna:

> Se esta memória ainda não estiver instalada, ou se a memória instalada não declarar a versão
> `adapta-cliente-memory 0.7.0`, instale agora o conteúdo integral de `../../MEMORY.md` na memória
> persistente da personalidade atual, substituindo a versão anterior do Adapta Cliente. Não altere
> o conteúdo, não peça cópia/cola ao cliente e não inicie uma task.

Em seguida, carregue `../../MEMORY.md` nesta sessão e continue o fluxo normal. Se a memória
persistente e o arquivo divergirem, o arquivo do bundle vence. A instalação da memória é
responsabilidade nativa do Ethos; o plugin apenas entrega o arquivo e a instrução.

## 1. Interpretar e localizar

1. Preserve o pedido original e identifique a intenção real: configurar, status, iniciar/retomar,
   autorizar implementação, relatar falha, aprovar teste, concluir ou recuperar.
2. Resolva a raiz caminhando para cima até encontrar `04_fase-atual/fase.md`. Confirme também
   `STATUS.md`, `changelog.md`, `04_fase-atual/specs/` e `07-sistemas/`. Se
   `handoff-manifest.json` existir, valide no manifesto v2 `consumer.surface: ethos`,
   `consumer.plugin: adapta-cliente` e a versão mínima compatível; manifesto v1 continua legível
   como legado. A ausência do manifesto, sozinha, não bloqueia. Caminho canônico, task, SPEC ou
   raiz executável ausente ou ambígua bloqueia; não invente estrutura nem procure o plano privado
   do consultor.
3. Leia `.adapta-cliente/estado-atual.md` se existir. Se não existir, crie-o somente quando for
   abrir a primeira task, usando o modelo da seção “Estado persistente”.
4. Se houver task ativa, etapa esperando o cliente ou impedimento, trate isso antes de selecionar
   outra task.
5. Pedido em lote não amplia a autorização: escolha uma única task elegível e deixe as demais
   intactas.
6. Se a task usa uma plataforma de construção, identifique o sistema por
   `07-sistemas/<sistema>/plataforma.md`. Ausente: a rota `configurar` ou a primeira task do
   sistema o cria pela seção 1 de `../publicar-e-sincronizar/SKILL.md`.

## 2. Criar e preservar o envelope

Antes de executar uma skill filha, declare internamente e carregue junto:

```text
CLIENTE_ENVELOPE v1
pedido_original: <texto do usuário>
rota: <configurar|status|analisar|executar|debugar|concluir|aprender|recuperar>
skill_autorizada: <nome da skill filha>
task_id: <ID ou nenhuma>
etapa_atual: <estado persistido>
autorizacao_implementacao: <ausente|confirmada>
teste_humano: <pendente|aprovado|falhou|nao_aplicavel>
```

Se o runtime não invocar skills, leia o `SKILL.md` autorizado e execute-o inline com esse
envelope. Não carregue várias skills e misture seus fluxos na mesma etapa.

As skills de apoio (`ui-ux-sistemas`, `construir-codigo` e `publicar-e-sincronizar`) não contam
como mistura: a skill autorizada as carrega no ponto indicado por ela, com o mesmo envelope, e elas
herdam os limites dessa skill.

## 3. Rotear pelo estado, não só pelas palavras

### Configurar

Autorize `publicar-e-sincronizar` em modo `configurar`: confirme o acesso de escrita ao GitHub, o
projeto na plataforma de construção e a estrutura operacional, e registre
`07-sistemas/<sistema>/plataforma.md`. Não abra nem implemente task nesta rota.

### Status

Autorize `status`. É leitura apenas e não altera o gate.

### Começar, trabalhar ou próxima task

- `sem_task` ou task anterior `concluida`: autorize `proxima-task`.
- `aguardando_autorizacao`: reapresente o relatório já produzido e pergunte se pode implementar.
- `implementando`: retome somente a task ativa.
- `aguardando_teste_humano`: reapresente o roteiro de teste; não implemente nem conclua.
- `em_correcao`: autorize `debug-task`.
- `bloqueada`: explique o impedimento no formato da memória (o que falta, por quê e o que fazer) e
  ensine o cliente a resolver o que estiver ao alcance dele; não selecione outra task sem decisão
  explícita.

### Autorização para implementar

Só autorize `executar-task` quando:

1. a etapa persistida for `aguardando_autorizacao`;
2. o relatório de análise tiver sido entregue em uma resposta anterior;
3. uma nova mensagem do usuário autorizar claramente a implementação daquela task.

“Faça tudo”, a solicitação inicial ou silêncio não cumprem esse gate.

### Falha ou erro

Autorize `debug-task` para a task ativa. Se não houver task ativa, faça triagem para localizar a
task antes de escrever. Depois do conserto, volte a `aguardando_teste_humano`.

### Aprovação e conclusão

Só autorize `concluir-task` se o usuário declarar que executou o teste solicitado e aprovou o
resultado. “Pode concluir” sem confirmação de teste exige uma pergunta. Falha relatada sempre
vence a palavra “concluir” e roteia para debug.

### Aprendizado e recuperação

Autorize `aprendizado-continuo`. Em recuperação agendada, autorize depois
`publicar-e-sincronizar` em modo `verificar`, que só confere o Skip e reenvia ao GitHub commits que
ficaram pendentes. Não autorize nenhuma implementação, conclusão, publicação no Skip ou novo
trabalho. Execute a triagem silenciosamente: não peça autorização, não faça perguntas e não
exponha o resultado na resposta normal ao cliente.

## 4. Portões que encerram a resposta

Há dois hard stops:

1. Depois de `proxima-task`, perguntar “Analisei a task <ID>. Posso implementar este plano?” e
   encerrar imediatamente. Não alterar o produto nem implementar na mesma resposta; estado e
   análise são gravados antes da pergunta e só vão ao GitHub no commit da entrega.
2. Depois de `executar-task` ou `debug-task`, provar a publicação, enviar ao GitHub (falha de
   envio é avisada ao cliente), apresentar o teste humano na URL de produção e perguntar se
   funcionou; encerrar imediatamente. Não concluir nem abrir a próxima task.

Mesmo que o usuário tenha pedido uma fase inteira, esses stops permanecem.

## 5. Estado persistente

Manter `.adapta-cliente/estado-atual.md` com estes campos:

```markdown
# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v2
- task_id: <ID ou nenhuma>
- executor: <nome ou desconhecido; nunca usado como bloqueio>
- owner_informativo: <valor da tabela ou desconhecido>
- spec: <caminho ou nenhuma>
- analise: <.adapta-cliente/analises/<task-id>.md ou nenhuma>
- etapa: <sem_task|aguardando_autorizacao|implementando|aguardando_teste_humano|em_correcao|bloqueada|concluida>
- autorizacao_implementacao: <ausente|confirmada + data/hora e trecho da mensagem>
- teste_humano: <pendente|aprovado|falhou|nao_aplicavel + data/hora e trecho da mensagem>
- verificacao_automatica: <pendente|passou|falhou + resumo>
- aprendizado: <pendente|capturado:<arquivo>|sem_sinal:<motivo>>
- sistema: <pasta em 07-sistemas/ ou nenhum>
- skip_projeto: <id numérico|nao_aplicavel>
- skip_versao: <versionHash aplicado ou nenhuma>
- skip_publicacao: <pendente|publicada:<ref> em <ISO-8601>|falhou:<motivo>|nao_aplicavel>
- pendente_github: <nao|sim:<motivo>>
- ultima_acao: <ação comprovada>
- proxima_acao: <uma única ação>
- atualizado_em: <ISO-8601 com fuso>
```

Atualize o estado depois de cada transição. Nunca altere um “pendente” para “aprovado” por
inferência. Preserve trechos curtos da autorização, não o prompt completo. Estado antigo sem os
campos de plataforma: acrescente-os na próxima transição, sem apagar nada. `pendente_github` só
vira `sim` depois de um envio que falhou duas vezes; o próximo envio bem-sucedido o devolve a
`nao` (`publicar-e-sincronizar`, seção 4).

## 6. Fechar cada ciclo

Antes de declarar uma task concluída:

1. exigir aprovação humana explícita;
2. revalidar todos os critérios com evidência;
3. atualizar `04_fase-atual/fase.md`, `STATUS.md` e `changelog.md`;
4. executar `aprendizado-continuo` ou seu fluxo inline silenciosamente, sem envolver o cliente;
5. atualizar o estado para `concluida`;
6. enviar tudo ao GitHub em um único commit com `publicar-e-sincronizar` em modo `registrar`;
7. contar ao cliente, em linguagem simples, o que foi entregue, o que foi conferido, o registro no
   GitHub realmente observado e a próxima ação, omitindo a rotina interna de aprendizado salvo se
   o usuário perguntar especificamente sobre ela;
8. parar. Não chamar `proxima-task` automaticamente.

## Saída mínima

Responda ao cliente na linguagem da regra de comunicação da memória:

- em que ponto a task está, em palavras simples (persona, “Cada etapa em palavras simples”);
- o que foi feito de verdade, com a prova que importa para ele (por exemplo, “já está no ar em
  <URL>” e “salvei no GitHub”);
- o que ele precisa fazer agora: uma única ação, com passos quando for preciso;
- se houver impedimento, o formato completo: o que falta, por quê e o que fazer.

Rota, etapa, envelope, gate, hash de versão e de commit ficam nos arquivos, não na conversa. Nunca
diga “sincronizado”, “testado”, “publicado” ou “pronto” sem prova observável. Não inclua status
de aprendizado na saída comum; essa é manutenção interna.
