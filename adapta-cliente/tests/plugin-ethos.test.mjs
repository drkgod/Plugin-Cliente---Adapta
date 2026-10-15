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

test("SkillMind conduz o ciclo contínuo e só para em parada real", () => {
  const body = read("skills/skill-mind-cliente/SKILL.md")
  const memory = read("MEMORY.md")
  assert.match(body, /## 4\. Ciclo contínuo e paradas/)
  assert.match(body, /Nunca pare para pedir licença/)
  assert.match(body, /Na resposta em que pede um teste, não conclua as tasks que o esperam/)
  for (const field of ["aguardando_teste_humano", "aguardando_resposta", "aguardando_teste:", "em_espera:", "adapta-cliente-state/v3"]) {
    assert.ok(body.includes(field), field)
  }
  assert.match(body, /Estado anterior à 0\.8\.0 em `aguardando_autorizacao`/)
  assert.match(memory, /## Regra de ritmo: construir sem parar à toa/)
  assert.match(memory, /Pare só numa parada real/)
  assert.match(memory, /Resposta a uma pergunta não vale como teste aprovado/)
  assert.match(memory, /“Ok” solto depois de um pedido de teste é ambíguo/)
})

test("nenhuma instrução pede licença nem volta aos portões antigos", () => {
  const commandsRoot = path.join(ROOT, ".claude", "commands", "adapta-cliente")
  const files = [
    "MEMORY.md",
    "personas/agente-cliente.md",
    "agents/verificador-de-entrega.md",
    ...skillNames().map((skill) => `skills/${skill}/SKILL.md`),
    ...fs.readdirSync(commandsRoot).map((name) => `.claude/commands/adapta-cliente/${name}`)
  ]
  for (const relative of files) {
    const body = read(relative)
    assert.doesNotMatch(
      body,
      /hard stops?|dois portões|portão de teste|Posso implementar este plano|nova mensagem do usuário|encerre a resposta imediatamente|Pare imediatamente|autorização posterior ao relatório/i,
      relative
    )
    if (relative !== "skills/skill-mind-cliente/SKILL.md") {
      assert.doesNotMatch(body, /aguardando_autorizacao/, relative)
    }
  }
})

test("teste do cliente só nos momentos certos e conclusão pela prova automática", () => {
  const memory = read("MEMORY.md")
  const execute = read("skills/executar-task/SKILL.md")
  const conclude = read("skills/concluir-task/SKILL.md")
  const debug = read("skills/debug-task/SKILL.md")
  assert.match(memory, /### Quando pedir teste ao cliente/)
  assert.match(memory, /já há três tasks com mudança visível no ar sem o teste dele/)
  assert.match(execute, /## Decidir o teste/)
  assert.match(execute, /Quando pedir teste ao cliente/)
  assert.match(execute, /nao_aplicavel:<prova>/)
  assert.match(execute, /Nunca chame `concluir-task` para uma task que espera teste do cliente/)
  assert.match(conclude, /\*\*prova automática\*\*/)
  assert.match(conclude, /devolva ao SkillMind, que segue o ciclo/)
  assert.match(debug, /reteste só do que falhou/)
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
  assert.match(memory, /Antes de cada parada, executar `aprendizado-continuo` uma vez/)
  assert.match(read("skills/skill-mind-cliente/SKILL.md"), /triagem silenciosa de `aprendizado-continuo`/)
  assert.match(conclusion, /executa silenciosamente\s+`aprendizado-continuo`/)
  assert.match(conclusion, /`aprendizado: pendente`/)
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
    assert.equal(manifest.version, "0.8.0")
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
  assert.match(conclude, /modo\s+`registrar`/)
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

test("GitHub recebe um commit por parada, nada entre tasks e sem laço", () => {
  const memory = read("MEMORY.md")
  const sync = read("skills/publicar-e-sincronizar/SKILL.md")
  const next = read("skills/proxima-task/SKILL.md")
  const debug = read("skills/debug-task/SKILL.md")
  const conclude = read("skills/concluir-task/SKILL.md")
  const mind = read("skills/skill-mind-cliente/SKILL.md")
  assert.match(memory, /### Quando e como enviar ao GitHub/)
  assert.match(memory, /Envie uma vez por parada/)
  assert.match(memory, /Entre uma task e outra da mesma resposta não há envio/)
  assert.match(memory, /No máximo uma nova tentativa/)
  assert.match(sync, /\| `enviar` \| SkillMind, antes de cada parada \|/)
  assert.match(sync, /um único commit/)
  assert.match(sync, /push_files/)
  assert.match(sync, /Não releia os arquivos para provar/)
  assert.match(sync, /consulte o último commit da branch/)
  assert.match(sync, /uma nova tentativa no máximo/)
  assert.match(sync, /Sem repositório local/)
  assert.match(mind, /modo `enviar`/)
  assert.match(mind, /pendente_github/)
  assert.match(next, /Não envie nada ao GitHub nesta etapa/)
  assert.doesNotMatch(next, /modo `registrar`/)
  assert.match(debug, /Nada vai ao GitHub nesta etapa/)
  assert.match(conclude, /não envie nada ao GitHub agora/)
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
  assert.match(mind, /ficam nos arquivos, não na\s+conversa/)
  for (const skill of ["proxima-task", "executar-task", "debug-task", "ui-ux-sistemas"]) {
    assert.match(read(`skills/${skill}/SKILL.md`), /DECISÃO DO CLIENTE:/, skill)
  }
})

test("regras valem só no projeto registrado, nunca em outra conversa ou projeto", () => {
  const memory = read("MEMORY.md")
  const mind = read("skills/skill-mind-cliente/SKILL.md")
  const sync = read("skills/publicar-e-sincronizar/SKILL.md")
  assert.match(memory, /## Quando esta memória vale/)
  assert.match(memory, /Projeto Adapta registrado:/)
  assert.match(memory, /Todo o resto — outra conversa, outro assunto, outro\s+repositório, outro projeto do Skip — segue o comportamento normal/)
  assert.match(memory, /Para qualquer pedido do projeto registrado/)
  assert.match(memory, /um projeto listado em\s+`07-sistemas\/<sistema>\/plataforma\.md` do projeto registrado/)
  assert.match(memory, /Só o repositório do projeto registrado recebe envios/)
  assert.doesNotMatch(memory, /Vale para toda resposta que alterar um projeto pelo MCP do Skip/)
  assert.match(mind, /description: .*projeto Adapta registrado/)
  assert.match(mind, /não use em outros assuntos, repositórios ou projetos do Skip/)
  assert.match(mind, /Antes de tudo, confirme que o pedido é do projeto registrado/)
  assert.match(mind, /preservando a nota “Projeto Adapta registrado”/)
  assert.match(sync, /nunca\s+publica ou envia nada de outro repositório ou projeto/)
})

test("hooks opcionais não agem fora do repositório do cliente", () => {
  for (const script of ["session-start.sh", "sync-github.sh", "guarda-seguranca.sh"]) {
    const body = read(`hooks/scripts/${script}`)
    assert.match(body, /04_fase-atual\/fase\.md" \] \|\| exit 0/, script)
  }
})
