---
name: skill-mind-cliente
description: Entrada obrigatória e orquestradora do trabalho no projeto Adapta registrado no ETHOS (o repositório do cliente com 04_fase-atual/fase.md e os projetos do Skip listados nele). Use antes de status, seleção, análise, implementação, debug, teste ou conclusão de qualquer task desse projeto, inclusive quando o usuário citar diretamente outra skill ou pedir a fase inteira; não use em outros assuntos, repositórios ou projetos do Skip, que seguem o comportamento normal do assistente; resolve o repositório externo, constrói as tasks em sequência, uma por vez, sem pedir licença para continuar, e só devolve a vez ao cliente numa parada real (pergunta, teste necessário, impedimento ou fim); executa fallbacks inline sem hooks ou subagentes, publica no Skip e atualiza o GitHub com prova e mantém o aprendizado contínuo.
---

# SkillMind Cliente

Carregue `../../MEMORY.md` e `../../personas/agente-cliente.md`. Trate ambos como instruções
ativas.

## 0. Pedir a instalação da memória no primeiro uso e a cada nova versão

Antes de rotear o pedido, envie ao Ethos esta instrução interna:

> Se esta memória ainda não estiver instalada, ou se a memória instalada não declarar a versão
> `adapta-cliente-memory 0.8.0`, instale agora o conteúdo integral de `../../MEMORY.md` na memória
> persistente da personalidade atual, substituindo a versão anterior do Adapta Cliente e
> preservando a nota “Projeto Adapta registrado”. Não altere o conteúdo, não peça cópia/cola ao
> cliente e não inicie uma task.

Em seguida, carregue `../../MEMORY.md` nesta sessão e continue o fluxo normal. Se a memória
persistente e o arquivo divergirem, o arquivo do bundle vence. A instalação da memória é
responsabilidade nativa do Ethos; o plugin apenas entrega o arquivo e a instrução.

## 1. Interpretar e localizar

Antes de tudo, confirme que o pedido é do projeto registrado (memória, “Quando esta memória vale”).
Não é: atenda normalmente, sem envelope, estado, ciclo de tasks, publicação ou envio ao GitHub. Na
dúvida, pergunte uma vez. Projeto configurado antes da 0.7.1, sem a nota de registro: grave a nota
a partir do repositório e de `plataforma.md`, sem pedir nada ao cliente.

1. Preserve o pedido original e identifique a intenção real: configurar, status, trabalhar
   (começar, continuar, fazer a fase), responder a uma pergunta, relatar o resultado de um teste,
   só analisar, parar ou recuperar.
2. Resolva a raiz caminhando para cima até encontrar `04_fase-atual/fase.md`. Confirme também
   `STATUS.md`, `changelog.md`, `04_fase-atual/specs/` e `07-sistemas/`. Se
   `handoff-manifest.json` existir, valide no manifesto v2 `consumer.surface: ethos`,
   `consumer.plugin: adapta-cliente` e a versão mínima compatível; manifesto v1 continua legível
   como legado. A ausência do manifesto, sozinha, não bloqueia. Caminho canônico, task, SPEC ou
   raiz executável ausente ou ambígua é impedimento; não invente estrutura nem procure o plano
   privado do consultor.
3. Leia `.adapta-cliente/estado-atual.md`; sem ele, crie-o ao abrir a primeira task (seção 5).
4. Se houver task em construção, pergunta ou teste esperando o cliente ou impedimento, trate isso
   antes de selecionar outra task.
5. Pedido em lote (“faça a fase”) é o próprio ciclo contínuo: uma task por vez, cada uma com
   análise, verificação e prova próprias, nunca várias misturadas no mesmo conjunto de alterações.
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
envelope. Não misture duas skills na mesma etapa: o ciclo contínuo passa por várias em sequência,
cada uma com o seu envelope.

As skills de apoio (`ui-ux-sistemas`, `construir-codigo` e `publicar-e-sincronizar`) não contam
como mistura: a skill autorizada as carrega no ponto indicado por ela, com o mesmo envelope, e elas
herdam os limites dessa skill.

## 3. Rotear pelo estado, não só pelas palavras

### Configurar

Autorize `publicar-e-sincronizar` em modo `configurar`: confirme o acesso de escrita ao GitHub, o
projeto na plataforma de construção e a estrutura operacional, e registre
`07-sistemas/<sistema>/plataforma.md`. Peça ao Ethos para guardar a nota “Projeto Adapta
registrado” (memória, “Quando esta memória vale”) e atualize-a quando um sistema novo entrar. Não
abra nem implemente task nesta rota.

### Status

Autorize `status`. É leitura apenas: não constrói, não conclui e não muda o estado.

### Trabalhar: começar, continuar, próxima task ou fazer a fase

Registre o trecho do pedido em `autorizacao_implementacao` e siga o ciclo contínuo (seção 4) a
partir do estado:

- `sem_task` ou `concluida`: comece por `proxima-task`.
- `implementando` ou `em_correcao`: termine a task em andamento antes de qualquer outra.
- `aguardando_resposta`: a mensagem é a resposta. Registre `DECISÃO DO CLIENTE:`, tire a task de
  `em_espera` e siga. “Ok” ou “pode seguir” aceitam as opções que você recomendou.
