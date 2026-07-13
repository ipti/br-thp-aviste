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

const ACUIDADE_LABEL: Record<string, string> = {
  '1': '20/200', '2': '20/100', '3': '20/80', '4': '20/60',
  '5': '20/50',  '6': '20/40',  '7': '20/30', '8': '20/20',
  'nenhum': 'Nenhum',
};
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

const FieldRow = ({ label, value, fullWidth }: { label: string; value?: string | boolean | number | null; fullWidth?: boolean }) => (
  <div className="field-row" style={fullWidth ? { gridColumn: '1 / -1' } : undefined}>
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
  const [activeTab, setActiveTab] = useState<Section>('basic');

  const switchTab = (tab: Section) => { setActiveTab(tab); setOpenForm(null); };

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

  const tabs: { key: Section; label: string; show: boolean; done: boolean; disabled?: boolean }[] = [
    { key: 'basic',         label: 'Dados',       show: true,              done: false },
    { key: 'questionnaire', label: 'Questionário', show: canViewAllAspects, done: student.questionario_pais_concluido },
    { key: 'screening',     label: 'Triagem',      show: canViewAllAspects, done: student.triagem_concluida },
    { key: 'consultation',  label: 'Consulta',     show: canMedic,          done: student.consulta_concluida },
    { key: 'prescription',  label: 'Receita',      show: canMedic,          done: student.receita_oculos_concluida },
    { key: 'delivery',      label: 'Entrega',      show: canMedic,          done: student.entrega_oculos_concluida, disabled: !student.receita_oculos_concluida },
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

      {/* Tabs */}
      <div className="student-tabs">
        {tabs.filter(t => t.show).map(t => (
          <button
            key={t.key}
            type="button"
            disabled={t.disabled}
            onClick={() => switchTab(t.key)}
            className={[
              'student-tab',
              activeTab === t.key ? 'student-tab--active' : '',
              t.done ? 'student-tab--done' : '',
            ].filter(Boolean).join(' ')}
          >
            <i className={`pi ${t.done ? 'pi-check-circle' : 'pi-circle'}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Dados básicos */}
      {activeTab === 'basic' && <section className="detail-section">
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
      </section>}

      {/* Questionário */}
      {activeTab === 'questionnaire' && canViewAllAspects && (
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
      {activeTab === 'screening' && canViewAllAspects && (
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
              <FieldRow label="Acuidade OD"   value={ACUIDADE_LABEL[student.acuidade_triagem_direito  ?? ''] ?? student.acuidade_triagem_direito  ?? '—'} />
              <FieldRow label="Acuidade OE"   value={ACUIDADE_LABEL[student.acuidade_triagem_esquerdo ?? ''] ?? student.acuidade_triagem_esquerdo ?? '—'} />
              <FieldRow label="Teste cover"   value={student.test_cover === '0' ? 'Passou' : student.test_cover === '1' ? 'Falhou' : '—'} />
              <FieldRow label="Mov. ocular"   value={student.test_movimento_ocular === '0' ? 'Passou' : student.test_movimento_ocular === '1' ? 'Falhou' : '—'} />
              <FieldRow label="Mancha branca" value={student.test_mancha_branca === '0' ? 'Passou' : student.test_mancha_branca === '1' ? 'Falhou' : '—'} />
              <FieldRow
                label="Atendimento oftalmológico prévio"
                value={student.atendimento_oftalmologico_previo === '1' ? 'Sim' : student.atendimento_oftalmologico_previo === '0' ? 'Não' : '—'}
              />
              {student.observacao_triagem && (
                <FieldRow label="Observações" value={student.observacao_triagem} fullWidth />
              )}
            </div>
          )}
        </section>
      )}

      {/* Consulta */}
      {activeTab === 'consultation' && canMedic && (
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
            <div className="consulta-view">
              <div className="detail-section__grid">
                <FieldRow label="Data"   value={student.data_consulta} />
                <FieldRow label="Médico" value={student.nome_medico} />
                <FieldRow label="CRM"    value={student.crm_medico} />
                <FieldRow label="Precisa de óculos" value={student.precisa_oculos === '1' ? 'Sim' : student.precisa_oculos === '0' ? 'Não' : undefined} />
                {student.proxima_consulta_meses && <FieldRow label="Próxima consulta (meses)" value={student.proxima_consulta_meses} />}
              </div>

              {(student.spot_esferico_od || student.spot_esferico_oe) && (
                <div className="consulta-view__block">
                  <p className="consulta-view__subtitle">Spot Vision</p>
                  <p className="consulta-view__eye-label">Olho direito</p>
                  <div className="detail-section__grid">
                    <FieldRow label="Esférico"   value={student.spot_esferico_od} />
                    <FieldRow label="Cilíndrico" value={student.spot_cilindrico_od} />
                    <FieldRow label="Eixo"       value={student.spot_eixo_od} />
                    <FieldRow label="Eq. esférico" value={student.spot_eq_esferico_od} />
                    <FieldRow label="DP"         value={student.spot_dp_od} />
                  </div>
                  <p className="consulta-view__eye-label">Olho esquerdo</p>
                  <div className="detail-section__grid">
                    <FieldRow label="Esférico"   value={student.spot_esferico_oe} />
                    <FieldRow label="Cilíndrico" value={student.spot_cilindrico_oe} />
                    <FieldRow label="Eixo"       value={student.spot_eixo_oe} />
                    <FieldRow label="Eq. esférico" value={student.spot_eq_esferico_oe} />
                    <FieldRow label="DP"         value={student.spot_dp_oe} />
                  </div>
                  {student.spot_observacao && <FieldRow label="Observação" value={student.spot_observacao} fullWidth />}
                </div>
              )}

              {student.anamnese && (
                <div className="consulta-view__block">
                  <p className="consulta-view__subtitle">Anamnese</p>
                  <FieldRow label="Anamnese" value={student.anamnese} fullWidth />
                </div>
              )}

              {(student.ref_estatica_esferico_od || student.ref_estatica_esferico_oe) && (
                <div className="consulta-view__block">
                  <p className="consulta-view__subtitle">Refração Estática</p>
                  <p className="consulta-view__eye-label">Olho direito</p>
                  <div className="detail-section__grid">
                    <FieldRow label="Esférico"       value={student.ref_estatica_esferico_od} />
                    <FieldRow label="Cilíndrico"     value={student.ref_estatica_cilindrico_od} />
                    <FieldRow label="Eixo"           value={student.ref_estatica_eixo_od} />
                    <FieldRow label="Acuidade visual" value={student.ref_estatica_acuidade_od} />
                  </div>
                  <p className="consulta-view__eye-label">Olho esquerdo</p>
                  <div className="detail-section__grid">
                    <FieldRow label="Esférico"       value={student.ref_estatica_esferico_oe} />
                    <FieldRow label="Cilíndrico"     value={student.ref_estatica_cilindrico_oe} />
                    <FieldRow label="Eixo"           value={student.ref_estatica_eixo_oe} />
                    <FieldRow label="Acuidade visual" value={student.ref_estatica_acuidade_oe} />
                  </div>
                </div>
              )}

              {(student.biomicroscopia_od || student.biomicroscopia_oe) && (
                <div className="consulta-view__block">
                  <p className="consulta-view__subtitle">Biomicroscopia</p>
                  <div className="detail-section__grid">
                    {student.biomicroscopia_od && <FieldRow label="Olho direito"   value={student.biomicroscopia_od} />}
                    {student.biomicroscopia_oe && <FieldRow label="Olho esquerdo"  value={student.biomicroscopia_oe} />}
                  </div>
                </div>
              )}

              {(student.fundoscopia_od || student.fundoscopia_oe) && (
                <div className="consulta-view__block">
                  <p className="consulta-view__subtitle">Fundoscopia</p>
                  <div className="detail-section__grid">
                    {student.fundoscopia_od && <FieldRow label="Olho direito"  value={student.fundoscopia_od} />}
                    {student.fundoscopia_oe && <FieldRow label="Olho esquerdo" value={student.fundoscopia_oe} />}
                  </div>
                </div>
              )}

              {student.motilidade_ocular && (
                <div className="consulta-view__block">
                  <FieldRow label="Motilidade ocular" value={student.motilidade_ocular} fullWidth />
                </div>
              )}

              {(student.diagnostico || student.conduta) && (
                <div className="consulta-view__block">
                  <p className="consulta-view__subtitle">Diagnóstico e Conduta</p>
                  <div className="detail-section__grid">
                    {student.diagnostico && <FieldRow label="Diagnóstico" value={student.diagnostico} fullWidth />}
                    {student.conduta     && <FieldRow label="Conduta"     value={student.conduta}     fullWidth />}
                  </div>
                </div>
              )}

              {(() => {
                const ACOMP_LABELS: Record<string, string> = {
                  acomp_ambliopia: 'Ambliopia', acomp_retinoblastoma: 'Retinoblastoma',
                  acomp_catarata_congenita: 'Catarata congênita', acomp_obstrucao_lacrimais: 'Obstrução de vias lacrimais',
                  acomp_estrabismo: 'Estrabismo', acomp_glaucoma_congenito: 'Glaucoma congênito',
                  acomp_uveites: 'Uveítes', acomp_nistagmo: 'Nistagmo',
                  acomp_miopia_progressiva: 'Miopia progressiva', acomp_ectasias_cornea: 'Ectasias de córnea',
                  acomp_alergias_conjuntivites: 'Alergias / Conjuntivites / Calázio', acomp_baixa_visao_central: 'Baixa visão central',
                };
                const s = student as unknown as Record<string, unknown>;
                const selected = Object.entries(ACOMP_LABELS).filter(([k]) => s[k]);
                return selected.length > 0 ? (
                  <div className="consulta-view__block">
                    <p className="consulta-view__subtitle">Acompanhamento</p>
                    <div className="consulta-view__tags">
                      {selected.map(([k, label]) => <span key={k} className="consulta-view__tag">{label}</span>)}
                    </div>
                  </div>
                ) : null;
              })()}

              {student.observacoes_consulta && (
                <div className="consulta-view__block">
                  <FieldRow label="Observações" value={student.observacoes_consulta} fullWidth />
                </div>
              )}
            </div>
          ) : (
            <p className="detail-section__empty-msg">Ainda não preenchida</p>
          )}
        </section>
      )}

      {/* Receita */}
      {activeTab === 'prescription' && canMedic && (
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

      {/* Entrega de óculos */}
      {activeTab === 'delivery' && student.receita_oculos_concluida && (
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
