# Plugin Cliente — Adapta Native

Este repositório publica duas edições do plugin do cliente:

- `adapta-cliente`: edição Ethos/legacy; `skill-mind-cliente` é a entrada obrigatória e instala a
  MEMORY persistente na primeira utilização;
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
4. Pedir o teste humano antes de concluir.
5. Debugar a mesma task quando o teste falhar.
6. Concluir, registrar aprendizado interno silencioso e parar sem abrir a próxima task.

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
