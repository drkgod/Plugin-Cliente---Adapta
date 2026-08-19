import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

const ROOT = path.resolve(import.meta.dirname, "..")
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8")

function skillNames() {
  return fs.readdirSync(path.join(ROOT, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

test("MEMORY indexa todas as skills reais", () => {
  const memory = read("MEMORY.md")
  for (const skill of skillNames()) {
    assert.ok(memory.includes(`| \`${skill}\` |`), `Skill ausente do índice: ${skill}`)
    assert.ok(memory.includes(`skills/${skill}/SKILL.md`), `Caminho ausente do índice: ${skill}`)
  }
})

test("skills filhas exigem envelope e redirecionam ao SkillMind", () => {
  for (const skill of skillNames().filter((name) => name !== "skill-mind-cliente")) {
    const body = read(`skills/${skill}/SKILL.md`)
    assert.match(body, /CLIENTE_ENVELOPE v1/, skill)
    assert.match(body, /\.\.\/skill-mind-cliente\/SKILL\.md/, skill)
  }
})

test("SkillMind contém os dois hard stops e a máquina de estados", () => {
  const body = read("skills/skill-mind-cliente/SKILL.md")
  assert.match(body, /aguardando_autorizacao/)
  assert.match(body, /aguardando_teste_humano/)
  assert.match(body, /resposta anterior/)
  assert.match(body, /nova mensagem do usuário/)
  assert.match(body, /Não abrir a próxima task|Não chame.*proxima-task|Não chamar.*proxima-task|Não abra.*próxima task|Não abrir.*próxima task/i)
})

test("comandos públicos entram somente pelo SkillMind", () => {
  const commandsRoot = path.join(ROOT, ".claude", "commands", "adapta-cliente")
  for (const entry of fs.readdirSync(commandsRoot).filter((name) => name.endsWith(".md"))) {
    const body = fs.readFileSync(path.join(commandsRoot, entry), "utf8")
    assert.match(body, /skill-mind-cliente\/SKILL\.md/, entry)
    assert.doesNotMatch(body, /\/adapta-cliente:(status|proxima-task|debug-task|concluir-task)/, entry)
  }
})

test("fluxo essencial não promete hooks ou agente obrigatório", () => {
  const critical = [
    "skills/skill-mind-cliente/SKILL.md",
    "skills/proxima-task/SKILL.md",
    "skills/executar-task/SKILL.md",
    "skills/debug-task/SKILL.md",
    "skills/concluir-task/SKILL.md",
    ".claude/commands/adapta-cliente/trabalhar.md",
    ".claude/commands/adapta-cliente/destravar-task.md",
    ".claude/commands/adapta-cliente/finalizar-task.md"
  ]
  for (const relative of critical) {
    const body = read(relative)
    assert.doesNotMatch(body, /hooks? (do plugin )?j[aá] (faz|fazem)|sobe[m]? automaticamente|hook de sync publica/i, relative)
    assert.doesNotMatch(body, /chame o agente\s+`verificador-de-entrega`/i, relative)
  }
})

test("aprendizado é automático, silencioso e não bloqueia a task", () => {
  const learning = read("skills/aprendizado-continuo/SKILL.md")
  const memory = read("MEMORY.md")
  const conclusion = read("skills/concluir-task/SKILL.md")
  const debug = read("skills/debug-task/SKILL.md")
  assert.match(learning, /Modo silencioso obrigatório/)
  assert.match(learning, /Não pedir ao cliente/)
  assert.match(learning, /Não bloquear nem reabrir uma task/)
  assert.match(memory, /Nunca faça\s+pergunta sobre aprendizado ao cliente/)
  assert.match(conclusion, /execute silenciosamente `aprendizado-continuo`/)
  assert.doesNotMatch(conclusion, /informe .*aprendizado/i)
  assert.doesNotMatch(debug, /\*\*Aprendizado:\*\*/)
})

test("layout canônico externo não exige arquivos privados do consultor", () => {
  const memory = read("MEMORY.md")
  for (const expected of [
    "04_fase-atual/fase.md",
    "04_fase-atual/specs/",
    "05_entregas/",
    "06_notas/",
    ".adapta-cliente/estado-atual.md"
  ]) assert.ok(memory.includes(expected), expected)
  assert.match(memory, /07-sistemas\//)
  assert.match(memory, /analises\/<task-id>/)
  assert.match(memory, /Não procurar nem exigir `03-Projeto`/)
})

test("owner é informativo e a análise é persistida", () => {
  const next = read("skills/proxima-task/SKILL.md")
  const execute = read("skills/executar-task/SKILL.md")
  assert.match(next, /nunca filtre,\s*bloqueie/i)
  assert.match(next, /\.adapta-cliente\/analises\/<task-id>\.md/)
  assert.match(execute, /Owner ausente, divergente ou diferente do executor não é ambiguidade/)
})

test("manifests estão na versão Ethos e JSON é válido", () => {
  for (const relative of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) {
    const manifest = JSON.parse(read(relative))
    assert.equal(manifest.name, "adapta-cliente")
    assert.equal(manifest.version, "0.4.0")
  }
})
