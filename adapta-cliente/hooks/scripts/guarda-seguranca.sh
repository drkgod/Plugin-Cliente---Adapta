#!/usr/bin/env bash
# Hook PreToolUse/Bash (plugin adapta-cliente)
# Guarda de segurança do repo do cliente: bloqueia comandos destrutivos antes de executarem.
# O champion é leigo — um comando destrutivo sugerido num momento de debug não pode apagar o
# projeto nem reescrever o histórico que o consultor acompanha (decisão D5/D9).
#
# Reempacotado de ECC (Everything Claude Code, github.com/affaan-m/ECC — skill `safety-guard`),
# adaptado ao método Adapta Native (decisão D6). Checagem determinística, sem dependências:
# casa padrões sobre o payload JSON do hook. Exit 2 = bloqueia e explica; exit 0 = segue.

PAYLOAD=$(cat 2>/dev/null) || exit 0
[ -n "$PAYLOAD" ] || exit 0

bloquear() {
  echo "[adapta-cliente] Comando bloqueado pela guarda de segurança: $1" >&2
  echo "Motivo: $2" >&2
  echo "Se essa ação for realmente necessária, fale com o consultor — ele executa (ou libera) com segurança." >&2
  exit 2
}

case "$PAYLOAD" in
  *"rm -rf"*|*"rm -fr"*)
    bloquear "remoção recursiva forçada (rm -rf)" "apagar pastas inteiras é irreversível e quase nunca é a solução de um erro de task." ;;
esac

printf '%s' "$PAYLOAD" | grep -Eq 'git[^"]*push[^"]*(--force|-f\b)' && \
  bloquear "git push --force" "reescreve o histórico publicado — o consultor perderia o rastro do que já foi sincronizado."

printf '%s' "$PAYLOAD" | grep -Eq 'git[^"]*reset[^"]*--hard' && \
  bloquear "git reset --hard" "descarta trabalho local sem volta. Para desfazer algo, descreva o que aconteceu e peça ajuda no chat."

printf '%s' "$PAYLOAD" | grep -Eq 'git[^"]*checkout[^"]*( \.|-- \.)' && \
  bloquear "git checkout . (descartar tudo)" "descarta todas as alterações locais de uma vez, incluindo o que estava certo."

printf '%s' "$PAYLOAD" | grep -Eq 'git[^"]*clean[^"]*-[a-zA-Z]*f' && \
  bloquear "git clean -f" "apaga arquivos ainda não versionados — anotações e material novo iriam junto."

printf '%s' "$PAYLOAD" | grep -Eq '(--no-verify|chmod[[:space:]]+777|sudo[[:space:]]+rm)' && \
  bloquear "comando de risco (--no-verify / chmod 777 / sudo rm)" "contorna proteções do repositório ou do sistema."

printf '%s' "$PAYLOAD" | grep -Eiq 'drop[[:space:]]+(table|database|schema)' && \
  bloquear "DROP TABLE/DATABASE" "apagar estrutura de banco é decisão do consultor, nunca passo de task."

exit 0
