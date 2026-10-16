# Migração 0.8.0 — construir a fase sem parar à toa

Vale só para a edição Ethos: `adapta-cliente` 0.8.0. A edição Codex (`adapta-cliente-codex` 0.3.1)
continua com análise e autorização separadas por task.

## Antes

- cada task tinha dois pontos de parada obrigatórios: depois da análise (“Posso implementar este
  plano?”) e depois da entrega (teste humano), e o cliente precisava responder em uma nova mensagem
  para cada um;
- depois de concluir, o agente parava e só abria a próxima task com um pedido novo;
- “faça a fase inteira” não mudava nada: continuava uma task por pedido;
- o teste humano era pedido a cada task, inclusive em mudança sem nada para o cliente ver;
- o GitHub recebia um commit na entrega e outro na conclusão de cada task.

## Agora

- **Ciclo contínuo.** “Começar”, “trabalhar”, “continuar” ou “fazer a fase” autoriza construir as
  tasks elegíveis em sequência, uma por vez e sempre dentro da SPEC. Cada task continua com análise
  gravada, verificação, publicação provada no Skip e prova próprias.
- **Paradas reais.** O agente só devolve a vez ao cliente quando precisa dele: pergunta real
  (detalhe de negócio que a SPEC não define, acesso, ação de risco), teste necessário,
  impedimento, fim da fase ou pedido do cliente para parar. Nunca termina pedindo licença.
- **Perguntas juntas e com recomendação.** No máximo cinco por parada, cada uma com opções,
  consequência e a recomendação do agente; “pode seguir com as recomendações” responde todas.
  Detalhe de apresentação não vira pergunta: o agente decide pelo catálogo de UI e conta o que
  escolheu.
- **Pergunta numa task não trava as outras.** A task fica `em_espera` e o agente segue com as que
  não dependem dela; a pergunta vai na parada.
- **Teste do cliente nos momentos certos.** Ao fechar um bloco (uma tela ou um fluxo pronto de
  ponta a ponta), com três tasks visíveis no ar sem teste, antes de depender de serviço externo,
  quando muda algo que a equipe já usa, quando a SPEC pede aprovação ou quando o agente vai parar
  de qualquer jeito. Um roteiro só cobre o bloco inteiro; depois de uma correção, o reteste é só do
  que falhou.
- **Conclusão pela prova automática.** Task sem nada para o cliente ver ou usar, fora de um bloco,
  fecha com a verificação do Skip, o teste de mesa e a leitura da configuração
  (`teste_humano: nao_aplicavel:<prova>`).
- **GitHub uma vez por parada.** Entre uma task e outra não há envio: tudo vai num único commit
  antes de devolver a vez ao cliente. Sem repositório local (só o conector do GitHub), um commit
  por task entregue ou concluída.
- **Aprendizado uma vez por parada**, silencioso, cobrindo as tasks fechadas e os debugs desde a
  última.
- “Só analise”, “uma task por vez” e “pare” continuam respeitados.

## Compatibilidade

- Estado `adapta-cliente-state/v3`, com `aguardando_teste` (tasks no ar esperando o teste) e
  `em_espera` (tasks esperando resposta, acesso ou o consultor). Estado v2 é atualizado na próxima
  transição, sem apagar nada.
- Projeto parado em `aguardando_autorizacao` da versão anterior: a análise já foi apresentada, e o
  próximo pedido de trabalho vale como autorização para construir.
- `publicar-e-sincronizar` ganhou o modo `enviar` (SkillMind, antes de cada parada); `entregar` e
  `registrar` não enviam mais ao GitHub.
- Memória `adapta-cliente-memory 0.8.0`, substituída sozinha no próximo uso, preservando a nota de
  registro do projeto.

## Ajuste 0.8.1 — teste por SPEC

Na 0.8.0, o teste era pedido ao fechar cada tela ou fluxo pronto e a cada três tasks visíveis no
ar. Quando cada task entregava uma tela inteira, o agente parava quase task por task. Agora:

- o teste do cliente é por SPEC: o agente constrói todas as tasks de `## Tasks vinculadas` e pede
  um roteiro só, pelo critério de aceite da SPEC;
- antes de a SPEC terminar, só em caso crítico: mudança no que a equipe já usa (dados
  existentes, permissões, fluxo em uso), integração com o mundo real de que as próximas tasks
  dependem, ou aprovação que a SPEC exige antes de seguir; o roteiro testa só o ponto crítico;
- tela nova pronta, várias tasks no ar ou uma parada por outro motivo não pedem teste;
- até o teste, cada task entregue espera em `aguardando_teste`; SPEC sem nada para o cliente ver
  fecha pela prova automática;
- SPEC parada só por uma task em `em_espera`: o teste do que já está pronto vai na mesma parada da
  pergunta;
- memória `adapta-cliente-memory 0.8.1`, substituída sozinha no próximo uso.

## Exemplo

Antes, três mensagens do cliente por task:

> Analisei a task 2.1 e ainda não implementei nada. Posso implementar este plano?

Agora, uma mensagem na parada, depois de várias tasks:

> Pronto desde a última conversa:
> - cadastro de clientes e lista com busca — já está no ar em <endereço> e salvo no GitHub;
> - escolhi mostrar 20 clientes por página, para a lista abrir rápido no celular.
>
> Preciso de você:
> 1. abra <endereço>/clientes, cadastre um cliente real e confira se ele aparece na lista;
> 2. busque pelo nome dele e confira se aparece só ele.
>
> Assim que você me disser se funcionou, eu sigo com a tela de pedidos.
