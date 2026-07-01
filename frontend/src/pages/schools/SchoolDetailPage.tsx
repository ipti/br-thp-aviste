import { useNavigate, useParams } from 'react-router-dom';
import { useSchool, useUpdateSchool, useDeleteSchool } from './hooks/useSchools';
import { useClassrooms, useCreateClassroom } from '../classrooms/hooks/useClassrooms';
import { SchoolForm } from './components/SchoolForm';
import { ClassroomForm } from '../classrooms/components/ClassroomForm';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FAB } from '../../components/ui/FAB';
import { useAuth } from '../../hooks/useAuth';
import { useConfirm } from '../../components/ui/ConfirmDialog/useConfirm';
import { useState } from 'react';
import './styles.scss';

export const SchoolDetailPage = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const id = Number(schoolId);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showClassroomModal, setShowClassroomModal] = useState(false);

  const { data: school, isLoading } = useSchool(id);
  const { data: classrooms = [] } = useClassrooms(id);
  const { mutate: updateSchool, isPending: updating } = useUpdateSchool();
  const { mutate: deleteSchool } = useDeleteSchool();
  const { mutate: createClassroom, isPending: creatingClassroom } = useCreateClassroom();
  const { confirmNode, openConfirm } = useConfirm();

  const handleUpdate = (name: string) => {
    updateSchool({ id, name }, { onSuccess: () => setShowEditModal(false) });
  };

  const handleDelete = () => {
    openConfirm({
      title: 'Excluir escola',
      message: 'Deseja excluir esta escola? Todas as turmas e alunos serão removidos permanentemente.',
      confirmLabel: 'Excluir',
      onConfirm: () => deleteSchool(id, { onSuccess: () => navigate('/escolas') }),
    });
  };

  if (isLoading) {
    return <div className="loading-center"><i className="pi pi-spin pi-spinner" /></div>;
  }

  return (
    <div className="school-detail">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/escolas')} type="button">
          <i className="pi pi-arrow-left" />
        </button>
        <h1 className="page-title">{school?.name}</h1>
        {isAdmin && (
          <div className="page-header__actions">
            <Button label="Editar" variant="ghost" size="sm" onClick={() => setShowEditModal(true)} icon="pi pi-pencil" />
            <Button label="Excluir" variant="danger" size="sm" onClick={handleDelete} icon="pi pi-trash" />
          </div>
        )}
      </div>

      <h2 className="section-title">Turmas</h2>

      {classrooms.length === 0 ? (
        <div className="alert">
          <i className="pi pi-inbox" />
          Nenhuma turma cadastrada para esta escola.
        </div>
      ) : (
        <div className="classroom-grid">
          {classrooms.map((cls) => (
            <Card key={cls.id} onClick={() => navigate(`/turmas/${cls.id}`)}>
              <p className="classroom-card__name">{cls.name}</p>
              <p className="classroom-card__school">{school?.name}</p>
              <p className="classroom-card__label">Turma</p>
              {cls.year && <Badge label={cls.year} variant="primary" />}
            </Card>
          ))}
        </div>
      )}

      {isAdmin && (
        <FAB onClick={() => setShowClassroomModal(true)} title="Adicionar turma" />
      )}

      {confirmNode}

      <Modal visible={showEditModal} onHide={() => setShowEditModal(false)} title="Editar Escola">
        <SchoolForm
          initialName={school?.name}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          loading={updating}
        />
      </Modal>

      <Modal visible={showClassroomModal} onHide={() => setShowClassroomModal(false)} title="Adicionar Turma">
        <ClassroomForm
          schoolId={id}
          onSubmit={(data) =>
            createClassroom(data, { onSuccess: () => setShowClassroomModal(false) })
          }
          onCancel={() => setShowClassroomModal(false)}
          loading={creatingClassroom}
        />
      </Modal>
    </div>
  );
};
