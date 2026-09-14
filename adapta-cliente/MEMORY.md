# Memória persistente — Adapta Cliente no ETHOS

Use este conteúdo na memória persistente do assistente de codificação do cliente durante as cinco
fases. Estas são instruções ativas, não um histórico: não grave aqui prompts, transcrições,
credenciais, segredos, código proprietário ou dados pessoais.

Esta memória já vem no bundle. No primeiro comando, o SkillMind pede ao Ethos que a instale na
memória persistente; não peça ao cliente para copiar ou colar este arquivo.

## Regra zero: entrar sempre pelo SkillMind Cliente

Para qualquer pedido relacionado ao projeto, carregue primeiro
`skills/skill-mind-cliente/SKILL.md`. Isso vale mesmo quando o usuário citar outra skill ou pedir
diretamente para executar, debugar ou concluir uma task. Uma skill filha sem o envelope
`CLIENTE_ENVELOPE v1` deve parar e redirecionar para o SkillMind Cliente.

O fluxo não depende de hooks, `before/after tool`, contratos JSON, scripts Node, chamadas
aninhadas de skills ou subagentes. Quando o runtime não conseguir invocar outra skill, leia o
`SKILL.md` indicado e execute suas instruções no agente principal. Quando não houver subagente,
execute a verificação em série usando `agents/verificador-de-entrega.md` como checklist.

## Regra de ritmo e profundidade

- Trabalhar em exatamente uma task por vez.
- Owner/dono é metadado informativo. Uma task elegível pode ser executada por qualquer pessoa
  autorizada pelo cliente; ausência ou divergência de owner nunca bloqueia o fluxo.
- Nunca implementar todas as tasks de uma SPEC, fase ou lista no mesmo ciclo.
- Primeiro analisar a task e o estado real do projeto; depois mostrar achados, riscos, plano e
  testes ao cliente.
- Encerrar essa resposta perguntando se pode implementar. A autorização precisa vir em uma nova
  mensagem; autorização presumida ou embutida no pedido inicial não vale.
- Após implementar, executar as verificações automatizáveis, explicar o resultado esperado e
  pedir teste humano.
- Não concluir nem iniciar outra task até o cliente declarar explicitamente que testou e aprovou.
- Se o teste falhar, manter a mesma task aberta, debugar, verificar e pedir novo teste humano.
- Depois da conclusão, registrar o aprendizado e parar. A próxima task exige novo pedido.
- Executar a triagem de aprendizado silenciosamente. Não pedir autorização, confirmação,
  explicação ou preenchimento ao cliente e não mencionar a rotina na resposta normal.

Não use espera artificial. O ritmo vem da análise profunda, da prova automatizada e dos dois
portões humanos.

## Máquina de estados obrigatória

Manter `.adapta-cliente/estado-atual.md` no repositório do cliente. Só pode existir uma task ativa.

`sem_task` → `aguardando_autorizacao` → `implementando` → `aguardando_teste_humano` →
`concluida`

Rotas de exceção:

- falha técnica → `em_correcao` → `aguardando_teste_humano`;
- falta de acesso/dependência → `bloqueada`;
- dúvida de requisito → registrar `DÚVIDA:` e parar para o consultor;
- sessão interrompida → retomar do último estado, nunca reiniciar ou avançar por suposição.

Confirmação de análise não aprova teste humano. Confirmação de teste humano não autoriza começar
a próxima task.

## Caminhos canônicos do repositório externo do cliente

- Estado executivo: `STATUS.md`
- Histórico: `changelog.md`
- Tasks da fase: `04_fase-atual/fase.md` (`fase-format:2` ou tabela legada)
- SPECs liberadas: `04_fase-atual/specs/`
- Fases entregues: `05_entregas/`
- Notas do cliente: `06_notas/`
- Aprendizados: `06_notas/aprendizado-continuo/`
- Controle do orquestrador: `.adapta-cliente/estado-atual.md`
- Relatórios de análise: `.adapta-cliente/analises/<task-id>.md`
- Manifesto de compatibilidade, quando existir: `handoff-manifest.json`
- Raiz executável dos sistemas: `07-sistemas/`

Não procurar nem exigir `03-Projeto`, `01-Escopo.md`, `02-Escopo-Definitivo.md`, análises internas
ou fases futuras. Esses arquivos pertencem ao workspace privado do consultor e não fazem parte do
repositório operacional do cliente.

### Contrato de `fase-format:2`

Quando `04_fase-atual/fase.md` contiver `<!-- fase-format:2 -->`:

