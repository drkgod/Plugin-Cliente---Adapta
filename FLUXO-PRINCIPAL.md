# Fluxo principal — Plugin Adapta Cliente

Este é o texto canônico para explicar o onboarding e a execução no site (edição Ethos, 0.8.0). A
estrutura de pastas do repositório operacional permanece:

- `04_fase-atual/fase.md`
- `04_fase-atual/specs/`
- `05_entregas/`
- `06_notas/`
- `07-sistemas/`
- `STATUS.md`
- `changelog.md`

## O caminho do cliente

1. **Configurar:** instalar o plugin, ativar a memória e confirmar os acessos em uma única entrada.
2. **Pedir o trabalho:** o cliente pede para começar ou continuar a fase. Esse pedido autoriza o
   assistente a construir as tasks em sequência, sempre dentro da SPEC.
3. **Construir:** uma task por vez, o assistente analisa a fundo, implementa, roda as
   verificações, publica na plataforma de construção com prova e segue para a próxima, sem pedir
   licença a cada passo.
4. **Responder e testar:** o assistente só para quando precisa do cliente: uma pergunta de
   negócio que a SPEC não define (todas juntas, com recomendação), um teste no endereço publicado
   quando uma tela ou um fluxo fica pronto, um impedimento ou o fim da fase. Antes de parar, salva
   tudo no GitHub em um único envio.
5. **Aprovar ou corrigir:** se o teste funcionar, as tasks testadas são concluídas e o trabalho
   continua; se falhar, a mesma task volta para debug e o cliente testa de novo só o que falhou.

Cada task tem análise, verificação e prova próprias; o assistente nunca mistura duas tasks no
mesmo conjunto de alterações. “Só analise”, “uma task por vez” e “pare” são respeitados.

## Cinco prompts públicos

### 1. Configurar

```text
Quero configurar o Plugin Adapta Cliente neste projeto.

Plugin: https://github.com/drkgod/Plugin-Cliente---Adapta
Repositório do projeto: <URL-GITHUB>
Plataforma de construção: <URL-DO-PROJETO>
Champion responsável pelo teste: <NOME-E-PAPEL>
Fonte oficial dos arquivos: GitHub

Instale ou atualize o plugin, use skill-mind-cliente e confirme a memória persistente, os acessos
e a estrutura operacional. Não abra nem implemente uma task nesta resposta.
```

### 2. Trabalhar

```text
Use skill-mind-cliente para começar ou continuar o trabalho da fase.
```

### 3. Responder

```text
Pode seguir com as recomendações.
```

Ou a resposta de cada pergunta, na ordem em que o assistente perguntou.

### 4. Aprovar

```text
Fiz o teste que você pediu e funcionou. Pode concluir e seguir.
```

### 5. Relatar falha

```text
O teste falhou.
Passo que falhou: <NÚMERO-OU-DESCRIÇÃO>
O que apareceu: <O-QUE-APARECEU>
O que eu esperava: <RESULTADO>
```

## Contrato das tasks do portal

Quando `04_fase-atual/fase.md` usar `<!-- fase-format:2 -->`, o plugin interpreta:

- `[ ]` como a fazer, `[/]` como em andamento e `[x]` como concluída;
- linhas `>` como descrição do card;
- indentação como hierarquia de subtasks;
- `@responsável`, `!prazo`, `#tipo` e `[interno]` como metadados;
- `<!-- id:... -->` como identidade estável, que nunca pode ser apagada.

O formato tabular antigo continua legível para projetos existentes.

## O que realmente faz o assistente parar

- `04_fase-atual/fase.md` ausente ou sem task identificável;
- SPEC ausente ou conflitante;
- raiz executável ausente ou ambígua;
- dependência declarada da task não atendida, sem outra task independente para seguir;
- detalhe de negócio que a SPEC não define, ou ação de risco sobre dados existentes;
- publicação na plataforma de construção sem prova;
- teste do cliente necessário (tela ou fluxo pronto, três tasks visíveis sem teste, serviço
  externo, mudança no que a equipe já usa ou aprovação pedida pela SPEC);
- fase concluída.

Owner diferente do executor, ausência de `handoff-manifest.json`, check separado ou formulário de
liberação não impedem uma task válida. Todo impedimento é explicado ao cliente com o porquê e o que
fazer, e o assistente ensina a resolver antes de indicar o consultor.

## Texto recomendado para o site

- Use “segredos” no lugar de “secrets”.
- Use “plataforma de construção” e apresente Skip apenas como exemplo.
- Descreva a IA como responsável por analisar, construir, verificar e publicar em sequência; o
  cliente pede o trabalho, responde às decisões de negócio e testa o resultado real.
- Evite nomes de clientes reais em páginas públicas.
- Não apresente instalação da memória como um segundo ou terceiro comando.
- Fale de “impedimento” com contexto (“existe um impedimento: X, porque Y”), nunca de “bloqueio”.
- Apresente o consultor como apoio para decisões de escopo; o dia a dia o assistente ensina o
  cliente a resolver.
- Detalhes de negócio que a especificação não define são decisão do cliente.
