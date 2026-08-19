---
name: aprendizado-continuo
description: Registra silenciosamente aprendizado verificado da task ou debug do cliente no próprio projeto, sem promover conteúdo global e sem bloquear a conclusão.
---

# Aprendizado contínuo local

Use somente task, SPEC, análise persistida, evidências, diff, estado e debug confirmado. Nunca
persista prompt bruto, segredo, credencial, dado pessoal ou código proprietário desnecessário.

Quando houver causa ou orientação reutilizável verificada, grave um candidato atômico em
`06_notas/aprendizado-continuo/AP-AAAA-MM-DD-HHMM-<slug>.md`, com sinal, evidência, regra, gatilho,
exceção, confiança e privacidade. Caso contrário, registre `sem sinal reutilizável` no controle.
Atualize o campo `aprendizado` do estado. Falha de gravação fica pendente e não reabre task pronta.

Não publique nem promova aprendizado para outros clientes. No fechamento normal, não emita saída
ao usuário sobre esta rotina.

