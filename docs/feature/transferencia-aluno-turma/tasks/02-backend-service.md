# Task 02 — Backend: Método `transfer` no StudentsService

## Objetivo

Adicionar o método `transfer()` ao `StudentsService` com a lógica de validação e atualização.

## Arquivo a editar

`backend/src/students/students.service.ts`

## Assinatura do método

```typescript
async transfer(id: number, dto: TransferStudentDto, user: JwtPayload): Promise<student_data>
```

## Lógica passo a passo

1. Busca o aluno pelo `id` — lança `NotFoundException` se não existir.
2. Chama `ensureSchoolAccess(user, student.school_fk)` — garante que o usuário tem acesso à escola (já existe no service).
3. Busca a turma de destino (`dto.classroom_fk`) via `prisma.classroom.findUnique`.
4. Se a turma não existir → lança `NotFoundException('Turma não encontrada')`.
5. Se `classroom.school_fk !== student.school_fk` → lança `BadRequestException('A turma de destino não pertence à mesma escola do aluno')`.
6. Se `dto.classroom_fk === student.classroom_fk` → lança `BadRequestException('O aluno já está nesta turma')`.
7. Atualiza o aluno com `prisma.student_data.update({ where: { id }, data: { classroom_fk: dto.classroom_fk } })`.
8. Retorna o aluno atualizado.

## Imports adicionais necessários

```typescript
import { BadRequestException } from '@nestjs/common'; // já deve existir ou adicionar
import { TransferStudentDto } from './dto/transfer-student.dto';
```

## Critérios de aceite

- [ ] Método adicionado ao service.
- [ ] Valida que a turma existe.
- [ ] Valida que a turma pertence à mesma escola do aluno.
- [ ] Valida que a turma é diferente da atual.
- [ ] Retorna o aluno com `classroom_fk` atualizado.
