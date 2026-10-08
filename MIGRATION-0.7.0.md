# Migração 0.7.0 — falar simples, explicar impedimentos e ensinar antes de escalar

Vale para as duas edições: `adapta-cliente` 0.7.0 (Ethos) e `adapta-cliente-codex` 0.3.0.

## Antes

- respostas cheias de nomes internos: etapas do estado, gate, rota, hash de versão, “NÃO PRONTA”;
- “bloqueado” e “trava” sem explicar o motivo nem o que fazer;
- qualquer dúvida de requisito, falta de acesso ou falha repetida mandava o cliente ao consultor,
  gerando suporte que o próprio cliente resolveria com orientação;
- detalhe de negócio que a SPEC não definia virava pergunta para o consultor.

## Agora

- **Linguagem simples por padrão.** Termo técnico só quando o cliente precisa dele para agir (por
  exemplo, API ou chave de acesso), explicado em uma frase. Nomes internos ficam nos arquivos.
- **Impedimento com contexto**, sempre no formato: “Existe um impedimento: <o que falta>. Isso
  acontece porque <contexto>. Para seguir, <o que fazer e quem faz>.”
- **Ensinar antes de chamar o consultor.** O agente explica, ensina o passo a passo, pede para o
  cliente fazer e confere. O consultor só entra depois de três tentativas guiadas sem sucesso, ou
  direto em: mudança de escopo, de SPEC ou de critério de aceite; risco de perder dados ou de
  segurança; acesso ou decisão que só o consultor tem. Ao indicar, entrega uma mensagem pronta.
- **O cliente decide detalhes de negócio** que a SPEC não define. O agente mostra as opções e a
  consequência de cada uma, registra `DECISÃO DO CLIENTE:` no `changelog.md` e na análise e segue.
- **Mensagens de cada etapa reescritas:** resumo da análise, pedido de teste, retorno de debug,
  conclusão, “ainda não dá para concluir” e status. O detalhe técnico fica nos arquivos e aparece
  só se o cliente pedir.
- **Segredo nunca na conversa:** o agente ensina onde cadastrar chave, senha ou token, em vez de
  pedir para colar no chat.
- Persona com vocabulário (termo técnico → como dizer), frases para cada etapa e modelos de
  impedimento, decisão do cliente e indicação do consultor.
- Memória `adapta-cliente-memory 0.7.0`, substituída sozinha no próximo uso.

## Exemplo

Antes:

> Task 2.1 bloqueada: falta credencial da API do WhatsApp. Acione o consultor.

Agora:

> Existe um impedimento: o sistema ainda não tem a chave de acesso do WhatsApp. Ela funciona como
> uma senha que permite enviar mensagens em nome da empresa; sem ela, o envio não sai. Para seguir:
> 1. entre no painel da Meta…; 2. gere a chave de acesso…; 3. cadastre a chave no campo de segredos
> do sistema, que eu te mostro onde — não cole a chave aqui na conversa. Quando terminar, me diga
> “pronto”.
