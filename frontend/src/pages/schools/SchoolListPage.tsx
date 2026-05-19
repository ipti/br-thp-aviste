import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchools, useCreateSchool, useDeleteSchool } from './hooks/useSchools';
import { SchoolForm } from './components/SchoolForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import './styles.scss';

export const SchoolListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const { data: schools = [], isLoading, isError } = useSchools();
  const { mutate: createSchool, isPending } = useCreateSchool();
  const { mutate: deleteSchool } = useDeleteSchool();

  const handleCreate = (name: string) => {
    createSchool(name, { onSuccess: () => setShowModal(false) });
  };

  return (
    <div className="school-list">
      <div className="page-header">
        <h1 className="page-title">Escola</h1>
        {isAdmin && (
          <div className="page-header__actions">
            <Button
              label="Adicionar Escola"
              icon="pi pi-plus"
              onClick={() => setShowModal(true)}
            />
          </div>
        )}
      </div>

      {isError && (
        <div className="alert alert--error">
          <i className="pi pi-exclamation-circle" />
          Ocorreu uma falha ao carregar!
        </div>
      )}

      {isLoading ? (
        <div className="loading-center">
          <i className="pi pi-spin pi-spinner" />
        </div>
      ) : schools.length === 0 ? (
        <div className="alert">
          <i className="pi pi-inbox" />
          Nenhuma escola cadastrada no momento.
        </div>
      ) : (
        <div className="school-list__grid">
          {schools.map((school) => (
            <div
              key={school.id}
              className="school-card"
              onClick={() => navigate(`/escolas/${school.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/escolas/${school.id}`)}
            >
              <div className="school-card__header">
                <span className="school-card__badge">ATIVA</span>
                {isAdmin && (
                  <button
                    type="button"
                    className="school-card__delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSchool(school.id);
                    }}
                    aria-label="Remover escola"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="school-card__body">
                <span className="school-card__icon-wrap">
                  <i className="pi pi-graduation-cap" />
                </span>
                <span className="school-card__name">{school.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal visible={showModal} onHide={() => setShowModal(false)} title="Adicionar Escola">
        <SchoolForm
          onSubmit={handleCreate}
          onCancel={() => setShowModal(false)}
          loading={isPending}
        />
      </Modal>
    </div>
  );
};
