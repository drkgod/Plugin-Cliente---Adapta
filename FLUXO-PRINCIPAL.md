# Fluxo principal — Plugin Adapta Cliente

Este é o texto canônico para explicar o onboarding e a execução no site. A estrutura de pastas do
repositório operacional permanece:

- `04_fase-atual/fase.md`
- `04_fase-atual/specs/`
- `05_entregas/`
- `06_notas/`
- `07-sistemas/`
- `STATUS.md`
- `changelog.md`

## O caminho do cliente

1. **Configurar:** instalar o plugin, ativar a memória e confirmar os acessos em uma única entrada.
2. **Analisar:** selecionar exatamente uma task e entender plano, riscos e testes sem implementar.
3. **Autorizar:** o cliente autoriza aquela task em uma nova mensagem.
4. **Executar:** o agente implementa, roda as verificações e entrega um roteiro de teste humano.
5. **Aprovar ou corrigir:** o cliente testa; se funcionar, a task é concluída; se falhar, a mesma
   task volta para debug.

Não existe conclusão automática, execução da fase inteira ou abertura da próxima task no mesmo
ciclo.

## Cinco prompts públicos

### 1. Configurar

```text
Quero configurar o Plugin Adapta Cliente neste projeto.

Plugin: https://github.com/drkgod/Plugin-Cliente---Adapta
Repositório do projeto: <URL-GITHUB>
Plataforma de construção: <URL-DO-PROJETO>
Champion responsável pelo teste: <NOME-E-PAPEL>
Fonte oficial dos arquivos: GitHub

Instale ou atualize o plugin, use skill-mind-cliente e confirme a memória persistente, os acessos
e a estrutura operacional. Não abra nem implemente uma task nesta resposta.
```

### 2. Começar

```text
Use skill-mind-cliente para começar ou retomar o trabalho. Analise exatamente uma task elegível e
pare antes de implementar.
```

### 3. Autorizar

```text
Autorizo implementar somente a task <TASK-ID>, seguindo a análise apresentada, sua SPEC e os
critérios de aceite. Não abra outra task.
```

### 4. Aprovar

```text
Executei o roteiro de teste humano da task <TASK-ID> e o resultado esperado funcionou. Revalide as
evidências, conclua somente essa task e pare.
```

### 5. Relatar falha

```text
O teste da task <TASK-ID> falhou.
Sintoma observado: <O-QUE-APARECEU>
Passos usados: <PASSOS-MÍNIMOS>
Resultado esperado: <RESULTADO>

Faça o debug da mesma task e pare novamente no teste humano. Não abra outra task.
```

## Contrato das tasks do portal

Quando `04_fase-atual/fase.md` usar `<!-- fase-format:2 -->`, o plugin interpreta:

- `[ ]` como a fazer, `[/]` como em andamento e `[x]` como concluída;
- linhas `>` como descrição do card;
- indentação como hierarquia de subtasks;
- `@responsável`, `!prazo`, `#tipo` e `[interno]` como metadados;
- `<!-- id:... -->` como identidade estável, que nunca pode ser apagada.

O formato tabular antigo continua legível para projetos existentes.

## Dependências que realmente bloqueiam

- `04_fase-atual/fase.md` ausente ou sem task identificável;
- SPEC ausente ou conflitante;
- raiz executável ausente ou ambígua;
- dependência declarada da task não atendida;
- falta de autorização explícita para implementar;
- falta do teste humano para concluir.

Owner diferente do executor, ausência de `handoff-manifest.json`, check separado ou formulário de
liberação não bloqueiam uma task válida.

## Texto recomendado para o site

- Use “segredos” no lugar de “secrets”.
- Use “plataforma de construção” e apresente Skip apenas como exemplo.
- Descreva a IA como responsável por analisar, implementar e verificar; o cliente autoriza e
  valida o resultado real.
- Evite nomes de clientes reais em páginas públicas.
- Não apresente instalação da memória como um segundo ou terceiro comando.
