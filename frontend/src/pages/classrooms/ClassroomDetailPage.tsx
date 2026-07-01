import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { pdf } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import {
  useClassroom,
  useUpdateClassroom,
  useDeleteClassroom,
  useMigrationProjects,
  useSendMigration,
} from './hooks/useClassrooms';
import { useStudents, useDeleteStudent } from '../students/hooks/useStudents';
import { ClassroomForm } from './components/ClassroomForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import type { Student } from '../students/api/studentsApi';
import {
  migrationErrorsStorage,
  type SavedMigrationErrors,
  type MigrationStudentError,
} from './api/classroomsApi';
import { ClassroomPrescriptionsPDF } from './components/pdf/ClassroomPrescriptionsPDF';
import './styles.scss';

const FIELD_LABELS: Record<string, string> = {
  // dados básicos
  name:        'Nome completo',
  birthday:    'Data de nascimento',
  cpf:         'CPF do aluno',
  sex:         'Sexo',
  color_race:  'Cor/Raça',
  zone:        'Zona (urbana ou rural)',
  deficiency:  'Informação de deficiência',
  // responsável e contato
  telephone:              'Telefone do aluno',
  responsable_name:       'Nome do responsável',
  responsable_cpf:        'CPF do responsável',
  responsable_telephone:  'Telefone do responsável',
  responsable_email:      'E-mail do responsável',
  is_legal_responsible:   'Responsável legal',
  image_sharing_not_authorized: 'Autorização de imagem',
};

function formatErrorTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

function isMigrationValidationError(error: unknown): error is { response: { data: { students: MigrationStudentError[] } } } {
  const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
  return Array.isArray(data?.students) && (data.students as unknown[]).length > 0;
}

function avatarVariant(student: Student): 'green' | 'yellow' | 'red' {
  if (student.points >= 10) return 'red';
  if (student.points >= 5)  return 'yellow';
  return 'green';
}

