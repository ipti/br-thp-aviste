# Transferência de Aluno entre Turmas

## História Funcional

Durante o cadastro de alunos, é comum que um administrador cometa um erro ao selecionar a turma. O aluno acaba ficando vinculado a uma turma incorreta dentro da mesma escola, e hoje não existe nenhuma forma de corrigir isso pelo sistema — seria necessário excluir e recadastrar o aluno, perdendo todos os dados já preenchidos (triagem, questionário, consulta).

### Cenário principal

> A coordenadora Joana percebe que o aluno **Pedro Henrique** foi cadastrado na turma **3º A** mas deveria estar na **3º B**. Ela abre a ficha do aluno, clica em **"Transferir de turma"**, escolhe a turma correta na lista e confirma. O aluno passa a aparecer na turma certa, sem perder nenhum dado.

### Regras de negócio

- Somente usuários com papel **ADMIN** podem realizar a transferência.
- A transferência só é permitida **dentro da mesma escola** — não é possível mover um aluno para uma turma de outra escola.
- A turma de destino deve ser diferente da turma atual.
- Todos os dados do aluno (triagem, questionário, consulta, receita, entrega) são preservados.
- A operação registra a mudança atualizando `classroom_fk` e `updatedAt` no banco.

### O que não está no escopo

- Transferência entre escolas diferentes.
- Histórico de transferências (qual turma o aluno passou).
- Transferência em lote de múltiplos alunos ao mesmo tempo.

---

## Estrutura da feature

```
docs/feature/transferencia-aluno-turma/
├── README.md           ← este arquivo
└── tasks/
    ├── 01-backend-dto.md
    ├── 02-backend-service.md
    ├── 03-backend-controller.md
    ├── 04-frontend-api-hook.md
    └── 05-frontend-ui.md
```

## Fluxo técnico resumido

```
[Admin clica "Transferir de turma"]
        ↓
[Modal abre com select de turmas da escola]
        ↓
[Confirma → PATCH /students/:id/transfer { classroom_fk }]
        ↓
[Backend valida: turma pertence à mesma escola?]
        ↓
[Atualiza classroom_fk no banco]
        ↓
[Frontend invalida queries → UI atualiza]
```