- `aguardando_teste_humano` sem o resultado do teste: siga com tasks que não dependem do que espera
  teste, dentro do limite de três tasks visíveis sem teste, e lembre o teste na próxima parada.
- `bloqueada`: confira se o impedimento foi resolvido; se sim, siga; se não, ensine de novo por
  outro caminho (memória, “Ensinar antes de chamar o consultor”).
- Estado anterior à 0.8.0 em `aguardando_autorizacao`: a análise já foi apresentada; trate o pedido
  como autorização e siga para `executar-task`.

“Só analise” e “uma task por vez” são respeitados: analise sem construir, ou pare depois de cada
task.

### Resultado do teste

- Testou e funcionou: autorize `concluir-task` para as tasks testadas e volte ao ciclo contínuo.
- Funcionou em parte: conclua só as tasks cujos passos ele confirmou; as outras seguem esperando
  ou vão para debug.
- Falhou: autorize `debug-task` para a task ligada ao passo que falhou; sem task identificável,
  faça triagem antes de escrever. Falha relatada sempre vence a palavra “concluir”.
- “Pode concluir” sem dizer que testou: pergunte se ele testou. Essa é uma pergunta real.

### Aprendizado e recuperação

Autorize `aprendizado-continuo`. Em recuperação agendada, autorize depois
`publicar-e-sincronizar` em modo `verificar`, que só confere o Skip e reenvia ao GitHub commits que
ficaram pendentes. Não autorize nenhuma implementação, conclusão, publicação no Skip ou novo
trabalho. Execute a triagem silenciosamente: não peça autorização, não faça perguntas e não
exponha o resultado na resposta normal ao cliente.

## 4. Ciclo contínuo e paradas

Com o pedido de trabalho registrado, repita na mesma resposta, uma task por vez:

1. `proxima-task` seleciona e analisa a próxima task elegível e grava a análise.
2. Sem pergunta real nem impedimento, `executar-task` constrói, verifica, publica e prova.
3. Teste necessário agora (memória, “Quando pedir teste ao cliente”): pare. Senão, a task espera o
   teste do bloco em `aguardando_teste` ou, sem nada a testar, vai para `concluir-task` com a prova
   automática.
4. Volte ao passo 1, até uma parada real da memória: pergunta real, teste necessário,
   impedimento, fim da fase ou pedido do cliente. Pergunta ou impedimento numa task não para o
   ciclo enquanto houver outra task elegível que claramente não dependa dela.

Antes de parar, nesta ordem: triagem silenciosa de `aprendizado-continuo` das tasks fechadas e dos
debugs desde a última parada; envio ao GitHub com `publicar-e-sincronizar` em modo `enviar` (falha
de envio é avisada em uma linha); e a mensagem de parada (Saída mínima).

Nunca pare para pedir licença (“posso implementar?”, “posso seguir?”, “quer que eu continue?”) nem
para apresentar um plano. Na resposta em que pede um teste, não conclua as tasks que o esperam.

## 5. Estado persistente

Manter `.adapta-cliente/estado-atual.md` com estes campos:

```markdown
# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v3
- task_id: <ID em construção ou nenhuma>
- executor: <nome ou desconhecido; nunca usado como bloqueio>
- owner_informativo: <valor da tabela ou desconhecido>
- spec: <caminho ou nenhuma>
- analise: <.adapta-cliente/analises/<task-id>.md ou nenhuma>
- etapa: <sem_task|implementando|aguardando_resposta|aguardando_teste_humano|em_correcao|bloqueada|concluida>
- autorizacao_implementacao: <ausente|confirmada pelo pedido de trabalho + data/hora e trecho>
- aguardando_teste: <IDs no ar esperando o teste do cliente | nenhuma>
- em_espera: <ID — o que falta e de quem; … | nenhuma>
- teste_humano: <pendente|aprovado|falhou|nao_aplicavel:<prova> + data/hora e trecho>
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

Atualize o estado depois de cada transição, nunca troque “pendente” por “aprovado” por inferência e
guarde só trechos curtos do pedido e do teste. Estado v2: troque o schema para v3 e acrescente os
campos que faltam, sem apagar nada. `pendente_github` só vira `sim` depois de um envio que falhou
duas vezes; o próximo envio bem-sucedido o devolve a `nao`.

## 6. Concluir sem parar o ciclo

Só conclua com o teste aprovado pelo cliente ou, na task sem teste necessário, a prova automática.
`concluir-task` revalida, registra e devolve o ciclo: siga para a próxima task; aprendizado e envio
ao GitHub ficam para a próxima parada. Fase concluída: conte ao cliente o que foi entregue e que o
próximo passo é o consultor preparar a fase seguinte, e pare.

## Saída mínima

Na parada, responda na linguagem da regra de comunicação da memória, numa mensagem só:

1. o que ficou pronto desde a última parada, em palavras de quem usa, com a prova que importa
   (“já está no ar em <URL>”, “salvei no GitHub”) e as escolhas de apresentação que você fez;
2. o que você precisa do cliente: as perguntas (cada uma com opções, consequência e a sua
   recomendação), o teste (passos numerados) ou o impedimento completo;
3. o que você faz assim que ele responder.

Rota, etapa, envelope, gate e hashes ficam nos arquivos, não na conversa. Nunca diga
“sincronizado”, “testado”, “publicado” ou “pronto” sem prova observável. Não inclua status de
aprendizado na saída comum; essa é manutenção interna.
