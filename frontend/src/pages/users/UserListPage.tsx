import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useAddUserSchool, useRemoveUserSchool } from './hooks/useUsers';
import { UserForm } from './components/UserForm';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { User, CreateUserData } from './api/usersApi';
import type { BadgeProps } from '../../components/ui/Badge';
import { useSchools } from '../schools/hooks/useSchools';
import { useConfirm } from '../../components/ui/ConfirmDialog/useConfirm';

const roleVariant = (role: string): BadgeProps['variant'] => {
  if (role === 'ADMIN') return 'danger';
  if (role === 'MEDICO') return 'warning';
  return 'primary';
};

const ROLE_LABEL: Record<string, string> = { ADMIN: 'Admin', TRIADOR: 'Triador', MEDICO: 'Médico' };

export const UserListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [managingSchools, setManagingSchools] = useState<User | null>(null);

  const { data: users = [], isLoading } = useUsers();
  const { data: schools = [] } = useSchools();
  const { mutate: createUser, isPending: creating } = useCreateUser();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: addUserSchool, isPending: addingSchool } = useAddUserSchool();
  const { mutate: removeUserSchool, isPending: removingSchool } = useRemoveUserSchool();
  const { confirmNode, openConfirm } = useConfirm();

  const handleSubmit = (data: CreateUserData) => {
    if (editing) {
      updateUser({ id: editing.id, data }, { onSuccess: () => { setShowModal(false); setEditing(null); } });
    } else {
      createUser(data, { onSuccess: () => setShowModal(false) });
    }
  };

  const handleDelete = (user: User) => {
    openConfirm({
      title: 'Excluir usuário',
      message: `Deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      onConfirm: () => deleteUser(user.id),
    });
  };

  const isSchoolLinked = (user: User, schoolId: number) => user.schoolIds.includes(schoolId);

  const closeSchoolModal = () => {
    setShowSchoolModal(false);
    setManagingSchools(null);
  };

  const toggleUserSchool = (user: User, schoolId: number) => {
    if (isSchoolLinked(user, schoolId)) {
      removeUserSchool(
        { id: user.id, schoolId },
        { onSuccess: () => closeSchoolModal() },
      );
      return;
    }
    addUserSchool(
      { id: user.id, schoolId },
      { onSuccess: () => closeSchoolModal() },
    );
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
            field: 'schoolIds',
            header: 'Escolas',
            body: (r: User) => (r.role === 'ADMIN' ? 'Todas' : String(r.schoolIds.length)),
          },
          {
            field: 'id',
            header: '',
            body: (r: User) => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button label="Editar" variant="ghost" size="sm" icon="pi pi-pencil"
                  onClick={() => { setEditing(r); setShowModal(true); }} />
                {r.role !== 'ADMIN' && (
                  <Button
                    label="Escolas"
                    variant="secondary"
                    size="sm"
                    icon="pi pi-building"
                    onClick={() => { setManagingSchools(r); setShowSchoolModal(true); }}
                  />
                )}
                <Button label="Excluir" variant="danger" size="sm" icon="pi pi-trash"
                  onClick={() => handleDelete(r)} />
              </div>
            ),
          },
        ]}
      />

      {confirmNode}

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

      <Modal
        visible={showSchoolModal}
        onHide={closeSchoolModal}
        title={managingSchools ? `Escolas de ${managingSchools.name}` : 'Escolas do usuário'}
        width="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {schools.map((school) => {
            const linked = managingSchools ? isSchoolLinked(managingSchools, school.id) : false;
            return (
              <div
                key={school.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e7ecf3',
                  borderRadius: 10,
                  padding: '0.75rem 1rem',
                }}
              >
                <strong>{school.name}</strong>
                <Button
                  label={linked ? 'Remover' : 'Vincular'}
                  variant={linked ? 'danger' : 'primary'}
                  size="sm"
                  loading={addingSchool || removingSchool}
                  onClick={() => managingSchools && toggleUserSchool(managingSchools, school.id)}
                />
              </div>
            );
          })}
          {schools.length === 0 && <span>Nenhuma escola cadastrada.</span>}
        </div>
      </Modal>
    </div>
  );
};
