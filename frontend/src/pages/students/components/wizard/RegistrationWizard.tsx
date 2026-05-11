import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClassroom } from '../../../classrooms/hooks/useClassrooms';
import { studentsApi, type CreateStudentData } from '../../api/studentsApi';
import { useQueryClient } from '@tanstack/react-query';
import { StepConsent } from './StepConsent';
import { StepBasicInfo } from './StepBasicInfo';
import '../../styles.scss';
import './styles.scss';

const STEPS = ['Consentimento', 'Dados Básicos'];

export const RegistrationWizard = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: classroom } = useClassroom(Number(classroomId));

  const back = () => {
    if (step === 0) navigate(`/turmas/${classroomId}`);
    else setStep((s) => s - 1);
  };

  const next = async (data: Record<string, unknown>) => {
    const merged = { ...formData, ...data };
    setFormData(merged);

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    if (!classroom) return;

    setIsPending(true);
    setSubmitError(null);

    try {
      const payload: CreateStudentData = {
        name:        merged.name as string,
        birthday:    merged.birthday as string,
        cpf:         (merged.cpf as string) || undefined,
        sex:         merged.sex as number,
        color_race:  merged.color_race as number,
        zone:        merged.zone as number,
        deficiency:  merged.deficiency as boolean,
        turno:       merged.turno as string,
        permission:  merged.permission as boolean,
        classroom_fk: Number(classroomId),
        school_fk:   classroom.school_fk,
      };

      const student = await studentsApi.create(payload);
      qc.invalidateQueries({ queryKey: ['students'] });
      navigate(`/alunos/${student.id}`);
    } catch {
      setSubmitError('Erro ao criar aluno. Verifique os dados e tente novamente.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="wizard">
      <div className="wizard__header">
        <button type="button" className="btn-back" onClick={back}>
          <i className="pi pi-arrow-left" />
        </button>
        <div className="wizard__steps">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={[
                'wizard__step',
                i === step ? 'wizard__step--active' : '',
                i < step ? 'wizard__step--done' : '',
              ].filter(Boolean).join(' ')}
            >
              <span className="wizard__step-dot" />
              <span className="wizard__step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard__body">
        <div className="wizard__watermark" aria-hidden="true">
          <i className="pi pi-eye" />
        </div>

        {submitError && (
          <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
            <i className="pi pi-exclamation-circle" />
            {submitError}
          </div>
        )}

        {step === 0 && <StepConsent onNext={next} />}
        {step === 1 && <StepBasicInfo onNext={next} initial={formData} loading={isPending} />}
      </div>
    </div>
  );
};
