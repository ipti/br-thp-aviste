import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

const SIM_NAO = [
  { label: 'Não', value: '0' },
  { label: 'Sim', value: '1' },
];

const ACOMPANHAMENTOS: { key: string; label: string }[] = [
  { key: 'acomp_ambliopia',               label: 'Ambliopia' },
  { key: 'acomp_retinoblastoma',          label: 'Retinoblastoma' },
  { key: 'acomp_catarata_congenita',      label: 'Catarata congênita' },
  { key: 'acomp_obstrucao_lacrimais',     label: 'Obstrução de vias lacrimais' },
  { key: 'acomp_estrabismo',              label: 'Estrabismo' },
  { key: 'acomp_glaucoma_congenito',      label: 'Glaucoma congênito' },
  { key: 'acomp_uveites',                label: 'Uveítes' },
  { key: 'acomp_nistagmo',               label: 'Nistagmo' },
  { key: 'acomp_miopia_progressiva',     label: 'Miopia progressiva' },
  { key: 'acomp_ectasias_cornea',        label: 'Ectasias de córnea' },
  { key: 'acomp_alergias_conjuntivites', label: 'Alergias / Conjuntivites / Calázio' },
  { key: 'acomp_baixa_visao_central',    label: 'Baixa visão central' },
];

const schema = yup.object({
  data_consulta: yup.string().required('Obrigatório'),
  crm_medico:    yup.string().required('Obrigatório'),
  nome_medico:   yup.string().required('Obrigatório'),
});

interface Props {
  student: Student;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  onCancel: () => void;
}

