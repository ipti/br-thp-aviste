# Task 04 — Frontend: API e Hook de Transferência

## Objetivo

Adicionar a função de API e o hook React Query para executar a transferência.

---

## 4.1 — Função na API

**Arquivo:** `frontend/src/pages/students/api/studentsApi.ts`

Adicionar ao objeto `studentsApi`:

```typescript
transfer: (id: number, classroom_fk: number): Promise<Student> =>
  api.patch<Student>(`/students/${id}/transfer`, { classroom_fk }).then((r) => r.data),
```

---

## 4.2 — Hook React Query

**Arquivo:** `frontend/src/pages/students/hooks/useStudents.ts`

Adicionar no final do arquivo:

```typescript
export const useTransferStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, classroom_fk }: { id: number; classroom_fk: number }) =>
      studentsApi.transfer(id, classroom_fk),
    onSuccess: (student) => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['students', 'detail', student.id] });
      toastService.success('Aluno transferido com sucesso');
    },
  });
};
```

## Critérios de aceite

- [ ] `studentsApi.transfer` chama `PATCH /students/:id/transfer`.
- [ ] Hook invalida as queries de lista e de detalhe do aluno após sucesso.
- [ ] Toast de sucesso exibido.
