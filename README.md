# Plugin Cliente — Adapta Native

Este repositório publica duas edições do plugin do cliente:

- `adapta-cliente`: edição Ethos/legacy; `skill-mind-cliente` é a entrada obrigatória e instala a
  MEMORY persistente na primeira utilização e a cada nova versão;
- `adapta-cliente-codex`: edição Codex pura, com skills diretas e sem dependências do Ethos.

Na edição Ethos, a `skill-mind-cliente` interpreta o pedido, mantém uma única task ativa e aplica
os portões de autorização e teste humano
mesmo em runtimes antigos como o ETHOS/PicoClaw, sem depender de hooks ou subagentes.

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

## Fluxo obrigatório

1. Selecionar e analisar exatamente uma task.
2. Mostrar achados e pedir autorização antes de implementar.
3. Implementar e executar as verificações automatizáveis.
4. Publicar na plataforma de construção e atualizar o GitHub, com prova.
5. Pedir o teste humano na URL de produção antes de concluir.
6. Debugar a mesma task quando o teste falhar.
7. Concluir, registrar aprendizado interno silencioso e parar sem abrir a próxima task.

## Construir sem harness e entregar com prova (edição Ethos)

O agente do Ethos não tem busca no código, verificação de tipos local, navegador nem visão de
diff. Três skills de apoio substituem esse ambiente. Elas não são rotas: são carregadas dentro da
task autorizada.

- `ui-ux-sistemas`: Ficha de Tela na análise, catálogo de padrões para sistemas internos, regras
  de UX e de texto em PT-BR, checklist de UI e roteiro de teste visual;
- `construir-codigo`: mapa do sistema, plano em código com teste de mesa, edição cirúrgica, QA do
  Skip como compilador, revisão por checklist e receitas no padrão do template Skip;
- `publicar-e-sincronizar`: aplica, publica e prova a versão no Skip, espelha os arquivos
  alterados em `07-sistemas/<sistema>/codigo/` e atualiza o GitHub com push sem força e prova no
  remoto.

A regra de entrega fica na MEMORY: toda resposta que altera o Skip termina aplicada, publicada e
provada, com o GitHub atualizado na mesma resposta. As mudanças da versão estão em
[`MIGRATION-0.6.0.md`](MIGRATION-0.6.0.md).

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

Os hooks presentes no bundle são uma compatibilidade opcional com Claude. Nenhum gate, guardrail,
estado ou aprendizado depende deles no ETHOS.
