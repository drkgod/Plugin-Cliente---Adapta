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

test("bundle entrega a memória e SkillMind pede a instalação nativa ao Ethos", () => {
  const mind = read("skills/skill-mind-cliente/SKILL.md")
  const memory = read("MEMORY.md")
  assert.ok(memory.length > 0)
  assert.match(mind, /Se esta memória ainda não estiver instalada/)
  assert.match(mind, /\.\.\/\.\.\/MEMORY\.md/)
  assert.doesNotMatch(mind, /memory add|instalar-memory-ethos/i)
  assert.equal(fs.existsSync(path.join(ROOT, "scripts", "instalar-memory-ethos.mjs")), false)
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
    "skills/ui-ux-sistemas/SKILL.md",
    "skills/construir-codigo/SKILL.md",
    "skills/publicar-e-sincronizar/SKILL.md",
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

test("fase-format:2 é suportado sem alterar a estrutura de pastas", () => {
  const memory = read("MEMORY.md")
  const next = read("skills/proxima-task/SKILL.md")
  const conclude = read("skills/concluir-task/SKILL.md")
  const status = read("skills/status/SKILL.md")
  assert.match(memory, /fase-format:2/)
  assert.match(memory, /04_fase-atual\/fase\.md/)
  assert.match(next, /- \[\/\]/)
  assert.match(next, /<!-- id:\.\.\. -->/)
  assert.match(conclude, /checkbox para `\[x\]`/)
  assert.match(status, /todos os checkboxes/)
})

test("manifesto é compatibilidade opcional e não uma trava sem produtor", () => {
  const mind = read("skills/skill-mind-cliente/SKILL.md")
  assert.match(mind, /Se\s+`handoff-manifest\.json` existir/)
  assert.match(mind, /ausência do manifesto, sozinha, não bloqueia/)
  assert.doesNotMatch(mind, /Confirme também\s+`STATUS\.md`, `changelog\.md`, `handoff-manifest\.json`/)
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
    assert.equal(manifest.version, "0.7.0")
  }
})

const SUPPORT_SKILLS = ["ui-ux-sistemas", "construir-codigo", "publicar-e-sincronizar"]

test("skills de apoio existem, não viram rota e declaram origem", () => {
  const memory = read("MEMORY.md")
  assert.match(memory, /### Skills de apoio \(não são rotas\)/)
  for (const skill of SUPPORT_SKILLS) {
    const body = read(`skills/${skill}/SKILL.md`)
    assert.match(body, /não é rota/, skill)
    assert.ok(memory.includes(`| \`${skill}\` |`), `Skill de apoio fora do índice: ${skill}`)
  }
  for (const skill of ["ui-ux-sistemas", "construir-codigo"]) {
    const body = read(`skills/${skill}/SKILL.md`)
    assert.match(body, /Origem: reempacotado de ui-ux-pro-max/, skill)
    assert.match(body, /decisão D6/, skill)
  }
})

test("caminhos citados nas instruções existem", () => {
  const files = [
    "MEMORY.md",
    "personas/agente-cliente.md",
    "agents/verificador-de-entrega.md",
    ...skillNames().map((skill) => `skills/${skill}/SKILL.md`)
  ]
  for (const skill of skillNames()) {
    const refs = path.join(ROOT, "skills", skill, "references")
    if (fs.existsSync(refs)) {
      for (const file of fs.readdirSync(refs)) files.push(`skills/${skill}/references/${file}`)
    }
  }
  for (const relative of files) {
    const body = read(relative)
    for (const [, cited] of body.matchAll(/`((?:\.\.\/|references\/|skills\/|agents\/|personas\/)[^`<>*\s]+\.md)`/g)) {
      const base = /^(skills|agents|personas)\//.test(cited) ? ROOT : path.dirname(path.join(ROOT, relative))
      assert.ok(fs.existsSync(path.resolve(base, cited)), `${relative} cita caminho inexistente: ${cited}`)
    }
  }
})

test("MEMORY obriga publicar no Skip e atualizar o GitHub", () => {
  const memory = read("MEMORY.md")
  assert.match(memory, /## Regra de entrega: Skip publicado e GitHub atualizado/)
  assert.match(memory, /skip_project_apply_changes/)
  assert.match(memory, /skip_project_publish/)
  assert.match(memory, /\.skip\.config\.json/)
  assert.match(memory, /push sem força/)
  assert.match(memory, /confirmPrune/)
  assert.doesNotMatch(memory, /Push nunca é requisito/)
  assert.match(memory, /envios ao GitHub[\s>]+pendentes/)
  assert.match(memory, /Nunca abra task nova com envio pendente/)
  assert.match(read("skills/proxima-task/SKILL.md"), /último envio ao GitHub não chegou/)
})

test("SkillMind substitui a memória instalada quando a versão muda", () => {
  const memory = read("MEMORY.md")
  const mind = read("skills/skill-mind-cliente/SKILL.md")
  const version = memory.match(/adapta-cliente-memory (\d+\.\d+\.\d+)/)?.[1]
  const manifest = JSON.parse(read(".claude-plugin/plugin.json"))
  assert.equal(version, manifest.version)
  assert.ok(mind.includes(`adapta-cliente-memory ${version}`))
  assert.match(mind, /substituindo a versão anterior/)
})

test("execução e debug publicam e sincronizam antes do teste humano", () => {
  for (const skill of ["executar-task", "debug-task"]) {
    const body = read(`skills/${skill}/SKILL.md`)
    assert.match(body, /construir-codigo\/SKILL\.md/, skill)
    assert.match(body, /publicar-e-sincronizar\/SKILL\.md/, skill)
    assert.match(body, /modo `entregar`/, skill)
    assert.match(body, /URL de produção/, skill)
  }
  const conclude = read("skills/concluir-task/SKILL.md")
  assert.match(conclude, /modo `registrar`/)
  assert.match(conclude, /versão no ar precisa ser a mesma que o cliente testou/)
  assert.doesNotMatch(conclude, /se houver sincronização Git solicitada/)
})

test("publicação prova a versão, ignora .skip.config.json e nunca força", () => {
  const body = read("skills/publicar-e-sincronizar/SKILL.md")
  assert.match(body, /nunca rode `skip_project_apply_changes` só por causa dele/)
  assert.match(body, /versionHash/)
  assert.match(body, /git ls-remote/)
  assert.match(body, /push sem força/i)
  assert.match(body, /`\.env\*`/)
  assert.match(body, /`confirmPrune: true`/)
  for (const mode of ["configurar", "registrar", "entregar", "verificar"]) {
    assert.match(body, new RegExp(`\`${mode}\``), mode)
  }
})

