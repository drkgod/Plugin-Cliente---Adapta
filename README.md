# Plugin Cliente — Adapta Native

Este repositório publica o plugin `adapta-cliente`, usado pelo champion do cliente durante a
construção das cinco fases do Adapta Native. A `skill-mind-cliente` é a entrada obrigatória: ela
interpreta o pedido, mantém uma única task ativa e aplica os portões de autorização e teste humano
mesmo em runtimes antigos como o ETHOS/PicoClaw, sem depender de hooks ou subagentes. Projetos
podem declarar modo autônomo por task na constituição: a IA implementa sem autorização técnica
prévia, mas todos os validadores designados testam cada task antes do fechamento.

## Instalação no Claude Code

```text
/plugin marketplace add drkgod/Plugin-Cliente---Adapta
/plugin install adapta-cliente@adapta-cliente
```

Para atualizar:

```text
/plugin marketplace update adapta-cliente
/plugin update adapta-cliente
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
2. No modo padrão, mostrar achados e pedir autorização; no modo autônomo, a IA decide a técnica
   e implementa a mesma task dentro da fase aprovada.
3. Implementar e executar as verificações automatizáveis.
4. Pedir um teste básico de 1 a 3 passos a cada validador designado antes de concluir.
5. Debugar a mesma task quando o teste falhar.
6. Concluir, registrar aprendizado interno silencioso e parar sem abrir a próxima task. O
   consultor valida o conjunto no fim da fase, não a cada task.

O plugin opera apenas sobre o handoff externo do cliente: `04_fase-atual/fase.md`,
`04_fase-atual/specs/`, `05_entregas/`, `06_notas/`, `STATUS.md` e `changelog.md`. Ele não exige
nem deve receber o workspace privado `03-Projeto` do consultor.

## Validação

```text
npm test
```

Os hooks presentes no bundle são uma compatibilidade opcional com Claude. Nenhum gate, guardrail,
estado ou aprendizado depende deles no ETHOS.