- `- [ ]`, `- [/]` e `- [x]` significam a fazer, em andamento e concluída;
- cada checkbox, inclusive indentado, é uma task independente dentro de sua hierarquia;
- a descrição vem nas linhas `>` imediatamente abaixo da task;
- `@responsável`, `!dd/mm/aaaa`, `#tipo` e `[interno]` são metadados finais, não parte do título;
- `<!-- id:... -->` é a identidade estável do card e nunca deve ser removido ou regenerado;
- ao mudar o estado, altere somente o checkbox e os registros operacionais exigidos.

Se o marcador não existir, leia a tabela legada sem tentar convertê-la durante a execução de uma
task. A ausência de `handoff-manifest.json` não bloqueia o trabalho quando os caminhos canônicos,
a task, a SPEC e a raiz executável estiverem inequívocos.

## Índice de skills

| Skill | Caminho | Responsabilidade |
|---|---|---|
| `skill-mind-cliente` | `skills/skill-mind-cliente/SKILL.md` | Entrada obrigatória; interpreta, cria o envelope, aplica gates e coordena o ciclo. |
| `status` | `skills/status/SKILL.md` | Lê progresso, pendências, travas e entregas sem alterar o projeto. |
| `proxima-task` | `skills/proxima-task/SKILL.md` | Seleciona uma task, faz análise profunda e para antes da implementação. |
| `executar-task` | `skills/executar-task/SKILL.md` | Implementa somente a task autorizada, verifica e para no teste humano. |
| `debug-task` | `skills/debug-task/SKILL.md` | Diagnostica e corrige a task ativa sem abrir outra frente. |
| `concluir-task` | `skills/concluir-task/SKILL.md` | Revalida evidências após aprovação humana e fecha a task. |
| `aprendizado-continuo` | `skills/aprendizado-continuo/SKILL.md` | Captura aprendizado verificado ou registra ausência de sinal reutilizável. |

## Roteamento de pedidos

- “começar”, “trabalhar”, “próxima task”, “o que faço agora?” → `proxima-task`.
- “pode implementar”, depois do relatório de análise → `executar-task`.
- “deu erro”, “não funcionou”, “o teste falhou”, “destravar” → `debug-task`.
- “testei e funcionou”, “pode concluir”, “finalizar” → `concluir-task`.
- “status”, “como estamos?”, “quanto falta?” → `status`.
- “salvar aprendizado”, fechamento de task/debug ou auditoria agendada →
  `aprendizado-continuo`.

Se o pedido misturar várias rotas, priorize nesta ordem: falha da task ativa, gate pendente, task
ativa, status e somente então seleção de nova task.

## Guardrails substitutos dos hooks

Antes de escrever ou executar comandos:

1. Confirmar raiz, task ativa, SPEC, estado e autorização do gate.
2. Inspecionar antes de alterar; preservar mudanças existentes e arquivos fora da task.
3. Nunca usar `rm -rf`, `git reset --hard`, `git clean -f`, `git checkout .`, force push,
   `--no-verify`, `chmod 777`, `sudo rm` ou `DROP TABLE/DATABASE/SCHEMA`.
4. Nunca revelar, criar commit com ou publicar `.env`, tokens, senhas, chaves, credenciais ou
   dados pessoais.
5. Não mudar SPEC, plano, task de outra pessoa ou fase futura para fazer a implementação caber.
6. Não alegar que pull, commit, push, deploy, teste ou backup aconteceu sem evidência observável.
7. Se Git estiver disponível, usar somente operações não destrutivas. `git pull --ff-only` só com
   árvore limpa; nunca resolver conflito descartando trabalho. Push nunca é requisito implícito
   para marcar a task como tecnicamente pronta.

## Aprendizado obrigatório e cron

Antes de encerrar task ou debug, executar `aprendizado-continuo`:

- capturar somente causa, padrão ou orientação reutilizável sustentada por evidência; ou
- registrar em `06_notas/aprendizado-continuo/controle.md` que não houve sinal reutilizável e o
  motivo.

Essa rotina é interna e automática dentro do fechamento coordenado pelo SkillMind. Nunca faça
pergunta sobre aprendizado ao cliente. Se faltar evidência, registre `sem sinal reutilizável`; se
houver erro de gravação, mantenha `aprendizado: pendente` no estado para o cron tentar novamente.
Falha nessa rotina não desfaz uma task tecnicamente concluída e não deve interromper o cliente.

O agendamento recomendado no ETHOS é a cada 4 horas com este pedido:

> Use `skill-mind-cliente` em modo de recuperação. Leia o estado, o changelog e as mudanças desde
> a última revisão; feche apenas checkpoints e triagens de aprendizado pendentes. Não implemente
> tasks, não aprove teste humano, não conclua fase, não publique e não comece trabalho novo.

O cron é rede de recuperação. Ele não substitui a captura imediata no fechamento e não pode
inventar causalidade, aprovar gates ou iniciar uma task. O cron também é silencioso: só deve falar
com o cliente se encontrar um risco que exija ação dele, nunca para pedir conteúdo de memória.
