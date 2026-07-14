import { useNavigate, useParams } from 'react-router-dom';
import { useSchool, useUpdateSchool, useDeleteSchool, useSchoolStats } from './hooks/useSchools';
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
  const [editingParticipantes, setEditingParticipantes] = useState(false);
  const [participantesValue, setParticipantesValue] = useState<string>('');

  const { data: school, isLoading } = useSchool(id);
  const { data: classrooms = [] } = useClassrooms(id);
  const { data: stats } = useSchoolStats(id);
  const { mutate: updateSchool, isPending: updating } = useUpdateSchool();
  const { mutate: deleteSchool } = useDeleteSchool();
  const { mutate: createClassroom, isPending: creatingClassroom } = useCreateClassroom();
  const { confirmNode, openConfirm } = useConfirm();

  const handleUpdate = (name: string) => {
    updateSchool({ id, name }, { onSuccess: () => setShowEditModal(false) });
  };

  const startEditParticipantes = () => {
    setParticipantesValue(String(school?.total_alunos_escola ?? ''));
    setEditingParticipantes(true);
  };

  const saveParticipantes = () => {
    const num = participantesValue.trim() === '' ? null : parseInt(participantesValue, 10);
    if (participantesValue.trim() !== '' && isNaN(num!)) return;
    updateSchool(
      { id, total_alunos_escola: num },
      { onSuccess: () => setEditingParticipantes(false) },
    );
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

      <div className="school-stats">
        <div className="school-stats__card school-stats__card--blue">
          <div className="school-stats__icon"><i className="pi pi-folder" /></div>
          <span className="school-stats__value">{stats?.total_classrooms ?? '—'}</span>
          <span className="school-stats__label">Total de turmas</span>
        </div>
        <div className="school-stats__card school-stats__card--green">
          <div className="school-stats__icon"><i className="pi pi-users" /></div>
          <span className="school-stats__value">{stats?.total_students ?? '—'}</span>
          <span className="school-stats__label">Total de alunos</span>
        </div>
        <div className="school-stats__card school-stats__card--purple">
          <div className="school-stats__icon"><i className="pi pi-file-check" /></div>
          <span className="school-stats__value">{stats?.total_consultations ?? '—'}</span>
          <span className="school-stats__label">Total de consultas</span>
        </div>
        <div className="school-stats__card school-stats__card--teal school-stats__card--editable">
          <div className="school-stats__card-header">
            <div className="school-stats__icon"><i className="pi pi-user-plus" /></div>
            {isAdmin && !editingParticipantes && (
              <button className="school-stats__edit-btn" onClick={startEditParticipantes} title="Editar" type="button">
                <i className="pi pi-pencil" />
              </button>
            )}
          </div>
          {editingParticipantes ? (
            <div className="school-stats__edit-row">
              <input
                className="school-stats__input"
                type="number"
                min={0}
                value={participantesValue}
                onChange={(e) => setParticipantesValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveParticipantes(); if (e.key === 'Escape') setEditingParticipantes(false); }}
                autoFocus
              />
              <div className="school-stats__edit-actions">
                <button className="school-stats__save-btn" onClick={saveParticipantes} type="button" disabled={updating}><i className="pi pi-check" /></button>
                <button className="school-stats__cancel-btn" onClick={() => setEditingParticipantes(false)} type="button"><i className="pi pi-times" /></button>
              </div>
            </div>
          ) : (
            <span className="school-stats__value">
              {school?.total_alunos_escola != null ? school.total_alunos_escola : '—'}
            </span>
          )}
          <span className="school-stats__label">Total de alunos da escola</span>
        </div>
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
