# Receitas de telas no padrão do template Skip

Código-base que compila com o template (React 19, TypeScript, shadcn/ui). Usa o serviço, os erros
e os formatos de `receitas-dados.md`. A entidade de exemplo é `clientes`: troque pelos nomes da
SPEC e apague o que a SPEC não pede — o aceite é teto. Antes de criar um componente, confira no
mapa se o projeto já tem um equivalente (por exemplo, um `EmptyState`) e reutilize.

O `Button` do template já garante 44 px de altura no celular e espaço entre ícone e texto: não
acrescente altura, margem ou tamanho de ícone por classe.

## 1. Página de lista com todos os estados — `src/pages/Clientes.tsx`

```tsx
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { Plus, RefreshCw, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmarExclusao } from '@/components/ConfirmarExclusao'
import { CardsClientes } from '@/components/clientes/CardsClientes'
import { FormularioCliente } from '@/components/clientes/FormularioCliente'
import { TabelaClientes } from '@/components/clientes/TabelaClientes'
import { useIsMobile } from '@/hooks/use-mobile'
import { useRealtime } from '@/hooks/use-realtime'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import { excluirCliente, listarClientes, type Cliente } from '@/services/clientes'

const POR_PAGINA = 20

export default function Clientes() {
  const isMobile = useIsMobile()
  const [itens, setItens] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [busca, setBusca] = useState('')
  const [termo, setTermo] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [formAberto, setFormAberto] = useState(false)
  const [emEdicao, setEmEdicao] = useState<Cliente | undefined>(undefined)
  const [paraExcluir, setParaExcluir] = useState<Cliente | null>(null)

  // espera 300 ms depois da digitação antes de buscar
  useEffect(() => {
    const espera = setTimeout(() => setTermo(busca.trim()), 300)
    return () => clearTimeout(espera)
  }, [busca])

  const carregar = useCallback(async () => {
    try {
      const pagina = await listarClientes(1, POR_PAGINA, { busca: termo })
      setItens(pagina.items)
      setTotal(pagina.totalItems)
      setErro('')
    } catch (e) {
      setErro(mensagemDeErro(e, 'carregar os clientes'))
    } finally {
      setCarregando(false)
    }
  }, [termo])

  useEffect(() => {
    carregar()
  }, [carregar])

  // outra pessoa criou, editou ou excluiu: recarrega com o filtro atual
  useRealtime('clientes', () => {
    carregar()
  })

  const abrirNovo = () => {
    setEmEdicao(undefined)
    setFormAberto(true)
  }

  const abrirEdicao = (cliente: Cliente) => {
    setEmEdicao(cliente)
    setFormAberto(true)
  }

  const confirmarExclusao = async () => {
    if (!paraExcluir) return
    try {
      await excluirCliente(paraExcluir.id)
      toast.success('Cliente excluído.')
      setParaExcluir(null)
    } catch (e) {
      toast.error(mensagemDeErro(e, 'excluir o cliente'))
    }
  }

  let conteudo: ReactNode
  if (carregando) {
    conteudo = (
      <div className="space-y-2" aria-busy="true" aria-label="Carregando clientes">
        {[1, 2, 3, 4, 5].map((linha) => (
          <Skeleton key={linha} className="h-12 w-full" />
        ))}
      </div>
    )
  } else if (erro) {
    conteudo = (
      <Alert variant="destructive">
        <AlertTitle>Não foi possível carregar</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{erro}</p>
          <Button variant="outline" size="sm" onClick={() => carregar()}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar de novo
          </Button>
        </AlertDescription>
      </Alert>
    )
  } else if (itens.length === 0) {
    conteudo = (
      <div className="flex flex-col items-center py-16 text-center">
        <Users className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">
          {termo ? 'Nenhum resultado' : 'Nenhum cliente cadastrado'}
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {termo
            ? `Nada encontrado para "${termo}". Revise a busca.`
            : 'Cadastre o primeiro cliente para começar.'}
        </p>
        {termo ? (
          <Button variant="outline" className="mt-6" onClick={() => setBusca('')}>
            Limpar busca
          </Button>
        ) : (
          <Button className="mt-6" onClick={abrirNovo}>
            Cadastrar cliente
          </Button>
        )}
      </div>
    )
  } else if (isMobile) {
    conteudo = <CardsClientes itens={itens} aoEditar={abrirEdicao} aoExcluir={setParaExcluir} />
  } else {
    conteudo = <TabelaClientes itens={itens} aoEditar={abrirEdicao} aoExcluir={setParaExcluir} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {total === 1 ? '1 cliente' : `${total} clientes`}
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo cliente
        </Button>
      </div>

      <Input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou e-mail"
        aria-label="Buscar clientes"
        className="sm:max-w-sm"
      />

      {conteudo}

      <FormularioCliente aberto={formAberto} aoMudarAberto={setFormAberto} cliente={emEdicao} />
      <ConfirmarExclusao
        aberto={paraExcluir !== null}
        nome={paraExcluir?.nome ?? ''}
        aoCancelar={() => setParaExcluir(null)}
        aoConfirmar={confirmarExclusao}
      />
    </div>
  )
}
```

