# Plugin Cliente — Adapta Native

Este repositório publica duas edições do plugin do cliente:

- `adapta-cliente`: edição Ethos/legacy; `skill-mind-cliente` é a entrada obrigatória e instala a
  MEMORY persistente na primeira utilização e a cada nova versão;
- `adapta-cliente-codex`: edição Codex pura, com skills diretas e sem dependências do Ethos.

Na edição Ethos, a `skill-mind-cliente` interpreta o pedido e constrói as tasks da fase em
sequência, uma por vez, sem pedir licença a cada passo: só para quando precisa do cliente
(pergunta, teste, impedimento ou fim da fase). Funciona mesmo em runtimes antigos como o
ETHOS/PicoClaw, sem depender de hooks ou subagentes.

## Instalação no Codex

```text
codex plugin marketplace add drkgod/Plugin-Cliente---Adapta
codex plugin add adapta-cliente-codex@personal
```

Abra uma conversa nova depois da instalação. Use diretamente “analise a próxima task”, “execute a
task autorizada”, “destrave a task” ou “mostre o status”.

## Instalação no Claude Code

```text
/plugin marketplace add drkgod/Plugin-Cliente---Adapta
/plugin install adapta-cliente@adapta-cliente
```

## Instalação no ETHOS

Instale o bundle conforme o mecanismo disponível no ETHOS. O bundle já contém
`adapta-cliente/MEMORY.md`; na primeira entrada pública, a SkillMind pede ao Ethos que instale o
conteúdo na memória persistente da personalidade atual. Não há cópia ou cola manual.

Instalação, memória e onboarding não precisam virar três conversas. Depois de disponibilizar o
bundle, use uma única entrada:

```text
Use skill-mind-cliente para configurar ou retomar este projeto. Confirme o acesso ao GitHub, à
plataforma de construção e à estrutura operacional antes de abrir uma task.
```

O `/adapta-cliente:trabalhar` oferece a mesma entrada em runtimes com slash commands.

As regras do plugin valem só para o projeto configurado: a configuração registra o repositório e
os projetos do Skip, e o mesmo Ethos continua livre para outros assuntos, repositórios e projetos,
sem ciclo de tasks, publicação obrigatória ou envio ao GitHub.

## Fluxo da edição Ethos

1. Analisar a próxima task elegível e gravar a análise.
2. Construir e executar as verificações automatizáveis.
3. Publicar na plataforma de construção, com prova.
4. Pedir o teste do cliente na URL de produção só quando a SPEC inteira fica pronta ou num caso
   crítico (mudança no que a equipe já usa, integração externa de que as próximas tasks dependem
   ou aprovação exigida pela SPEC); SPEC sem nada para o cliente testar fecha pela prova
   automática.
5. Seguir para a próxima task até uma parada real: pergunta, teste, impedimento, fim da fase ou
   pedido do cliente.
6. Antes de cada parada, registrar o aprendizado interno silencioso e atualizar o GitHub em um
   único commit.
7. Quando o teste falhar, debugar a mesma task e pedir o reteste só do que falhou.

A edição Codex mantém a análise e a autorização separadas por task. As mudanças da 0.8.0 estão em
[`MIGRATION-0.8.0.md`](MIGRATION-0.8.0.md).

## Construir sem harness e entregar com prova (edição Ethos)

O agente do Ethos não tem busca no código, verificação de tipos local, navegador nem visão de
diff. Três skills de apoio substituem esse ambiente. Elas não são rotas: são carregadas dentro da
task em construção.

- `ui-ux-sistemas`: Ficha de Tela na análise, catálogo de padrões para sistemas internos, regras
  de UX e de texto em PT-BR, checklist de UI e roteiro de teste visual;
- `construir-codigo`: mapa do sistema, plano em código com teste de mesa, edição cirúrgica, QA do
  Skip como compilador, revisão por checklist e receitas no padrão do template Skip;
- `publicar-e-sincronizar`: aplica, publica e prova a versão no Skip, espelha os arquivos
  alterados em `07-sistemas/<sistema>/codigo/` e atualiza o GitHub com push sem força e prova no
  remoto.

A regra de entrega fica na MEMORY: toda resposta que altera o Skip termina aplicada, publicada e
provada, com o GitHub atualizado antes de devolver a vez ao cliente. As mudanças da versão estão em
[`MIGRATION-0.6.0.md`](MIGRATION-0.6.0.md).

## Como o assistente fala com o cliente

Nas duas edições, o assistente fala em linguagem simples, explica todo impedimento com o porquê e
o que fazer, ensina o cliente a resolver antes de indicar o consultor (que entra só em mudança de
escopo, risco, acesso exclusivo ou depois de três tentativas guiadas) e deixa o cliente decidir os
detalhes de negócio que a SPEC não define. Detalhes em [`MIGRATION-0.7.0.md`](MIGRATION-0.7.0.md).

Owner/dono permanece como informação de coordenação, mas nunca bloqueia uma task elegível. O
relatório de análise é persistido em `.adapta-cliente/analises/`, permitindo retomar em outra
sessão.

Os plugins operam apenas sobre o repositório operacional do cliente: `04_fase-atual/fase.md`,
`04_fase-atual/specs/`, `05_entregas/`, `06_notas/`, `07-sistemas/`, `STATUS.md` e `changelog.md`.
Eles não exigem nem devem receber o workspace privado `03-Projeto` do consultor.

`04_fase-atual/fase.md` aceita o formato atual do portal (`<!-- fase-format:2 -->`) e o formato
tabular legado. No formato atual, cada checkbox é uma task, descrições ficam nas linhas `>`, a
indentação representa subtasks e o comentário `<!-- id:... -->` deve ser preservado.

O guia com o fluxo principal e os cinco prompts públicos está em
[`FLUXO-PRINCIPAL.md`](FLUXO-PRINCIPAL.md).

## Validação

```text
npm test
```

Os hooks presentes no bundle são uma compatibilidade opcional com Claude. Nenhuma regra, guardrail,
estado ou aprendizado depende deles no ETHOS. Eles só agem em repositórios que têm
`04_fase-atual/fase.md`; em qualquer outro projeto não fazem nada.
