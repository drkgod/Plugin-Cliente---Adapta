# Migração 0.6.0 — construir sem harness e entregar com prova

## Antes

- o agente do Ethos construía telas e código sem orientação específica de UI/UX, sem mapa do
  sistema e sem protocolo para compensar a falta de busca, verificação de tipos, navegador e diff;
- uma alteração feita pelo MCP do Skip podia terminar sem `skip_project_apply_changes` ou sem
  `skip_project_publish`, e o cliente testava uma versão que não estava no ar;
- a MEMORY dizia que o push nunca era requisito, e a conclusão só enviava ao GitHub “se
  configurado”;
- a SkillMind instalava a memória só quando ela não existia; clientes com a 0.5.0 instalada não
  recebiam regras novas.

## Agora

- três skills de apoio, carregadas dentro da task autorizada e nunca como rota:
  - `ui-ux-sistemas`: Ficha de Tela na análise, padrões de tela, regras de UX e de texto,
    checklist de UI e roteiro de teste visual;
  - `construir-codigo`: mapa do sistema, plano em código com teste de mesa, edição cirúrgica,
    QA do Skip como compilador, revisão por checklist e receitas do template Skip;
  - `publicar-e-sincronizar`: aplica, publica e prova a versão no Skip, espelha os arquivos
    alterados e atualiza o GitHub com prova no remoto;
- regra de entrega obrigatória na MEMORY: toda resposta que altera o Skip termina aplicada,
  publicada e provada, com o GitHub atualizado na mesma resposta;
- o teste humano acontece na URL de produção, depois da publicação provada;
- nenhuma task nova é aberta com trabalho ainda não enviado ao GitHub; falha persistente de envio
  vira a trava “GitHub desatualizado”;
- `.skip.config.json` é tratado como arquivo da plataforma: não é editado nem dispara apply, o que
  evita o laço aplicar → publicar → pendência;
- ações do MCP que apagam versões, segredos, variáveis ou migrations exigem autorização explícita;
- migrations só aditivas sem autorização específica, porque preview e produção usam o mesmo banco;
- novos caminhos no repositório do cliente: `07-sistemas/<sistema>/plataforma.md`,
  `07-sistemas/<sistema>/codigo/` (espelho de consulta) e `.adapta-cliente/mapas/<sistema>.md`;
- o estado ganha `sistema`, `skip_projeto`, `skip_versao` e `skip_publicacao`; o envio ao GitHub
  é provado no próprio remoto;
- a MEMORY declara `adapta-cliente-memory 0.6.0`, e a SkillMind substitui a memória instalada
  quando a versão for outra;
- a recuperação agendada reenvia ao GitHub commits pendentes e alerta sobre versão aplicada e não
  publicada, sem publicar no Skip.

## O que o cliente percebe

- na primeira conversa depois da atualização, a memória é substituída sem pedir nada ao cliente;
- na primeira task de cada sistema, o agente registra a plataforma e cria o mapa do código;
- cada entrega informa a versão publicada, a URL de produção e o commit no GitHub antes de pedir
  o teste.

## Fluxo principal

```text
CONFIGURAR (acessos + plataforma registrada)
  → ANALISAR UMA TASK (plano em código + Ficha de Tela)
  → AGUARDAR AUTORIZAÇÃO
  → IMPLEMENTAR E VERIFICAR (protocolo construir-codigo)
  → PUBLICAR NO SKIP E ATUALIZAR O GITHUB, COM PROVA
  → AGUARDAR TESTE HUMANO NA URL DE PRODUÇÃO
  → CONCLUIR OU DEBUGAR A MESMA TASK
  → PARAR
```