Mais de `POR_PAGINA` registros: acrescente o componente `Pagination` e passe a página ao
`listarClientes`.

## 2. Ações, tabela e cards — `src/components/clientes/`

```tsx
// AcoesCliente.tsx
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Cliente } from '@/services/clientes'

export interface AcoesClienteProps {
  cliente: Cliente
  aoEditar: (cliente: Cliente) => void
  aoExcluir: (cliente: Cliente) => void
}

export function AcoesCliente({ cliente, aoEditar, aoExcluir }: AcoesClienteProps) {
  // modal={false} evita a tela travada ao abrir um diálogo a partir do menu
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Ações de ${cliente.nome}`}>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => aoEditar(cliente)}>Editar</DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => aoExcluir(cliente)}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

```tsx
// TabelaClientes.tsx
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatarData } from '@/lib/formatos'
import type { Cliente } from '@/services/clientes'
import { AcoesCliente, type AcoesClienteProps } from './AcoesCliente'

const ROTULO_STATUS: Record<Cliente['status'], string> = { ativo: 'Ativo', inativo: 'Inativo' }

export function StatusCliente({ status }: { status: Cliente['status'] }) {
  return (
    <Badge variant={status === 'ativo' ? 'default' : 'secondary'}>{ROTULO_STATUS[status]}</Badge>
  )
}

type Props = { itens: Cliente[] } & Omit<AcoesClienteProps, 'cliente'>

export function TabelaClientes({ itens, aoEditar, aoExcluir }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Cadastro</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itens.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="max-w-[16rem] truncate font-medium">{cliente.nome}</TableCell>
            <TableCell className="max-w-[16rem] truncate">{cliente.email}</TableCell>
            <TableCell>
              <StatusCliente status={cliente.status} />
            </TableCell>
            <TableCell>{formatarData(cliente.created)}</TableCell>
            <TableCell>
              <AcoesCliente cliente={cliente} aoEditar={aoEditar} aoExcluir={aoExcluir} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

```tsx
// CardsClientes.tsx — versão do celular
import { Card, CardContent } from '@/components/ui/card'
import type { Cliente } from '@/services/clientes'
import { AcoesCliente, type AcoesClienteProps } from './AcoesCliente'
import { StatusCliente } from './TabelaClientes'

type Props = { itens: Cliente[] } & Omit<AcoesClienteProps, 'cliente'>