export const ClassroomDetailPage = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const id = Number(classroomId);
  const navigate = useNavigate();
  const { isAdmin, isTriador } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [exportingPrescriptions, setExportingPrescriptions] = useState(false);
  const [migrationErrors, setMigrationErrors] = useState<SavedMigrationErrors | null>(null);

  const { data: classroom, isLoading } = useClassroom(id);
  const { data: students = [] } = useStudents({ classroomId: id });
  const { data: projects = [], isLoading: loadingProjects } = useMigrationProjects(showMigrationModal);
  const { mutate: updateClassroom, isPending: updating } = useUpdateClassroom();
  const { mutate: deleteClassroom } = useDeleteClassroom();
  const { mutate: deleteStudent } = useDeleteStudent();
  const { mutate: sendMigration, isPending: sendingMigration } = useSendMigration();

  useEffect(() => {
    if (id) setMigrationErrors(migrationErrorsStorage.load(id));
  }, [id]);

  const nowLabel = () =>
    new Date()
      .toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
      .replace(',', ' -') + 'h';

  const downloadPdf = async (element: React.ReactElement<DocumentProps>, filename: string) => {
    const blob = await pdf(element).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const migrationSchema = yup.object({
    project: yup.number().typeError('Projeto obrigatório').required('Projeto obrigatório'),
    name: yup
      .string()
      .transform((value) => value?.trim())
      .required('Nome obrigatório'),
    year: yup
      .number()
      .typeError('Ano obrigatório')
      .required('Ano obrigatório')
      .integer('Ano inválido')
      .min(1900, 'Ano inválido')
      .max(new Date().getFullYear() + 1, 'Ano inválido'),
  });

  const migrationForm = useFormik({
    initialValues: {
      project: '',
      name: classroom?.name ?? '',
      year: Number(classroom?.year ?? new Date().getFullYear()),
    },
    enableReinitialize: true,
    validationSchema: migrationSchema,
    onSubmit: (values) => {
      if (sendingMigration) return;
      sendMigration(
        {
          id,
          project: Number(values.project),
          name: values.name.trim(),
          year: Number(values.year),
        },
        {
          onSuccess: () => {
            migrationErrorsStorage.clear(id);
            setMigrationErrors(null);
            setShowMigrationModal(false);
          },
          onError: (error) => {
            if (isMigrationValidationError(error)) {
              const saved = migrationErrorsStorage.save(id, error.response.data.students);
              setMigrationErrors(saved);
            }
          },
        },
      );
    },
  });

  const handleClearMigrationErrors = () => {
    migrationErrorsStorage.clear(id);
    setMigrationErrors(null);
  };

  const handleDeleteClassroom = () => {
    if (!confirm('Deseja excluir esta turma? Todos os alunos serão removidos.')) return;
    deleteClassroom(id, {
      onSuccess: () =>
        navigate(classroom?.school_fk ? `/escolas/${classroom.school_fk}` : '/escolas'),
    });
  };

  const handleExportClassroomPrescriptions = async () => {
    const studentsWithPrescription = students.filter((s) => s.receita_oculos_concluida);
    if (studentsWithPrescription.length === 0) return;

    setExportingPrescriptions(true);
    try {
      await downloadPdf(
        <ClassroomPrescriptionsPDF students={studentsWithPrescription} emittedAt={nowLabel()} />,
        `receitas-turma-${id}-${Date.now()}.pdf`,
      );
    } finally {
      setExportingPrescriptions(false);
    }
  };

  if (isLoading) {
    return <div className="loading-center"><i className="pi pi-spin pi-spinner" /></div>;
  }

  const title = classroom
    ? [classroom.school?.name, classroom.name, classroom.year].filter(Boolean).join(' | ')
    : '';

  return (
    <div className="classroom-detail">
      <div className="page-header">
        <button
          className="btn-back"
          onClick={() =>
            navigate(classroom?.school_fk ? `/escolas/${classroom.school_fk}` : '/escolas')
          }
          type="button"
        >
          <i className="pi pi-arrow-left" />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{title}</h1>
          <p className="classroom-detail__subtitle">Ano da Turma</p>
        </div>
        <div className="page-header__actions">
          {(isAdmin || isTriador) && (
            <Button
              label="Adicionar Aluno"
              icon="pi pi-plus"
              onClick={() => navigate(`/turmas/${id}/criar-aluno`)}
            />
          )}
          {(isAdmin || isTriador) && (
            <Button
              label="Gerar Receitas PDF"
              variant="secondary"
              size="sm"
              icon="pi pi-file-pdf"
              onClick={handleExportClassroomPrescriptions}
              loading={exportingPrescriptions}
              disabled={!students.some((s) => s.receita_oculos_concluida)}
            />
          )}
          {(isAdmin || isTriador) && (
            <Button label="Editar" variant="ghost" size="sm" onClick={() => setShowEditModal(true)} icon="pi pi-pencil" />
          )}
          {isAdmin && (
            <Button
              label="Migrar MeuBen"
              variant="secondary"
              size="sm"
              icon="pi pi-send"
              onClick={() => setShowMigrationModal(true)}
            />
          )}
          {isAdmin && (
            <Button label="Excluir" variant="danger" size="sm" onClick={handleDeleteClassroom} icon="pi pi-trash" />
          )}
        </div>
      </div>

      {isAdmin && migrationErrors && migrationErrors.students.length > 0 && (
        <button
          type="button"
          className="migration-error-banner"
          onClick={() => setShowMigrationModal(true)}
        >
          <i className="pi pi-exclamation-triangle" />
          <span>
            {migrationErrors.students.length} aluno{migrationErrors.students.length > 1 ? 's' : ''} com
            dados incompletos para migração — clique para ver
          </span>
          <i className="pi pi-chevron-right" style={{ marginLeft: 'auto' }} />
        </button>
      )}

      <h2 className="section-title">Matrículas</h2>

      {students.length === 0 ? (
        <div className="classroom-list__empty">
          <i className="pi pi-users" />
          <p>Nenhum aluno matriculado</p>
          {(isAdmin || isTriador) && (
            <p className="classroom-list__empty-hint">
              Clique no <strong>+</strong> para adicionar o primeiro aluno
            </p>
          )}
        </div>
      ) : (
        <div className="student-grid">
          {students.map((student) => {
            const variant = avatarVariant(student);
            return (
              <div
                key={student.id}
                className="student-card"
                onClick={() => navigate(`/alunos/${student.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/alunos/${student.id}`)}
              >
                <div className="student-card__header">
                  <span className="student-card__label">Aluno - Matrícula</span>
                  {(isAdmin || isTriador) && (
                    <button
                      type="button"
                      className="student-card__delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Remover este aluno?')) deleteStudent(student.id);
                      }}
                      aria-label="Remover aluno"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="student-card__body">
                  <span className={`student-card__avatar student-card__avatar--${variant}`}>
                    <i className="pi pi-user" />
                  </span>
                  <span className="student-card__name">{student.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal visible={showEditModal} onHide={() => setShowEditModal(false)} title="Editar Turma">
        <ClassroomForm
          schoolId={classroom?.school_fk ?? 0}
          initialData={{ name: classroom?.name, year: classroom?.year }}
          onSubmit={(data) =>
            updateClassroom({ id, data }, { onSuccess: () => setShowEditModal(false) })
          }
          onCancel={() => setShowEditModal(false)}
          loading={updating}
        />
      </Modal>

      <Modal
        visible={showMigrationModal}
        onHide={() => {
          if (sendingMigration) return;
          setShowMigrationModal(false);
        }}
        title="Migrar Turma para MeuBen"
      >
        <form onSubmit={migrationForm.handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="ui-input">
              <label htmlFor="migration-project" className="ui-input__label">
                Projeto
                <span className="ui-input__required">*</span>
              </label>
              <select
                id="migration-project"
                className={`p-inputtext ${migrationForm.touched.project && migrationForm.errors.project ? 'p-invalid' : ''}`}
                value={migrationForm.values.project}
                onChange={(e) => migrationForm.setFieldValue('project', e.target.value)}
                onBlur={() => migrationForm.setFieldTouched('project', true)}
                disabled={loadingProjects || sendingMigration}
              >
                <option value="">Selecione um projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {migrationForm.touched.project && migrationForm.errors.project && (
                <small className="ui-input__error">{migrationForm.errors.project}</small>
              )}
            </div>

            <Input
              id="migration-name"
              label="Nome da turma no MeuBen"
              value={migrationForm.values.name}
              onChange={(v) => migrationForm.setFieldValue('name', v)}
              error={migrationForm.touched.name ? migrationForm.errors.name : undefined}
              required
            />

            <Input
              id="migration-year"
              label="Ano"
              value={String(migrationForm.values.year ?? '')}
              onChange={(v) => migrationForm.setFieldValue('year', v)}
              error={migrationForm.touched.year ? migrationForm.errors.year : undefined}
              required
            />

            {migrationErrors && migrationErrors.students.length > 0 && (
              <div className="migration-error-panel">
                <div className="migration-error-panel__header">
                  <span>
                    <i className="pi pi-exclamation-triangle" />
                    {migrationErrors.students.length} aluno{migrationErrors.students.length > 1 ? 's' : ''} com
                    dados incompletos
                  </span>
                  <span className="migration-error-panel__time">
                    {formatErrorTimestamp(migrationErrors.timestamp)}
                  </span>
                </div>
                <ul className="migration-error-panel__list">
                  {migrationErrors.students.map((s) => (
                    <li key={s.student_id} className="migration-error-panel__item">
                      <span className="migration-error-panel__student-name">{s.name}</span>
                      <span className="migration-error-panel__fields">
                        {s.missing_or_invalid_fields.map(fieldLabel).join(', ')}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="migration-error-panel__clear"
                  onClick={handleClearMigrationErrors}
                >
                  Limpar registro de erros
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button
                label="Cancelar"
                variant="ghost"
                onClick={() => setShowMigrationModal(false)}
                disabled={sendingMigration}
              />
              <Button label="Migrar" type="submit" loading={sendingMigration} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
