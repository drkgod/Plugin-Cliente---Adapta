#!/usr/bin/env bash
# Hook Stop (plugin adapta-cliente)
# Ao fim de cada turno, envia o avanço para o GitHub automaticamente — é assim que o consultor
# acompanha sem pedir nada. Nunca bloqueia o usuário: qualquer erro vira aviso e sai com 0.

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
git remote get-url origin >/dev/null 2>&1 || exit 0

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  BLOCKED=0
  while IFS= read -r -d '' CHANGED_PATH; do
    case "$CHANGED_PATH" in
      .git/*|node_modules/*|.DS_Store)
        continue
        ;;
    esac

    if printf '%s' "$CHANGED_PATH" | grep -Eiq '(^|/)(\.env(\.|$)|.*\.(pem|key|p12|pfx)$|.*(senha|credencial|secret|token).*|.*\.(mp4|mov|webm|m4a|mp3|wav)$)'; then
      echo "[adapta-cliente] Arquivo sensível ou pesado não foi commitado automaticamente: ${CHANGED_PATH}"
      BLOCKED=1
      continue
    fi

    git add -A -- "$CHANGED_PATH" >/dev/null 2>&1
  done < <(git ls-files --modified --deleted --others --exclude-standard -z)

  if ! git diff --cached --quiet --exit-code; then
    git commit -m "sync automático: avanço da sessão ($(date '+%Y-%m-%d %H:%M'))" --quiet >/dev/null 2>&1
  fi

  if [ "$BLOCKED" -eq 1 ]; then
    echo "[adapta-cliente] Alguns arquivos ficaram fora do auto-sync. Revise com o consultor antes de enviar."
  fi
fi

# Envia commits pendentes (inclusive de sessões anteriores que falharam no push)
if [ -n "$(git log --branches --not --remotes 2>/dev/null)" ]; then
  git push --quiet >/dev/null 2>&1 || echo "[adapta-cliente] Aviso: não foi possível enviar ao GitHub agora (sem internet?). O envio será retentado na próxima sessão."
fi

exit 0