export const ConsultationForm = ({ student, onSubmit, loading, onCancel }: Props) => {
  const formik = useFormik({
    initialValues: {
      data_consulta: student.data_consulta ?? '',
      crm_medico:    student.crm_medico    ?? '',
      nome_medico:   student.nome_medico   ?? '',
      spot_esferico_od:    student.spot_esferico_od    ?? '',
      spot_cilindrico_od:  student.spot_cilindrico_od  ?? '',
      spot_eixo_od:        student.spot_eixo_od        ?? '',
      spot_eq_esferico_od: student.spot_eq_esferico_od ?? '',
      spot_dp_od:          student.spot_dp_od          ?? '',
      spot_esferico_oe:    student.spot_esferico_oe    ?? '',
      spot_cilindrico_oe:  student.spot_cilindrico_oe  ?? '',
      spot_eixo_oe:        student.spot_eixo_oe        ?? '',
      spot_eq_esferico_oe: student.spot_eq_esferico_oe ?? '',
      spot_dp_oe:          student.spot_dp_oe          ?? '',
      spot_observacao:           student.spot_observacao           ?? '',
      anamnese:                  student.anamnese                  ?? '',
      ref_estatica_esferico_od:  student.ref_estatica_esferico_od  ?? '',
      ref_estatica_cilindrico_od:student.ref_estatica_cilindrico_od?? '',
      ref_estatica_eixo_od:      student.ref_estatica_eixo_od      ?? '',
      ref_estatica_acuidade_od:  student.ref_estatica_acuidade_od  ?? '',
      ref_estatica_esferico_oe:  student.ref_estatica_esferico_oe  ?? '',
      ref_estatica_cilindrico_oe:student.ref_estatica_cilindrico_oe?? '',
      ref_estatica_eixo_oe:      student.ref_estatica_eixo_oe      ?? '',
      ref_estatica_acuidade_oe:  student.ref_estatica_acuidade_oe  ?? '',
      biomicroscopia_od: student.biomicroscopia_od ?? '',
      biomicroscopia_oe: student.biomicroscopia_oe ?? '',
      fundoscopia_od:    student.fundoscopia_od    ?? '',
      fundoscopia_oe:    student.fundoscopia_oe    ?? '',
      motilidade_ocular: student.motilidade_ocular ?? '',
      diagnostico:    student.diagnostico    ?? '',
      conduta:        student.conduta        ?? '',
      precisa_oculos: student.precisa_oculos ?? '0',
      acomp_ambliopia:              student.acomp_ambliopia              ?? false,
      acomp_retinoblastoma:         student.acomp_retinoblastoma         ?? false,
      acomp_catarata_congenita:     student.acomp_catarata_congenita     ?? false,
      acomp_obstrucao_lacrimais:    student.acomp_obstrucao_lacrimais    ?? false,
      acomp_estrabismo:             student.acomp_estrabismo             ?? false,
      acomp_glaucoma_congenito:     student.acomp_glaucoma_congenito     ?? false,
      acomp_uveites:                student.acomp_uveites                ?? false,
      acomp_nistagmo:               student.acomp_nistagmo               ?? false,
      acomp_miopia_progressiva:     student.acomp_miopia_progressiva     ?? false,
      acomp_ectasias_cornea:        student.acomp_ectasias_cornea        ?? false,
      acomp_alergias_conjuntivites: student.acomp_alergias_conjuntivites ?? false,
      acomp_baixa_visao_central:    student.acomp_baixa_visao_central    ?? false,
      proxima_consulta_meses: student.proxima_consulta_meses ?? '',
      observacoes_consulta:   student.observacoes_consulta   ?? '',
    },
    validationSchema: schema,
    onSubmit,
  });

  const vals = formik.values as Record<string, unknown>;
  const ta = (id: string, label: string, rows = 3) => (
    <div className="ui-input">
      <label htmlFor={id} className="ui-input__label">{label}</label>
      <textarea id={id} className="ui-input__textarea" rows={rows}
        value={(vals[id] as string) ?? ''}
        onChange={(e) => formik.setFieldValue(id, e.target.value)} />
    </div>
  );

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">

      {/* Dados da consulta */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Dados da Consulta</p>
        <div className="detail-form__grid">
          <Input id="data_consulta" label="Data da consulta" value={formik.values.data_consulta}
            onChange={(v) => formik.setFieldValue('data_consulta', v)}
            error={formik.touched.data_consulta ? formik.errors.data_consulta : undefined}
            placeholder="DD/MM/AAAA" mask="date" required />
          <Input id="nome_medico" label="Nome do médico" value={formik.values.nome_medico}
            onChange={(v) => formik.setFieldValue('nome_medico', v)}
            error={formik.touched.nome_medico ? formik.errors.nome_medico : undefined}
            placeholder="Dr. Carlos Souza" required />
          <Input id="crm_medico" label="CRM" value={formik.values.crm_medico}
            onChange={(v) => formik.setFieldValue('crm_medico', v)}
            error={formik.touched.crm_medico ? formik.errors.crm_medico : undefined}
            placeholder="12345-SP" mask="crm" required />
        </div>
      </div>

      {/* Spot Vision */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Escaneamento Visual (Spot Vision)</p>
        <p className="detail-form__sub-label">Olho direito</p>
        <div className="detail-form__grid">
          <Input id="spot_esferico_od"    label="Refração esférico"   value={formik.values.spot_esferico_od}    onChange={(v) => formik.setFieldValue('spot_esferico_od', v)} />
          <Input id="spot_cilindrico_od"  label="Refração cilíndrico" value={formik.values.spot_cilindrico_od}  onChange={(v) => formik.setFieldValue('spot_cilindrico_od', v)} />
          <Input id="spot_eixo_od"        label="Refração eixo"       value={formik.values.spot_eixo_od}        onChange={(v) => formik.setFieldValue('spot_eixo_od', v)} />
          <Input id="spot_eq_esferico_od" label="Eq. esférico"        value={formik.values.spot_eq_esferico_od} onChange={(v) => formik.setFieldValue('spot_eq_esferico_od', v)} />
          <Input id="spot_dp_od"          label="DP"                  value={formik.values.spot_dp_od}          onChange={(v) => formik.setFieldValue('spot_dp_od', v)} />
        </div>
        <p className="detail-form__sub-label">Olho esquerdo</p>
        <div className="detail-form__grid">
          <Input id="spot_esferico_oe"    label="Refração esférico"   value={formik.values.spot_esferico_oe}    onChange={(v) => formik.setFieldValue('spot_esferico_oe', v)} />
          <Input id="spot_cilindrico_oe"  label="Refração cilíndrico" value={formik.values.spot_cilindrico_oe}  onChange={(v) => formik.setFieldValue('spot_cilindrico_oe', v)} />
          <Input id="spot_eixo_oe"        label="Refração eixo"       value={formik.values.spot_eixo_oe}        onChange={(v) => formik.setFieldValue('spot_eixo_oe', v)} />
          <Input id="spot_eq_esferico_oe" label="Eq. esférico"        value={formik.values.spot_eq_esferico_oe} onChange={(v) => formik.setFieldValue('spot_eq_esferico_oe', v)} />
          <Input id="spot_dp_oe"          label="DP"                  value={formik.values.spot_dp_oe}          onChange={(v) => formik.setFieldValue('spot_dp_oe', v)} />
        </div>
        <div className="detail-form__grid detail-form__grid--full">
          {ta('spot_observacao', 'Observação encontrada no Spot Vision')}
        </div>
      </div>

      {/* Anamnese */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Anamnese</p>
        <div className="detail-form__grid detail-form__grid--full">
          {ta('anamnese', 'Anamnese', 4)}
        </div>
      </div>

      {/* Refração Estática */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Refração Estática</p>
        <p className="detail-form__sub-label">Olho direito</p>
        <div className="detail-form__grid">
          <Input id="ref_estatica_esferico_od"   label="Esférico"        value={formik.values.ref_estatica_esferico_od}   onChange={(v) => formik.setFieldValue('ref_estatica_esferico_od', v)} />
          <Input id="ref_estatica_cilindrico_od" label="Cilíndrico"      value={formik.values.ref_estatica_cilindrico_od} onChange={(v) => formik.setFieldValue('ref_estatica_cilindrico_od', v)} />
          <Input id="ref_estatica_eixo_od"       label="Eixo"            value={formik.values.ref_estatica_eixo_od}       onChange={(v) => formik.setFieldValue('ref_estatica_eixo_od', v)} />
          <Input id="ref_estatica_acuidade_od"   label="Acuidade visual" value={formik.values.ref_estatica_acuidade_od}   onChange={(v) => formik.setFieldValue('ref_estatica_acuidade_od', v)} />
        </div>
        <p className="detail-form__sub-label">Olho esquerdo</p>
        <div className="detail-form__grid">
          <Input id="ref_estatica_esferico_oe"   label="Esférico"        value={formik.values.ref_estatica_esferico_oe}   onChange={(v) => formik.setFieldValue('ref_estatica_esferico_oe', v)} />
          <Input id="ref_estatica_cilindrico_oe" label="Cilíndrico"      value={formik.values.ref_estatica_cilindrico_oe} onChange={(v) => formik.setFieldValue('ref_estatica_cilindrico_oe', v)} />
          <Input id="ref_estatica_eixo_oe"       label="Eixo"            value={formik.values.ref_estatica_eixo_oe}       onChange={(v) => formik.setFieldValue('ref_estatica_eixo_oe', v)} />
          <Input id="ref_estatica_acuidade_oe"   label="Acuidade visual" value={formik.values.ref_estatica_acuidade_oe}   onChange={(v) => formik.setFieldValue('ref_estatica_acuidade_oe', v)} />
        </div>
      </div>

      {/* Biomicroscopia */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Biomicroscopia</p>
        <div className="detail-form__grid">
          {ta('biomicroscopia_od', 'Olho direito')}
          {ta('biomicroscopia_oe', 'Olho esquerdo')}
        </div>
      </div>

      {/* Fundoscopia */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Fundoscopia</p>
        <div className="detail-form__grid">
          {ta('fundoscopia_od', 'Olho direito')}
          {ta('fundoscopia_oe', 'Olho esquerdo')}
        </div>
      </div>

      {/* Motilidade Ocular */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Motilidade Ocular</p>
        <div className="detail-form__grid detail-form__grid--full">
          {ta('motilidade_ocular', 'Motilidade ocular')}
        </div>
      </div>

      {/* Diagnóstico e Conduta */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Diagnóstico e Conduta</p>
        <div className="detail-form__grid">
          <Select id="precisa_oculos" label="Precisa de óculos?"
            value={formik.values.precisa_oculos}
            onChange={(v) => formik.setFieldValue('precisa_oculos', v)}
            options={SIM_NAO} />
        </div>
        <div className="detail-form__grid detail-form__grid--full">
          {ta('diagnostico', 'Diagnóstico')}
          {ta('conduta', 'Conduta')}
        </div>
      </div>

      {/* Acompanhamento */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Justificativas para Acompanhamento</p>
        <div className="form-checklist">
          {ACOMPANHAMENTOS.map(({ key, label }) => (
            <label key={key} className="form-check-item">
              <input type="checkbox"
                checked={(vals[key] as boolean) ?? false}
                onChange={(e) => formik.setFieldValue(key, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
        <div className="detail-form__grid" style={{ marginTop: '1rem' }}>
          <Input id="proxima_consulta_meses" label="Indicação próxima consulta (meses)"
            value={formik.values.proxima_consulta_meses}
            onChange={(v) => formik.setFieldValue('proxima_consulta_meses', v)} />
        </div>
      </div>

      {/* Observações */}
      <div className="detail-form__section">
        <p className="detail-form__section-title">Observações</p>
        <div className="detail-form__grid detail-form__grid--full">
          {ta('observacoes_consulta', 'Observações', 4)}
        </div>
      </div>

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar" type="submit" loading={loading} />
      </div>
    </form>
  );
};
