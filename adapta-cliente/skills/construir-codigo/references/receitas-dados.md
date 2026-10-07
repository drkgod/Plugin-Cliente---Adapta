# Receitas de dados no padrão do template Skip

Código-base que compila com o template (TypeScript, PocketBase, date-fns). A entidade de exemplo é
`clientes`: troque pelos nomes da SPEC e do `schema.json`, e apague o que a SPEC não pede — o
aceite é teto. Antes de criar um arquivo, confira no mapa se o projeto já tem um equivalente e
reutilize. As telas que usam estas peças estão em `receitas-telas.md`.

## 1. Serviço da entidade — `src/services/clientes.ts`

```ts
import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

export interface Cliente extends RecordModel {
  nome: string
  email: string
  status: 'ativo' | 'inativo'
  created: string
  updated: string
}

export interface ClienteEntrada {
  nome: string
  email: string
  status: Cliente['status']
}

export interface FiltroClientes {
  busca?: string
  status?: Cliente['status']
}

export function listarClientes(pagina: number, porPagina: number, filtro: FiltroClientes = {}) {
  const partes: string[] = []
  const params: Record<string, string> = {}
  if (filtro.busca) {
    partes.push('(nome ~ {:busca} || email ~ {:busca})')
    params.busca = filtro.busca
  }
  if (filtro.status) {
    partes.push('status = {:status}')
    params.status = filtro.status
  }
  return pb.collection<Cliente>('clientes').getList(pagina, porPagina, {
    filter: partes.length > 0 ? pb.filter(partes.join(' && '), params) : '',
    sort: '-created',
  })
}

export const obterCliente = (id: string) => pb.collection<Cliente>('clientes').getOne(id)

export const criarCliente = (dados: ClienteEntrada) =>
  pb.collection<Cliente>('clientes').create(dados)

export const atualizarCliente = (id: string, dados: Partial<ClienteEntrada>) =>
  pb.collection<Cliente>('clientes').update(id, dados)

export const excluirCliente = (id: string) => pb.collection('clientes').delete(id)
```

Para servidor ocupado (429 ou 503) em leituras, use o auxiliar `request.ts` da seção 7 do
`skip_cloud_sdk_guide`, se o projeto ainda não tiver um.

## 2. Erros em português — `src/lib/mensagens-erro.ts`

```ts
import { ClientResponseError } from 'pocketbase'

const POR_CODIGO: Record<string, string> = {
  validation_required: 'Preencha este campo.',
  validation_not_unique: 'Este valor já está em uso.',
  validation_is_email: 'Informe um e-mail válido.',
  validation_min_text_constraint: 'Texto curto demais.',
  validation_max_text_constraint: 'Texto longo demais.',
  validation_file_size_limit: 'Arquivo maior que o permitido.',
  validation_missing_rel_records: 'O registro relacionado não existe mais.',
}

/** Erros por campo, já em português, prontos para form.setError. */
export function errosDeCampo(erro: unknown): Record<string, string> {
  if (!(erro instanceof ClientResponseError)) return {}
  const dados = erro.response?.data
  if (!dados || typeof dados !== 'object') return {}
  const saida: Record<string, string> = {}
  for (const [campo, detalhe] of Object.entries(dados)) {
    if (!detalhe || typeof detalhe !== 'object') continue
    const { code, message } = detalhe as { code?: string; message?: string }
    saida[campo] = (code && POR_CODIGO[code]) || message || 'Valor inválido.'
  }
  return saida
}

/** Mensagem geral para toast ou Alert. `acao` completa a frase: "salvar o cliente". */
export function mensagemDeErro(erro: unknown, acao = 'concluir a ação'): string {
  if (erro instanceof ClientResponseError) {
    if (erro.status === 0) {
      return 'Sem resposta do servidor. Confira a conexão e se a ação foi concluída antes de tentar de novo.'
    }
    if (erro.status === 401) return 'Sua sessão expirou. Entre de novo para continuar.'
    if (erro.status === 403) return `Você não tem permissão para ${acao}.`
    if (erro.status === 404) return 'Registro não encontrado. Ele pode ter sido excluído.'
    if (erro.status === 429 || erro.status === 503) {
      return 'O sistema está ocupado. Tente de novo em instantes.'
    }
    if (Object.keys(errosDeCampo(erro)).length > 0) return 'Revise os campos destacados.'
  }
  return `Não foi possível ${acao}. Tente de novo.`
}
```

## 3. Formatos brasileiros — `src/lib/formatos.ts`

```ts
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const numero = new Intl.NumberFormat('pt-BR')

export const formatarMoeda = (valor: number) => moeda.format(valor)
export const formatarNumero = (valor: number) => numero.format(valor)

function data(iso: string) {
  const valor = iso ? parseISO(iso) : null
  return valor && isValid(valor) ? valor : null
}

export function formatarData(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, 'dd/MM/yyyy', { locale: ptBR }) : '—'
}

export function formatarDataHora(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '—'
}

export function formatarRelativo(iso: string) {
  const valor = data(iso)
  return valor ? formatDistanceToNow(valor, { addSuffix: true, locale: ptBR }) : '—'
}

export const soDigitos = (valor: string) => valor.replace(/\D/g, '')

export const mascaraCPF = (valor: string) =>
  soDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')

export const mascaraCNPJ = (valor: string) =>
  soDigitos(valor)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')

export function mascaraTelefone(valor: string) {
  const digitos = soDigitos(valor).slice(0, 11)
  if (digitos.length <= 10) {
    return digitos.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digitos.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
}

export const mascaraCEP = (valor: string) =>
  soDigitos(valor).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')

/** "R$ 1.234,56" → 1234.56; texto vazio ou inválido → null. */
export function paraNumero(texto: string): number | null {
  const limpo = texto.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  if (limpo === '' || limpo === '-') return null
  const valor = Number(limpo)
  return Number.isFinite(valor) ? valor : null
}
```

O PocketBase grava datas como `2026-10-07 14:30:00.123Z`; o `parseISO` aceita esse formato.

## 4. Migration aditiva — `pocketbase/migrations/NNNN_add_telefone_clientes.js`

```js
migrate(
  (app) => {
    const colecao = app.findCollectionByNameOrId('clientes')
    if (!colecao.fields.getByName('telefone')) {
      colecao.fields.add(new TextField({ name: 'telefone', max: 20 }))
    }
    app.save(colecao)
  },
  (app) => {
    const colecao = app.findCollectionByNameOrId('clientes')
    colecao.fields.removeByName('telefone')
    app.save(colecao)
  },
)
```

Coleção nova: copie o exemplo da seção 2 do `skip_cloud_migrations_guide`, com as cinco regras de
acesso e os campos `created` e `updated`.

## 5. Teste de mesa (vai na análise e é refeito na revisão)

```markdown
| Caso | Entrada | Saída esperada | Onde o código garante | Resultado |
|---|---|---|---|---|
| Principal | nome "Ana Souza", e-mail válido | cliente criado, aviso "Cliente cadastrado." | FormularioCliente.enviar | ok |
| Limite | nome com 2 letras | aceito | esquema.nome min(2) | ok |
| Erro | e-mail já usado | mensagem no campo e-mail | errosDeCampo + validation_not_unique | ok |
```

Cada linha cita a função ou regra que produz a saída. Linha sem lugar no código é falha.
