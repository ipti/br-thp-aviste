import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassrooms, useCreateClassroom, useDeleteClassroom } from './hooks/useClassrooms';
import { useSchools } from '../schools/hooks/useSchools';
import { ClassroomForm } from './components/ClassroomForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import './styles.scss';

export const ClassroomListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const { data: schools = [] } = useSchools();
  const { data: classrooms = [], isLoading, isError } = useClassrooms(
    selectedSchoolId,
    { enabled: selectedSchoolId !== undefined },
  );
  const { mutate: createClassroom, isPending } = useCreateClassroom();
  const { mutate: deleteClassroom } = useDeleteClassroom();

  useEffect(() => {
    if (selectedSchoolId === undefined && schools.length > 0) {
      setSelectedSchoolId(schools[0].id);
    }
  }, [schools, selectedSchoolId]);

  const handleCreate = (data: Parameters<typeof createClassroom>[0]) => {
    createClassroom(data, { onSuccess: () => setShowModal(false) });
  };

  return (
    <div className="classroom-list">
      <div className="page-header">
        <h1 className="page-title">Turma</h1>
        {isAdmin && selectedSchoolId !== undefined && (
          <div className="page-header__actions">
            <Button
              label="Adicionar Turma"
              icon="pi pi-plus"
              onClick={() => setShowModal(true)}
            />
          </div>
        )}
      </div>

      <div className="classroom-list__filter">
        <p className="classroom-list__filter-hint">Escolha a escola para listar as turmas:</p>
        <select
          className="classroom-list__select"
          value={selectedSchoolId ?? ''}
          onChange={(e) =>
            setSelectedSchoolId(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">Selecione uma escola</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="alert alert--error">
          <i className="pi pi-exclamation-circle" />
          Ocorreu uma falha ao carregar!
        </div>
      )}

      {selectedSchoolId === undefined ? (
        <div className="classroom-list__empty">
          <i className="pi pi-arrow-up" />
          <p>Selecione uma escola para visualizar as turmas</p>
        </div>
      ) : isLoading ? (
        <div className="loading-center">
          <i className="pi pi-spin pi-spinner" />
        </div>
      ) : classrooms.length === 0 ? (
        <div className="classroom-list__empty">
          <i className="pi pi-folder-open" />
          <p>Nenhuma turma encontrada</p>
          {isAdmin && (
            <p className="classroom-list__empty-hint">
              Clique no <strong>+</strong> para adicionar a primeira turma
            </p>
          )}
        </div>
      ) : (
        <div className="classroom-list__grid">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="classroom-card"
              onClick={() => navigate(`/turmas/${classroom.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/turmas/${classroom.id}`)}
            >
              <div className="classroom-card__header">
                <p className="classroom-card__name">{classroom.name}</p>
                {isAdmin && (
                  <button
                    type="button"
                    className="classroom-card__delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteClassroom(classroom.id);
                    }}
                    aria-label="Remover turma"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="classroom-card__label">Turma</p>
              <span className="classroom-card__badge">
                {classroom.year ?? '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedSchoolId !== undefined && (
        <Modal
          visible={showModal}
          onHide={() => setShowModal(false)}
          title="Adicionar Turma"
        >
          <ClassroomForm
            schoolId={selectedSchoolId}
            onSubmit={handleCreate}
            onCancel={() => setShowModal(false)}
            loading={isPending}
          />
        </Modal>
      )}
    </div>
  );
};
