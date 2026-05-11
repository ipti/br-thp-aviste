import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudent, useUpdateBasic, useUpdateQuestionnaire, useUpdateScreening, useUpdatePrescription, useUpdateConsultation, useMarkGlassesDelivered } from './hooks/useStudents';
import type { UpdateGlassesDeliveryData } from './api/studentsApi';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { BasicInfoForm } from './components/forms/BasicInfoForm';
import { QuestionnaireForm } from './components/forms/QuestionnaireForm';
import { ScreeningForm } from './components/forms/ScreeningForm';
import { PrescriptionForm } from './components/forms/PrescriptionForm';
import { ConsultationForm } from './components/forms/ConsultationForm';
import { GlassesDeliveryForm } from './components/forms/GlassesDeliveryForm';
import { StudentPrescriptionPDF } from './components/pdf/StudentPrescriptionPDF';
import './styles.scss';

const SEX_LABEL   = ['Masculino', 'Feminino'];
const COLOR_LABEL = ['Branca', 'Preta', 'Amarela', 'Parda', 'Indígena', 'Não declarado'];
const ZONE_LABEL  = ['Urbana', 'Rural'];
const HORAS_TELAS_LABEL: Record<number, string> = {
  1: 'Menos de 1h',
  2: '1-2h',
  3: '2-4h',
  4: '4-8h',
  5: 'Mais de 8h',
};
const HORAS_AR_LIVRE_LABEL: Record<number, string> = {
  1: 'Menos de 30min',
  2: '30min - 1h',
  3: '1-2h',
  4: 'Mais de 2h',
};

const FieldRow = ({ label, value }: { label: string; value?: string | boolean | number | null }) => (
  <div className="field-row">
    <span className="field-row__label">{label}</span>
    <span className="field-row__value">
      {value === true ? 'Sim' : value === false ? 'Não' : (value ?? '—')}
    </span>
  </div>
);

type Section = 'basic' | 'questionnaire' | 'screening' | 'prescription' | 'consultation' | 'delivery';

const nowLabel = () =>
  new Date()
    .toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

