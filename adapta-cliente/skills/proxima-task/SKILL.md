---
name: proxima-task
description: Seleciona a próxima task elegível da fase atual, inspeciona a fundo sua SPEC e o estado real do projeto, grava a análise e, sem pergunta real nem impedimento, passa a task para executar-task na mesma resposta, sem pedir licença ao cliente. Use pelo SkillMind Cliente no ciclo contínuo, quando o usuário disser “trabalhar”, “continuar”, “próxima task”, “fazer a fase”, “o que faço agora?” ou quiser começar/retomar.
---

# Analisar a Próxima Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: proxima-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos do produto.

Carregue `../../personas/agente-cliente.md`. Esta skill analisa e prepara; quem constrói é
`executar-task`, logo em seguida, na mesma resposta.

## Seleção

1. Leia `.adapta-cliente/estado-atual.md`, se existir. Task em construção é terminada antes de
   qualquer outra. Com `pendente_github: sim`, faça uma tentativa de envio antes de selecionar
   (`../publicar-e-sincronizar/SKILL.md`, seção 4). Se falhar, não selecione: explique ao cliente
   o impedimento (o último envio ao GitHub não chegou, e por quê) e ensine como resolver.
2. Leia `04_fase-atual/fase.md`. Se houver `<!-- fase-format:2 -->`, considere elegíveis os itens
   `- [ ]` e retome `- [/]`; preserve hierarquia, descrição, metadados e `<!-- id:... -->`. Sem o
   marcador, leia a tabela legada. Se o usuário indicar uma task pendente e elegível, selecione-a;
   caso contrário, escolha a primeira elegível em ordem de leitura cujas dependências estejam
   atendidas, pulando as tasks em `em_espera` e as que dependem delas. Owner/dono é metadado de
   coordenação: nunca filtre, bloqueie ou peça confirmação de identidade por causa dele. Um
   funcionário pode executar uma task atribuída a outro papel sem alterar a SPEC.
3. Confirme pré-condições e dependências. Dependência não atendida não é pulada em silêncio:
   registre a task em `em_espera` e em `STATUS.md` como
   `Impedimento: <o quê> — <por quê> — <próximo passo>`, siga com outra task que não dependa dela
   e, na parada, explique o impedimento no formato da memória, ensinando o que estiver ao alcance
   do cliente.
4. Localize a SPEC em `04_fase-atual/specs/`.
   - SPEC ausente: impedimento, porque a SPEC é publicada pelo consultor; explique isso ao cliente.
   - Detalhe de negócio que a SPEC não define: é pergunta real. Junte as perguntas desta task e,
     quando der, das próximas tasks do mesmo bloco, cada uma com opções, consequência e a sua
     recomendação; a resposta vira `DECISÃO DO CLIENTE:`.
   - Detalhe de apresentação não é pergunta: decida pelo catálogo de
     `../ui-ux-sistemas/SKILL.md`, registre na análise e conte na parada.
   - Conflito que muda escopo ou critério de aceite: `DÚVIDA:` para o consultor, com o contexto
     explicado ao cliente; a task vai para `em_espera`.

## Análise profunda, sem escrita de produto

1. Leia a task, a SPEC inteira, critérios, TDD e arquivos do projeto que seriam afetados.
2. Inspecione a implementação atual, padrões existentes, dependências, testes e mudanças locais.
   Task que altera código, banco ou automação: siga as seções MAPA e PLANO de
   `../construir-codigo/SKILL.md`. Task com tela: produza a Ficha de Tela de
   `../ui-ux-sistemas/SKILL.md`.
3. Quando seguro, execute somente verificações de baseline que não alterem o produto. Registre
   falhas preexistentes separadamente. No Skip, a baseline inclui
   `../publicar-e-sincronizar/SKILL.md` em modo `verificar`: versão no ar igual à atual e nenhuma
   pendência fora da task; divergência entra nos riscos.
4. Percorra a escada de decisão da persona e delimite o menor recorte completo.
5. Produza no arquivo da análise:
   - objetivo e resultado observável;
   - estado atual e erros encontrados;
   - arquivos/componentes provavelmente afetados;
   - plano concreto de implementação, com o plano em código (arquivos, tipos, serviços, regras de
     acesso e teste de mesa) quando houver código;
   - Ficha de Tela de cada tela tocada, quando houver interface;
   - matriz critério → prova;
   - riscos, casos de erro, segurança, acessibilidade e LGPD aplicáveis, inclusive risco de dados
     em migration (migration que apaga ou transforma dados existentes é pergunta real: precisa de
     autorização explícita);
   - perguntas reais e impedimentos, se houver;
   - bloco a que a task pertence e se ela precisa de teste do cliente, e quando (memória, “Quando
     pedir teste ao cliente”), com o roteiro de verificação automática e de teste.
6. Ao cliente, durante o trabalho, só uma linha de progresso: “Começando a task <ID>: <o que muda
   para quem usa>”. O plano em código e a matriz ficam no arquivo; mostre-os só se ele pedir.

## Persistir e seguir

Grave o relatório completo em `.adapta-cliente/analises/<task-id>.md` e registre esse caminho no
estado, com a task, a SPEC, teste humano pendente e aprendizado pendente. `executar-task` nunca
depende da conversa para recuperar o plano.

- Sem pergunta real nem impedimento: estado `implementando`, próxima ação `construir a task <ID>`,
  e o SkillMind autoriza `executar-task` na mesma resposta. Não pergunte se pode implementar e não
  apresente o plano para aprovação.
- Com pergunta real ou impedimento: se houver outra task elegível que claramente não dependa desta,
  registre esta em `em_espera` e siga com a outra; senão, estado `aguardando_resposta` (ou
  `bloqueada`) e o SkillMind para com as perguntas ou o impedimento explicado.
- Pedido do cliente para só analisar: estado `aguardando_resposta`, resumo em linguagem simples (o
  que vai mudar para quem usa, o que ele precisa decidir ou providenciar e como vai ser testado) e
  parada. A construção começa quando ele pedir.

Não envie nada ao GitHub nesta etapa: estado, análise e mapa ficam no repositório local e vão no
envio da próxima parada. Se o runtime só consegue gravar pelo conector do GitHub, eles vão no
commit do fim da task ou da parada (`../publicar-e-sincronizar/SKILL.md`, seção 4), sem reler e
sem reenviar. Nunca altere código, configuração ou conteúdo do produto nesta skill.
