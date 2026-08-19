# Plugin Cliente — Adapta Native

Este repositório publica duas edições do plugin do cliente:

- `adapta-cliente`: edição Ethos/legacy; `skill-mind-cliente` é a entrada obrigatória e MEMORY
  oferece persistência em runtimes limitados;
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

Instale o bundle conforme o mecanismo disponível no ETHOS e copie integralmente o conteúdo de
[`adapta-cliente/MEMORY.md`](adapta-cliente/MEMORY.md) para a memória persistente/personalização
do assistente. Não presuma que o ETHOS descobre `MEMORY.md` apenas porque o arquivo está no repo.

Use a SkillMind como porta de entrada:

```text
Use skill-mind-cliente para começar ou retomar o trabalho.
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

Os plugins operam apenas sobre o handoff externo do cliente: `04_fase-atual/fase.md`,
`04_fase-atual/specs/`, `05_entregas/`, `06_notas/`, `07-sistemas/`, `STATUS.md` e `changelog.md`.
Eles não exigem nem devem receber o workspace privado `03-Projeto` do consultor.

## Validação

```text
npm test
```

Os hooks presentes no bundle são uma compatibilidade opcional com Claude. Nenhum gate, guardrail,
estado ou aprendizado depende deles no ETHOS.