export const StudentDetailPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const id = Number(studentId);
  const navigate = useNavigate();
  const { isAdmin, isMedico, isTriador } = useAuth();
  const [openForm, setOpenForm] = useState<Section | null>(null);

  const { data: student, isLoading } = useStudent(id);
  const { mutate: saveBasic,         isPending: savingB }  = useUpdateBasic(id);
  const { mutate: saveQuestionnaire, isPending: savingQ }  = useUpdateQuestionnaire(id);
  const { mutate: saveScreening,     isPending: savingS }  = useUpdateScreening(id);
  const { mutate: savePrescription,  isPending: savingP }  = useUpdatePrescription(id);
  const { mutate: saveConsultation,  isPending: savingC }  = useUpdateConsultation(id);
  const { mutate: markDelivered,     isPending: delivering } = useMarkGlassesDelivered(id);
  const [exportingPrescription, setExportingPrescription] = useState(false);

  if (isLoading) return <div className="loading-center"><i className="pi pi-spin pi-spinner" /></div>;
  if (!student) return null;

  const canEdit = isAdmin || isTriador;
  const canMedic = isAdmin || isMedico;
  const canViewAllAspects = isAdmin || isTriador || isMedico;

  const handleSave = (section: Section, data: Record<string, unknown>) => {
    const done = () => setOpenForm(null);
    if (section === 'basic')         saveBasic(data,         { onSuccess: done });
    if (section === 'questionnaire') saveQuestionnaire(data, { onSuccess: done });
    if (section === 'screening')     saveScreening(data,     { onSuccess: done });
    if (section === 'prescription')  savePrescription(data,  { onSuccess: done });
    if (section === 'consultation')  saveConsultation(data,  { onSuccess: done });
  };

  const handleExportPrescription = async () => {
    setExportingPrescription(true);
    try {
      await downloadPdf(
        <StudentPrescriptionPDF student={student} emittedAt={nowLabel()} />,
        `receita-${student.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`,
      );
    } finally {
      setExportingPrescription(false);
    }
  };

  const progressSteps = [
    { label: 'Questionário', done: student.questionario_pais_concluido },
    { label: 'Triagem',      done: student.triagem_concluida },
    { label: 'Receita',      done: student.receita_oculos_concluida },
    { label: 'Consulta',     done: student.consulta_concluida },
    { label: 'Óculos',       done: student.entrega_oculos_concluida },
  ];

  return (
    <div className="student-detail">
      {/* Cabeçalho */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)} type="button">
          <i className="pi pi-arrow-left" />
        </button>
        <h1 className="page-title">{student.name}</h1>
        <Badge
          label={`${student.points} pts`}
          variant={student.points >= 10 ? 'danger' : student.points >= 5 ? 'warning' : 'neutral'}
        />
      </div>

      {/* Progresso */}
      <div className="student-detail__progress">
        {progressSteps.map((s) => (
          <div key={s.label} className={['progress-step', s.done ? 'progress-step--done' : ''].filter(Boolean).join(' ')}>
            <i className={`pi ${s.done ? 'pi-check-circle' : 'pi-circle'}`} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Dados básicos */}
      <section className="detail-section">
        <div className="detail-section__header">
          <h3 className="detail-section__title">Dados Básicos</h3>
          {canEdit && openForm !== 'basic' && (
            <button type="button" className="detail-section__edit-btn" onClick={() => setOpenForm('basic')}>
              Editar
            </button>
          )}
        </div>
        {openForm === 'basic' ? (
          <BasicInfoForm
            student={student}
            onSubmit={(d) => handleSave('basic', d)}
            loading={savingB}
            onCancel={() => setOpenForm(null)}
          />
        ) : (
          <div className="detail-section__grid">
            <FieldRow label="Nascimento"  value={student.birthday} />
            <FieldRow label="Sexo"        value={SEX_LABEL[student.sex]} />
            <FieldRow label="CPF"         value={student.cpf} />
            <FieldRow label="Cor/Raça"    value={COLOR_LABEL[student.color_race]} />
            <FieldRow label="Zona"        value={ZONE_LABEL[student.zone]} />
            <FieldRow label="Turno"       value={student.turno} />
            <FieldRow label="Deficiência" value={student.deficiency} />
            <FieldRow label="Autorização" value={student.permission} />
          </div>
        )}
      </section>

      {/* Questionário */}
      {canViewAllAspects && (
        <section className="detail-section">
          <div className="detail-section__header">
            <h3 className="detail-section__title">
              Questionário de Saúde
              {student.questionario_pais_concluido && <i className="pi pi-check-circle detail-section__done" />}
            </h3>
            {canEdit && openForm !== 'questionnaire' && (
              <button type="button" className="detail-section__edit-btn" onClick={() => setOpenForm('questionnaire')}>
                {student.questionario_pais_concluido ? 'Editar' : 'Preencher'}
              </button>
            )}
          </div>
          {canEdit && openForm === 'questionnaire' ? (
            <QuestionnaireForm
              student={student}
              onSubmit={(d) => handleSave('questionnaire', d)}
              loading={savingQ}
              onCancel={() => setOpenForm(null)}
            />
          ) : !student.questionario_pais_concluido ? (
            <p className="detail-section__empty-msg">Questionário ainda não preenchido</p>
          ) : (
            <div className="detail-section__grid">
              <FieldRow label="Filho usa óculos" value={student.filho_oculos === '1' ? 'Sim' : student.filho_oculos === '0' ? 'Não' : '—'} />
              <FieldRow
                label="Horas em eletrônicos"
                value={
                  student.horas_uso_aparelhos_eletronicos
                    ? HORAS_TELAS_LABEL[student.horas_uso_aparelhos_eletronicos]
                    : null
                }
              />
              <FieldRow
                label="Horas ao ar livre"
                value={
                  student.horas_atividades_ao_ar_livre
                    ? HORAS_AR_LIVRE_LABEL[student.horas_atividades_ao_ar_livre]
                    : null
                }
              />
              <FieldRow label="Dificuldade no quadro" value={student.dificuldade_quadro} />
              <FieldRow label="Dificuldade no livro" value={student.dificuldade_livro} />
              <FieldRow label="Olho torto constante" value={student.olho_torto_constante} />
              <FieldRow label="Olho torto em momentos" value={student.olho_torto_momentos} />
              <FieldRow label="Aperta os olhos/rosto" value={student.rosto_aperta_olhos} />
              <FieldRow label="Tremor nos olhos" value={student.tremor_olhos} />
              <FieldRow label="Mancha branca pupila" value={student.mancha_branca_pupila} />
              <FieldRow label="Olho preguiçoso" value={student.olho_preguicoso} />
              <FieldRow label="Olho torto (doença)" value={student.olho_torto_doenca} />
              <FieldRow label="Catarata na infância" value={student.catarata_infancia} />
              <FieldRow label="Glaucoma congênito" value={student.glaucoma_congenito} />
              <FieldRow label="Tumor nos olhos" value={student.tumor_olhos} />
              <FieldRow label="Ceratocone/transplante" value={student.ceratocone_transplante} />
              <FieldRow label="Pálpebra caída" value={student.palpebra_caida} />
              <FieldRow label="Miopia em ambos os pais" value={student.miopia_ambos_pais} />
              <FieldRow label="Miopia em um dos pais" value={student.miopia_um_pai} />
              <FieldRow label="Hipermetropia/astigmatismo familiar" value={student.hipermetropia_astigmatismo} />
              <FieldRow label="Estrabismo familiar" value={student.estrabismo} />
              <FieldRow label="Catarata/glaucoma familiar" value={student.catarata_glaucoma} />
              <FieldRow label="Olho preguiçoso familiar" value={student.olho_preguicoso_familiar} />
              <FieldRow label="Tumor no olho familiar" value={student.tumor_olho_familiar} />
              <FieldRow label="Prematuridade" value={student.prematuridade} />
              <FieldRow label="Síndrome de Down" value={student.sindrome_down} />
              <FieldRow label="Paralisia/tumor cerebral" value={student.paralisia_tumor_cerebral} />
              <FieldRow label="Outras síndromes genéticas" value={student.outras_sindromes_geneticas} />
              <FieldRow label="Diabetes" value={student.diabetes} />
              <FieldRow label="Artrite/artrose" value={student.artrite_artrose} />
              <FieldRow label="Alergias/corticoides" value={student.alergias_corticoides} />
            </div>
          )}
        </section>
      )}

      {/* Triagem */}
      {canViewAllAspects && (
        <section className="detail-section">
          <div className="detail-section__header">
            <h3 className="detail-section__title">
              Triagem Visual
              {student.triagem_concluida && <i className="pi pi-check-circle detail-section__done" />}
            </h3>
            {canEdit && openForm !== 'screening' && (
              <button type="button" className="detail-section__edit-btn" onClick={() => setOpenForm('screening')}>
                {student.triagem_concluida ? 'Editar' : 'Preencher'}
              </button>
            )}
          </div>
          {canEdit && openForm === 'screening' ? (
            <ScreeningForm
              student={student}
              onSubmit={(d) => handleSave('screening', d)}
              loading={savingS}
              onCancel={() => setOpenForm(null)}
            />
          ) : !student.triagem_concluida ? (
            <p className="detail-section__empty-msg">Triagem visual ainda não preenchida</p>
          ) : (
            <div className="detail-section__grid">
              <FieldRow label="Acuidade OD"   value={student.acuidade_triagem_direito} />
              <FieldRow label="Acuidade OE"   value={student.acuidade_triagem_esquerdo} />
              <FieldRow label="Teste cover"   value={student.test_cover === '0' ? 'Passou' : student.test_cover === '1' ? 'Falhou' : '—'} />
              <FieldRow label="Mov. ocular"   value={student.test_movimento_ocular === '0' ? 'Passou' : student.test_movimento_ocular === '1' ? 'Falhou' : '—'} />
              <FieldRow label="Mancha branca" value={student.test_mancha_branca === '0' ? 'Passou' : student.test_mancha_branca === '1' ? 'Falhou' : '—'} />
            </div>
          )}
        </section>
      )}

      {/* Receita */}
      {canMedic && (
        <section className="detail-section">
          <div className="detail-section__header">
            <h3 className="detail-section__title">
              Receita de Óculos
              {student.receita_oculos_concluida && <i className="pi pi-check-circle detail-section__done" />}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {student.receita_oculos_concluida && (
                <button
                  type="button"
                  className="detail-section__edit-btn"
                  onClick={handleExportPrescription}
                  disabled={exportingPrescription}
                >
                  {exportingPrescription ? 'Gerando PDF...' : 'Gerar Receita PDF'}
                </button>
              )}
              {openForm !== 'prescription' && (
                <button type="button" className="detail-section__edit-btn" onClick={() => setOpenForm('prescription')}>
                  {student.receita_oculos_concluida ? 'Editar' : 'Preencher'}
                </button>
              )}
            </div>
          </div>
          {openForm === 'prescription' ? (
            <PrescriptionForm
              student={student}
              onSubmit={(d) => handleSave('prescription', d)}
              loading={savingP}
              onCancel={() => setOpenForm(null)}
            />
          ) : student.receita_oculos_concluida ? (
            <div className="detail-section__grid">
              <FieldRow label="Esférico OD"   value={student.receita_esferico_od} />
              <FieldRow label="Cilíndrico OD" value={student.receita_cilindrico_od} />
              <FieldRow label="Eixo OD"       value={student.receita_eixo_od} />
              <FieldRow label="Esférico OE"   value={student.receita_esferico_oe} />
              <FieldRow label="Cilíndrico OE" value={student.receita_cilindrico_oe} />
              <FieldRow label="Eixo OE"       value={student.receita_eixo_oe} />
              <FieldRow label="Adição"        value={student.receita_adicao} />
              <FieldRow label="DP"            value={student.receita_dp} />
            </div>
          ) : (
            <p className="detail-section__empty-msg">Ainda não preenchida</p>
          )}
        </section>
      )}

      {/* Consulta */}
      {canMedic && (
        <section className="detail-section">
          <div className="detail-section__header">
            <h3 className="detail-section__title">
              Consulta Médica
              {student.consulta_concluida && <i className="pi pi-check-circle detail-section__done" />}
            </h3>
            {openForm !== 'consultation' && (
              <button type="button" className="detail-section__edit-btn" onClick={() => setOpenForm('consultation')}>
                {student.consulta_concluida ? 'Editar' : 'Preencher'}
              </button>
            )}
          </div>
          {openForm === 'consultation' ? (
            <ConsultationForm
              student={student}
              onSubmit={(d) => handleSave('consultation', d)}
              loading={savingC}
              onCancel={() => setOpenForm(null)}
            />
          ) : student.consulta_concluida ? (
            <div className="detail-section__grid">
              <FieldRow label="Data"   value={student.data_consulta} />
              <FieldRow label="Médico" value={student.nome_medico} />
              <FieldRow label="CRM"    value={student.crm_medico} />
            </div>
          ) : (
            <p className="detail-section__empty-msg">Ainda não preenchida</p>
          )}
        </section>
      )}

      {/* Entrega de óculos */}
      {student.receita_oculos_concluida && (
        <section className="detail-section">
          <div className="detail-section__header">
            <h3 className="detail-section__title">
              Entrega de Óculos
              {student.entrega_oculos_concluida && <i className="pi pi-check-circle detail-section__done" />}
            </h3>
            {isAdmin && !student.entrega_oculos_concluida && openForm !== 'delivery' && (
              <button type="button" className="detail-section__edit-btn" onClick={() => setOpenForm('delivery')}>
                Preencher
              </button>
            )}
          </div>

          {openForm === 'delivery' ? (
            <GlassesDeliveryForm
              student={student}
              loading={delivering}
              onCancel={() => setOpenForm(null)}
              onSubmit={(data) =>
                markDelivered(data as unknown as UpdateGlassesDeliveryData, { onSuccess: () => setOpenForm(null) })
              }
            />
          ) : student.entrega_oculos_concluida ? (
            <div className="detail-section__grid">
              <FieldRow label="Data da entrega" value={student.data_entrega_oculos} />
              <FieldRow label="Responsável" value={student.responsavel_entrega_oculos} />
              <FieldRow label="Confirmado" value={student.entrega_oculos_concluida} />
            </div>
          ) : (
            <p className="detail-section__empty-msg">Entrega ainda não registrada</p>
          )}
        </section>
      )}
    </div>
  );
};
