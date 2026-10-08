#!/usr/bin/env bash
# Hook SessionStart (plugin adapta-cliente)
# Puxa a versão mais recente do repositório (specs/unidades novas liberadas pelo consultor)
# e injeta um resumo do STATUS no contexto da sessão. Nunca falha a sessão: sai sempre com 0.

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

if git rev-parse --is-inside-work-tree >/dev/null 2>&1 && git remote get-url origin >/dev/null 2>&1; then
  # Só puxa se não houver mudanças locais não commitadas (evita conflito silencioso)
  if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
    PULL_OUT=$(git pull --ff-only --quiet 2>&1) || echo "[adapta-cliente] Aviso: não foi possível atualizar do GitHub (${PULL_OUT}). Continue normalmente; se persistir, peça ao assistente para conferir com você o acesso ao GitHub."
  else
    echo "[adapta-cliente] Há alterações locais ainda não enviadas; o pull automático foi pulado."
  fi
fi

if [ -f STATUS.md ]; then
  echo "=== STATUS atual do projeto (resumo automático) ==="
  head -40 STATUS.md
fi

exit 0