export function CardsClientes({ itens, aoEditar, aoExcluir }: Props) {
  return (
    <ul className="space-y-3">
      {itens.map((cliente) => (
        <li key={cliente.id}>
          <Card>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 space-y-1">
                <p className="truncate font-medium">{cliente.nome}</p>
                <p className="truncate text-sm text-muted-foreground">{cliente.email}</p>
                <StatusCliente status={cliente.status} />
              </div>
              <AcoesCliente cliente={cliente} aoEditar={aoEditar} aoExcluir={aoExcluir} />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
```

## 3. Formulário em diálogo — `src/components/clientes/FormularioCliente.tsx`

```tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { errosDeCampo, mensagemDeErro } from '@/lib/mensagens-erro'
import { atualizarCliente, criarCliente, type Cliente } from '@/services/clientes'

const esquema = z.object({
  nome: z.string().trim().min(2, 'Use pelo menos 2 caracteres.'),
  email: z.string().trim().email('Informe um e-mail válido, como nome@empresa.com.br.'),
  status: z.enum(['ativo', 'inativo']),
})

type Valores = z.infer<typeof esquema>

const VAZIO: Valores = { nome: '', email: '', status: 'ativo' }

interface Props {
  aberto: boolean
  aoMudarAberto: (aberto: boolean) => void
  cliente?: Cliente
}

export function FormularioCliente({ aberto, aoMudarAberto, cliente }: Props) {
  const form = useForm<Valores>({
    resolver: zodResolver(esquema),
    mode: 'onTouched',
    defaultValues: VAZIO,
  })

  useEffect(() => {
    if (aberto) {
      form.reset(
        cliente ? { nome: cliente.nome, email: cliente.email, status: cliente.status } : VAZIO,
      )
    }
  }, [aberto, cliente, form])

  const enviar = async (valores: Valores) => {
    try {
      if (cliente) {
        await atualizarCliente(cliente.id, valores)
        toast.success('Alterações salvas.')
      } else {
        await criarCliente(valores)
        toast.success('Cliente cadastrado.')
      }
      aoMudarAberto(false)
    } catch (e) {
      for (const [campo, mensagem] of Object.entries(errosDeCampo(e))) {
        if (campo in esquema.shape) form.setError(campo as keyof Valores, { message: mensagem })
      }
      toast.error(mensagemDeErro(e, 'salvar o cliente'))
    }
  }

  const enviando = form.formState.isSubmitting

  return (
    <Dialog open={aberto} onOpenChange={(valor) => !enviando && aoMudarAberto(valor)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{cliente ? 'Editar cliente' : 'Novo cliente'}</DialogTitle>
          <DialogDescription>Campos com * são obrigatórios.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(enviar)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail *</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => aoMudarAberto(false)}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={enviando}>
                {enviando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {cliente ? 'Salvar alterações' : 'Salvar cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

Se a SPEC exigir confirmação ao fechar com alterações, intercepte `aoMudarAberto(false)` quando
`form.formState.isDirty` e confirme com `AlertDialog`.

## 4. Confirmação de exclusão — `src/components/ConfirmarExclusao.tsx`

```tsx
import { type MouseEvent, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  aberto: boolean
  nome: string
  aoCancelar: () => void
  aoConfirmar: () => Promise<void>
}

export function ConfirmarExclusao({ aberto, nome, aoCancelar, aoConfirmar }: Props) {
  const [excluindo, setExcluindo] = useState(false)

  const confirmar = async (evento: MouseEvent<HTMLButtonElement>) => {
    evento.preventDefault() // mantém o diálogo aberto até a exclusão terminar
    setExcluindo(true)
    try {
      await aoConfirmar()
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <AlertDialog open={aberto} onOpenChange={(valor) => !valor && !excluindo && aoCancelar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {nome}?</AlertDialogTitle>
          <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            disabled={excluindo}
            onClick={confirmar}
          >
            {excluindo ? 'Excluindo…' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## 5. Rota e item de menu

Em `src/App.tsx`, copie o padrão das rotas que já existem:

```tsx
const Clientes = lazy(() => import('./pages/Clientes'))

<Route
  path="/clientes"
  element={
    <Suspense fallback={<PageLoader />}>
      <Clientes />
    </Suspense>
  }
/>
```

No `src/components/Layout.tsx`, acrescente o item na mesma lista de navegação que já existe, com um
ícone `lucide-react` do mesmo tamanho dos outros. Não crie um segundo menu.
