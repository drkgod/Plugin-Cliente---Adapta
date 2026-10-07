# Textos e formatos em PT-BR

Palavras são parte da interface. Escreva do lado de quem usa a tela.

## Regras de escrita

- Nomeie pelo que a pessoa controla, não pelo que o sistema faz por dentro: "Notificações", não
  "Webhooks"; "Clientes", não "Registros da coleção clientes".
- Botão diz exatamente o que acontece, com verbo: "Salvar cliente", "Enviar convite",
  "Excluir 3 demandas". Evite "OK", "Submeter" e "Enviar" genérico.
- A mesma ação tem o mesmo nome no fluxo inteiro: botão "Publicar" gera o aviso "Publicado".
- Só a primeira letra maiúscula em títulos e botões; sem ponto final em botão e título.
- Erro diz o que aconteceu e como resolver, na voz da interface, sem pedir desculpas e sem culpar
  a pessoa: "Informe um e-mail válido, como nome@empresa.com.br."
- Tela vazia é convite para agir: "Nenhum cliente cadastrado. Cadastre o primeiro para começar."
- Seja específico em vez de criativo. Sem gíria, sem jargão técnico e sem inglês desnecessário.
- Plural correto: "Nenhum cliente", "1 cliente", "2 clientes".
- Use o vocabulário da SPEC e do cliente para as entidades; não renomeie.
- Concorde o gênero com a entidade: "Cliente cadastrado", "Demanda cadastrada".

## Mensagens prontas

| Situação | Texto |
|---|---|
| Campo obrigatório | "Preencha <campo>." |
| E-mail inválido | "Informe um e-mail válido, como nome@empresa.com.br." |
| Valor duplicado | "Já existe <entidade> com este <campo>." |
| Mínimo de caracteres | "Use pelo menos <n> caracteres." |
| Falha ao carregar | "Não foi possível carregar <entidade>. Verifique a conexão e tente de novo." |
| Falha ao salvar | "Não foi possível salvar. Seus dados continuam no formulário; tente de novo." |
| Escrita sem resposta | "Sem resposta do servidor. Confira se <entidade> foi salvo antes de tentar de novo." |
| Servidor ocupado | "O sistema está ocupado. Tente de novo em instantes." |
| Sem permissão | "Você não tem permissão para <ação>. Fale com o administrador." |
| Sessão expirada | "Sua sessão expirou. Entre de novo para continuar." |
| Sucesso ao criar | "<Entidade> cadastrado." |
| Sucesso ao salvar | "Alterações salvas." |
| Sucesso ao excluir | "<Entidade> excluído." |
| Confirmar exclusão | Título "Excluir <nome>?", texto "Esta ação não pode ser desfeita.", botões "Cancelar" e "Excluir" |
| Descartar alterações | "Descartar alterações? O que você preencheu será perdido." |
| Busca sem resultado | "Nenhum resultado para "<termo>". Revise a busca ou limpe os filtros." |

## Erros do servidor em português

As mensagens do PocketBase chegam em inglês, e o `getErrorMessage` gerado pelo template também
cai em inglês. Não mostre inglês ao usuário: traduza pelo código do erro com a receita
`mensagens-erro.ts` de `../../construir-codigo/references/receitas-dados.md`.

| Código ou status | Mensagem |
|---|---|
| `validation_required` | "Preencha este campo." |
| `validation_not_unique` | "Este valor já está em uso." |
| `validation_is_email` | "Informe um e-mail válido." |
| `validation_min_text_constraint` | "Texto curto demais." |
| `validation_max_text_constraint` | "Texto longo demais." |
| `validation_file_size_limit` | "Arquivo maior que o permitido." |
| `validation_missing_rel_records` | "O registro relacionado não existe mais." |
| HTTP 401 | mensagem de sessão expirada |
| HTTP 403 | "Você não tem permissão para esta ação." |
| HTTP 404 | "Registro não encontrado. Ele pode ter sido excluído." |
| HTTP 0, 429 ou 503 | mensagens de escrita sem resposta ou de servidor ocupado |

## Formatos brasileiros

Use `Intl` e `date-fns`, que o template já tem. Guarde no banco o valor cru (número, data ISO,
só dígitos) e formate apenas na tela.

```ts
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
moeda.format(1234.5) // "R$ 1.234,50"

const numero = new Intl.NumberFormat('pt-BR')
numero.format(1234567) // "1.234.567"

const percentual = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 })
percentual.format(0.125) // "12,5%"
```

```ts
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

format(parseISO(registro.created), 'dd/MM/yyyy', { locale: ptBR }) // "07/10/2026"
format(parseISO(registro.created), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) // "07/10/2026 às 14:30"
formatDistanceToNow(parseISO(registro.updated), { addSuffix: true, locale: ptBR }) // "há 2 dias"
```

Máscaras de documento e contato (exibição e digitação; salve só os dígitos):

| Dado | Formato | Teclado |
|---|---|---|
| CPF | 000.000.000-00 | `inputMode="numeric"` |
| CNPJ | 00.000.000/0000-00 | `inputMode="numeric"` |
| Celular | (00) 00000-0000 | `type="tel"` |
| Telefone fixo | (00) 0000-0000 | `type="tel"` |
| CEP | 00000-000 | `inputMode="numeric"` |
| Valor em reais | R$ 1.234,56 | `inputMode="decimal"` |

As funções de máscara prontas estão em `formatos.ts`, em
`../../construir-codigo/references/receitas-dados.md`. Validação de dígito verificador de CPF ou
CNPJ só quando a SPEC pedir, e sempre repetida no servidor.
