# Task 03 — Backend: Rota no StudentsController

## Objetivo

Expor o endpoint `PATCH /students/:id/transfer` restrito a ADMIN.

## Arquivo a editar

`backend/src/students/students.controller.ts`

## Rota a adicionar

```typescript
@Patch(':id/transfer')
@Roles(Role.ADMIN)
@ApiOkResponse({ type: StudentResponseDto })
transfer(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: TransferStudentDto,
  @CurrentUser() user: JwtPayload,
): Promise<StudentResponseDto> {
  return this.studentsService.transfer(id, dto, user) as Promise<StudentResponseDto>;
}
```

## Imports adicionais no controller

```typescript
import { Patch } from '@nestjs/common';           // adicionar Patch ao import existente
import { TransferStudentDto } from './dto/transfer-student.dto';
```

## Onde inserir

Após o método `update()` (linha ~70), antes de `updateQuestionnaire`.

## Critérios de aceite

- [ ] Rota responde em `PATCH /students/:id/transfer`.
- [ ] Restrita ao papel `ADMIN` via `@Roles(Role.ADMIN)`.
- [ ] Documentada no Swagger.
- [ ] Retorna o aluno atualizado com status 200.
