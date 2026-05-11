import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from './hooks/useUsers';
import { UserForm } from './components/UserForm';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { User, CreateUserData } from './api/usersApi';
import type { BadgeProps } from '../../components/ui/Badge';

const roleVariant = (role: string): BadgeProps['variant'] => {
  if (role === 'ADMIN') return 'danger';
  if (role === 'MEDICO') return 'warning';
  return 'primary';
};

const ROLE_LABEL: Record<string, string> = { ADMIN: 'Admin', TRIADOR: 'Triador', MEDICO: 'Médico' };

export const UserListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const { data: users = [], isLoading } = useUsers();
  const { mutate: createUser, isPending: creating } = useCreateUser();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const handleSubmit = (data: CreateUserData) => {
    if (editing) {
      updateUser({ id: editing.id, data }, { onSuccess: () => { setShowModal(false); setEditing(null); } });
    } else {
      createUser(data, { onSuccess: () => setShowModal(false) });
    }
  };

  const handleDelete = (user: User) => {
    if (!confirm(`Excluir o usuário "${user.name}"?`)) return;
    deleteUser(user.id);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Usuários</h1>
        <div className="page-header__actions">
          <Button
            label="Adicionar usuário"
            icon="pi pi-plus"
            onClick={() => { setEditing(null); setShowModal(true); }}
          />
        </div>
      </div>

      <Table
        data={users}
        loading={isLoading}
        columns={[
          { field: 'name', header: 'Nome' },
          { field: 'username', header: 'Usuário' },
          {
            field: 'role',
            header: 'Perfil',
            body: (r: User) => <Badge label={ROLE_LABEL[r.role] ?? r.role} variant={roleVariant(r.role)} />,
          },
          {
            field: 'active',
            header: 'Status',
            body: (r: User) => <Badge label={r.active ? 'Ativo' : 'Inativo'} variant={r.active ? 'success' : 'neutral'} />,
          },
          {
            field: 'id',
            header: '',
            body: (r: User) => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button label="Editar" variant="ghost" size="sm" icon="pi pi-pencil"
                  onClick={() => { setEditing(r); setShowModal(true); }} />
                <Button label="Excluir" variant="danger" size="sm" icon="pi pi-trash"
                  onClick={() => handleDelete(r)} />
              </div>
            ),
          },
        ]}
      />

      <Modal
        visible={showModal}
        onHide={() => { setShowModal(false); setEditing(null); }}
        title={editing ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <UserForm
          initialData={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setShowModal(false); setEditing(null); }}
          loading={creating || updating}
          isEdit={!!editing}
        />
      </Modal>
    </div>
  );
};
