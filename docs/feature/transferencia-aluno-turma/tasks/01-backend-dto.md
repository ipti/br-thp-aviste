# Task 01 — Backend: DTO de Transferência

## Objetivo

Criar o DTO que valida o payload da requisição de transferência.

## Arquivo a criar

`backend/src/students/dto/transfer-student.dto.ts`

## Conteúdo esperado

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class TransferStudentDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  classroom_fk: number;
}
```

## Critérios de aceite

- [ ] Arquivo criado no caminho correto.
- [ ] `classroom_fk` é obrigatório e deve ser um inteiro maior que zero.
- [ ] Decoradores do Swagger documentam o campo.
