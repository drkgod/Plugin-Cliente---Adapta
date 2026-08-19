---
name: executar-task
description: Implementa no Codex uma única task já analisada e autorizada, executa TDD e verificações e para no teste humano. Use após nova mensagem autorizar claramente o plano persistido.
---

# Executar task

Carregue `../../personas/agente-cliente.md` e `../../references/estado-v2.md`. Prossiga somente
quando o estado v2 estiver em
`aguardando_autorizacao`, a análise persistida existir e a mensagem atual autorizar aquela task.
Registre a autorização curta e timestamp; owner diferente do executor nunca bloqueia.

1. Releia task, SPEC, análise persistida, estado e arquivos afetados.
2. Ambiguidade de resultado, limite, raiz executável ou prova vira `DÚVIDA:` e bloqueia; não edite
   a SPEC.
3. Mude a etapa para `implementando`. Execute o RED ou baseline, implemente o menor recorte completo
   e trate erros, segurança, acessibilidade e LGPD aplicáveis.
4. Rode GREEN, regressão, build, lint, tipos e testes relevantes declarados. Inspecione o diff e
   remova mudança sem vínculo com a task.
5. Registre comandos, resultados e limitações reais. Falha ou ferramenta ausente não é PASS.
6. Atualize o estado para `aguardando_teste_humano`, mantenha o teste pendente, mostre mudanças,
   provas automáticas e roteiro numerado do teste real.
7. Pare e peça a confirmação do teste humano. Não conclua nem abra outra task.
