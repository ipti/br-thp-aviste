# Task 05 — Frontend: UI na StudentDetailPage

## Objetivo

Adicionar o botão "Transferir de turma" e o modal de seleção de turma na página de detalhe do aluno.

---

## Arquivo a editar

`frontend/src/pages/students/StudentDetailPage.tsx`

---

## 5.1 — Estado e dados necessários

Adicionar ao topo do componente:

```typescript
const [showTransferModal, setShowTransferModal] = useState(false);

// Busca as turmas da escola do aluno para popular o select
const { data: classrooms = [] } = useClassrooms(student?.school_fk);
// Filtra a turma atual fora da lista de destino
const transferTargets = classrooms.filter((c) => c.id !== student?.classroom_fk);

const { mutate: transferStudent, isPending: transferring } = useTransferStudent();
```

**Import necessário:**
```typescript
import { useClassrooms } from '../classrooms/hooks/useClassrooms';
import { useTransferStudent } from './hooks/useStudents';
```

---

## 5.2 — Botão no header

Dentro do bloco `{isAdmin && (...)}` no `page-header__actions`, adicionar ao lado dos botões existentes:

```tsx
<Button
  label="Transferir de turma"
  variant="ghost"
  size="sm"
  icon="pi pi-arrow-right-arrow-left"
  onClick={() => setShowTransferModal(true)}
/>
```

---

## 5.3 — Modal de transferência

Adicionar antes do fechamento do `return`, junto aos outros modais:

```tsx
<Modal
  visible={showTransferModal}
  onHide={() => setShowTransferModal(false)}
  title="Transferir de turma"
>
  <div className="transfer-modal">
    <div className="field-row">
      <span className="field-row__label">Turma atual</span>
      <span className="field-row__value">
        {classrooms.find((c) => c.id === student?.classroom_fk)?.name ?? '—'}
      </span>
    </div>

    <div className="detail-form__section" style={{ marginTop: '1rem' }}>
      <label className="detail-form__section-title" htmlFor="transfer-select">
        Transferir para
      </label>
      <select
        id="transfer-select"
        className="input__field"
        value={transferTarget}
        onChange={(e) => setTransferTarget(Number(e.target.value))}
      >
        <option value={0}>Selecione a turma de destino...</option>
        {transferTargets.map((c) => (
          <option key={c.id} value={c.id}>{c.name}{c.year ? ` (${c.year})` : ''}</option>
        ))}
      </select>
    </div>

    <div className="detail-form__actions">
      <Button label="Cancelar" variant="ghost" onClick={() => setShowTransferModal(false)} />
      <Button
        label="Confirmar transferência"
        variant="primary"
        loading={transferring}
        disabled={!transferTarget}
        onClick={() => {
          if (!transferTarget || !student) return;
          transferStudent(
            { id: student.id, classroom_fk: transferTarget },
            { onSuccess: () => { setShowTransferModal(false); setTransferTarget(0); } },
          );
        }}
      />
    </div>
  </div>
</Modal>
```

Estado adicional necessário:
```typescript
const [transferTarget, setTransferTarget] = useState(0);
```

---

## 5.4 — Resetar estado ao fechar

No `onHide` do Modal, garantir que o select volta ao estado inicial:

```typescript
onHide={() => { setShowTransferModal(false); setTransferTarget(0); }}
```

---

## Critérios de aceite

- [ ] Botão "Transferir de turma" visível somente para ADMIN.
- [ ] Modal exibe a turma atual do aluno (read-only).
- [ ] Select lista apenas as outras turmas da mesma escola.
- [ ] Botão "Confirmar" desabilitado enquanto nenhuma turma está selecionada.
- [ ] Após sucesso: modal fecha, select reseta, lista da turma atualiza.
- [ ] Se a escola tiver só uma turma, o select aparece vazio e a ação não é possível.
