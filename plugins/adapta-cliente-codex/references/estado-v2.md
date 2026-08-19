# Estado operacional v2

Mantenha `.adapta-cliente/estado-atual.md` com estes campos:

```markdown
# Estado atual — Adapta Cliente

- schema_version: adapta-cliente-state/v2
- task_id: <ID ou nenhuma>
- executor: <nome ou desconhecido>
- owner_informativo: <valor da tabela ou desconhecido>
- spec: <caminho ou nenhuma>
- analise: <.adapta-cliente/analises/<task-id>.md ou nenhuma>
- etapa: <sem_task|aguardando_autorizacao|implementando|aguardando_teste_humano|em_correcao|bloqueada|concluida>
- autorizacao_implementacao: <ausente|confirmada + data/hora e trecho curto>
- teste_humano: <pendente|aprovado|falhou|nao_aplicavel + data/hora e trecho curto>
- verificacao_automatica: <pendente|passou|falhou + resumo>
- aprendizado: <pendente|capturado:<arquivo>|sem_sinal:<motivo>>
- ultima_acao: <ação comprovada>
- proxima_acao: <uma única ação>
- atualizado_em: <ISO-8601 com fuso>
```

Somente uma task pode permanecer ativa. Nunca infira autorização ou teste humano. Preserve trechos
curtos das confirmações, não o prompt completo.

