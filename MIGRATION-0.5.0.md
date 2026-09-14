# Migração 0.5.0 — fluxo do cliente e tasks do portal

## Antes

- instalação do plugin, instalação da memória e definição da memória principal apareciam como
  etapas separadas no material de onboarding;
- `04_fase-atual/fase.md` era descrito apenas como tabela operacional;
- `handoff-manifest.json` era exigido mesmo quando nenhum processo o havia criado;
- a conclusão dizia genericamente para marcar uma linha, sem proteger o ID e os metadados do card.

## Agora

- uma única entrada configura plugin, memória, acessos e estrutura;
- as pastas existentes permanecem inalteradas;
- `04_fase-atual/fase.md` suporta oficialmente `fase-format:2` e mantém compatibilidade com a
  tabela legada;
- seleção, progresso e conclusão entendem checkboxes e subtasks;
- a conclusão altera somente o estado do checkbox e preserva `<!-- id:... -->`, título, descrição,
  hierarquia e metadados;
- `handoff-manifest.json` é validado quando existe, mas sua ausência não cria uma trava sem
  solução;
- os dois portões humanos continuam obrigatórios: autorização antes da implementação e teste
  humano antes da conclusão.

## Fluxo principal

```text
CONFIGURAR
  → ANALISAR UMA TASK
  → AGUARDAR AUTORIZAÇÃO
  → IMPLEMENTAR E VERIFICAR
  → AGUARDAR TESTE HUMANO
  → CONCLUIR OU DEBUGAR A MESMA TASK
  → PARAR
```

Os prompts públicos e o texto recomendado para o site estão em `FLUXO-PRINCIPAL.md`.
