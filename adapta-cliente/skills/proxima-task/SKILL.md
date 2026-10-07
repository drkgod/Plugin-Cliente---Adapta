---
name: proxima-task
description: Seleciona exatamente uma task elegível da fase atual, inspeciona profundamente sua SPEC e o estado real do projeto, apresenta achados, riscos, plano e testes e para antes de implementar. Use pelo SkillMind Cliente quando o usuário disser “trabalhar”, “próxima task”, “o que faço agora?” ou quiser começar/retomar, nunca como autorização de implementação.
---

# Analisar a Próxima Task

## Guarda obrigatória

Exija `CLIENTE_ENVELOPE v1` com `skill_autorizada: proxima-task`. Sem envelope, carregue
`../skill-mind-cliente/SKILL.md`, redirecione o pedido e não altere arquivos do produto.

Carregue `../../personas/agente-cliente.md`. Esta skill analisa e prepara; ela nunca implementa.

## Seleção

1. Leia `.adapta-cliente/estado-atual.md`, se existir. Task ativa, gate ou bloqueio deve ser
   retomado; não abra outra. Com `pendente_github: sim`, faça uma tentativa de envio antes de
   selecionar (`../publicar-e-sincronizar/SKILL.md`, seção 4); se falhar, pare com a trava
   “GitHub desatualizado”.
2. Leia `04_fase-atual/fase.md`. Se houver `<!-- fase-format:2 -->`, considere elegíveis os itens
   `- [ ]` e retome `- [/]`; preserve hierarquia, descrição, metadados e `<!-- id:... -->`. Sem o
   marcador, leia a tabela legada. Se o usuário indicar uma task pendente e elegível, selecione-a;
   caso contrário, escolha a primeira elegível em ordem de leitura cujas dependências estejam
   atendidas. Owner/dono é metadado de coordenação: nunca filtre, bloqueie ou peça confirmação de
   identidade por causa dele. Um funcionário pode executar uma task atribuída a outro papel sem
   alterar a SPEC.
3. Confirme pré-condições e dependências. Não pule uma task bloqueada silenciosamente; mostre a
   trava, o dono da resolução e registre-a em `STATUS.md`/`changelog.md` quando aplicável.
4. Localize a SPEC em `04_fase-atual/specs/`. Ausência, ambiguidade ou conflito material bloqueia
   a implementação e vira `DÚVIDA:` para o consultor.

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
5. Produza:
   - objetivo e resultado observável;
   - estado atual e erros encontrados;
   - arquivos/componentes provavelmente afetados;
   - plano concreto de implementação, com o plano em código (arquivos, tipos, serviços, regras de
     acesso e teste de mesa) quando houver código;
   - Ficha de Tela de cada tela tocada, quando houver interface;
   - matriz critério → prova;
   - riscos, casos de erro, segurança, acessibilidade e LGPD aplicáveis, inclusive risco de dados
     em migration;
   - dependências e perguntas realmente bloqueantes;
   - roteiro de verificação automática e teste humano.

## Persistir e parar

Crie ou atualize `.adapta-cliente/estado-atual.md` com a task selecionada, sua SPEC, a etapa
`aguardando_autorizacao`, autorizações ausentes, teste humano pendente, aprendizado pendente e uma
única próxima ação: `aguardar autorização para implementar`. Persista o relatório completo em
`.adapta-cliente/analises/<task-id>.md` e registre esse caminho no estado; `executar-task` nunca
depende da conversa anterior para recuperar o plano aprovado.

Não envie nada ao GitHub nesta etapa: estado, análise e mapa ficam no repositório local e vão no
commit da entrega. Se o runtime só consegue gravar pelo conector do GitHub, grave os arquivos em um
único commit, sem reler e sem reenviar.

Encerre com:

> Analisei a task <ID> e ainda não implementei nada. Posso implementar este plano?

Pare imediatamente depois da pergunta. Não edite código, configuração ou conteúdo do produto;
não carregue `executar-task`; não trate o pedido inicial como autorização; não selecione uma
segunda task.
