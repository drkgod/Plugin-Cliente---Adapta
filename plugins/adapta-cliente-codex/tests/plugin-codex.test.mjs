import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

const ROOT = path.resolve(import.meta.dirname, "..")
const REPO_ROOT = path.resolve(ROOT, "..", "..")
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8")

function skillNames() {
  return fs.readdirSync(path.join(ROOT, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

test("manifest publica a edição Codex independente", () => {
  const manifest = JSON.parse(read(".codex-plugin/plugin.json"))
  const marketplace = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, ".agents", "plugins", "marketplace.json"), "utf8"))
  assert.equal(manifest.name, "adapta-cliente-codex")
  assert.equal(manifest.version, "0.3.0")
  assert.equal(manifest.skills, "./skills/")
  assert.equal(marketplace.plugins[0].name, manifest.name)
  assert.equal(marketplace.plugins[0].source.path, "./plugins/adapta-cliente-codex")
})

test("skills Codex são diretas e não dependem do Ethos", () => {
  const forbidden = /CLIENTE_ENVELOPE|skill-mind|MEMORY\.md|hooks? do plugin|ETHOS\/PicoClaw/i
  for (const skill of skillNames()) {
    const body = read(`skills/${skill}/SKILL.md`)
    assert.doesNotMatch(body, forbidden, skill)
  }
})

test("fluxo Codex preserva gates, estado e owner não bloqueante", () => {
  const next = read("skills/proxima-task/SKILL.md")
  const execute = read("skills/executar-task/SKILL.md")
  const conclude = read("skills/concluir-task/SKILL.md")
  const state = read("references/estado-v2.md")
  assert.match(next, /Nunca filtre ou bloqueie por owner\/dono/)
  assert.match(next, /\.adapta-cliente\/analises\/<task-id>\.md/)
  assert.match(execute, /aguardando_autorizacao/)
  assert.match(execute, /aguardando_teste_humano/)
  assert.match(conclude, /teste solicitado foi executado e aprovado/)
  assert.match(state, /adapta-cliente-state\/v2/)
})

test("plugin Codex entende o handoff v2 portável", () => {
  const next = read("skills/proxima-task/SKILL.md")
  assert.match(next, /consumer\.surface: codex/)
  assert.match(next, /consumer\.plugin:\s*adapta-cliente-codex/)
  assert.match(next, /07-sistemas\//)
  assert.match(next, /ausência do manifesto, sozinha, não bloqueia/)
  assert.match(next, /fase-format:2/)
  assert.match(next, /<!-- id:\.\.\. -->/)
})

test("persona Codex fala simples e ensina antes de indicar o consultor", () => {
  const persona = read("personas/agente-cliente.md")
  assert.match(persona, /## Como falar com o cliente/)
  assert.match(persona, /Existe um impedimento: <o que falta>/)
  assert.match(persona, /## Ensinar antes de chamar o consultor/)
  assert.match(persona, /três tentativas guiadas/)
  assert.match(persona, /DECISÃO DO CLIENTE:/)
  assert.doesNotMatch(persona, /retorna ao consultor/)
  for (const skill of skillNames()) {
    assert.doesNotMatch(read(`skills/${skill}/SKILL.md`), /vira `DÚVIDA:` e bloqueia|travas/, skill)
  }
})