test("GitHub recebe um commit por momento de envio, nada na análise e sem laço", () => {
  const memory = read("MEMORY.md")
  const sync = read("skills/publicar-e-sincronizar/SKILL.md")
  const next = read("skills/proxima-task/SKILL.md")
  const debug = read("skills/debug-task/SKILL.md")
  assert.match(memory, /### Quando e como enviar ao GitHub/)
  assert.match(memory, /No máximo uma nova tentativa/)
  assert.match(sync, /um único commit/)
  assert.match(sync, /push_files/)
  assert.match(sync, /Não releia os arquivos para provar/)
  assert.match(sync, /consulte o último commit da branch/)
  assert.match(sync, /uma nova tentativa no máximo/)
  assert.match(next, /Não envie nada ao GitHub nesta etapa/)
  assert.doesNotMatch(next, /modo `registrar`/)
  assert.match(debug, /Correção sem alteração no\s+Skip não envia nada agora/)
  assert.match(read("skills/skill-mind-cliente/SKILL.md"), /pendente_github/)
})

test("tasks com tela usam Ficha de Tela, checklist de UI e roteiro visual", () => {
  const next = read("skills/proxima-task/SKILL.md")
  const ui = read("skills/ui-ux-sistemas/SKILL.md")
  const verifier = read("agents/verificador-de-entrega.md")
  assert.match(next, /Ficha de Tela/)
  assert.match(next, /teste de mesa/)
  assert.match(ui, /### Ficha de Tela/)
  assert.match(ui, /## 4\. Checklist de UI/)
  assert.match(ui, /## 5\. Roteiro de teste humano para telas/)
  assert.match(verifier, /ui-ux-sistemas/)
})

test("protocolo de código substitui o harness sem atalhos", () => {
  const body = read("skills/construir-codigo/SKILL.md")
  for (const expected of [
    "## 1. MAPA",
    "## 2. PLANO EM CÓDIGO",
    "## 3. EDIÇÃO CIRÚRGICA",
    "## 4. QA",
    "## 5. REVISÃO",
    "skip_file_patch",
    "teste de mesa",
    "@ts-ignore",
    "src/lib/pocketbase/client.ts"
  ]) assert.ok(body.includes(expected), expected)
})

test("skills e referências cabem no contexto do agente", () => {
  for (const skill of skillNames()) {
    const lines = read(`skills/${skill}/SKILL.md`).split("\n").length
    assert.ok(lines <= 200, `${skill}/SKILL.md tem ${lines} linhas`)
    const refs = path.join(ROOT, "skills", skill, "references")
    if (!fs.existsSync(refs)) continue
    for (const file of fs.readdirSync(refs)) {
      const count = fs.readFileSync(path.join(refs, file), "utf8").split("\n").length
      assert.ok(count <= 650, `${skill}/references/${file} tem ${count} linhas`)
    }
  }
})

test("cliente recebe linguagem simples, impedimento com contexto e ensino antes do consultor", () => {
  const memory = read("MEMORY.md")
  const persona = read("personas/agente-cliente.md")
  assert.match(memory, /## Regra de comunicação com o cliente/)
  assert.match(memory, /Existe um impedimento: <o que falta>/)
  assert.match(memory, /### Ensinar antes de chamar o consultor/)
  assert.match(memory, /três tentativas guiadas/)
  assert.match(memory, /DECISÃO DO CLIENTE:/)
  assert.match(memory, /Nunca peça para colar senha, chave ou token na conversa/)
  assert.match(persona, /## Como falar com o cliente/)
  assert.match(persona, /### Vocabulário/)
  assert.match(persona, /### Cada etapa em palavras simples/)
  assert.match(persona, /Mensagem pronta para você enviar/)
})

test("instruções não mandam direto ao consultor nem expõem jargão interno ao cliente", () => {
  const files = [
    "MEMORY.md",
    "personas/agente-cliente.md",
    "agents/verificador-de-entrega.md",
    ...skillNames().map((skill) => `skills/${skill}/SKILL.md`)
  ]
  for (const relative of files) {
    const body = read(relative)
    assert.doesNotMatch(
      body,
      /mostre a trava|travas? ativas?|Gate atual|gate pendente|siga para o consultor|fale com o consultor|avise o consultor|retorna ao consultor|GitHub desatualizado/i,
      relative
    )
  }
  const mind = read("skills/skill-mind-cliente/SKILL.md")
  assert.doesNotMatch(mind, /Informe: rota escolhida/)
  assert.match(mind, /ficam nos arquivos, não na conversa/)
  for (const skill of ["proxima-task", "executar-task", "debug-task", "ui-ux-sistemas"]) {
    assert.match(read(`skills/${skill}/SKILL.md`), /DECISÃO DO CLIENTE:/, skill)
  }
})
