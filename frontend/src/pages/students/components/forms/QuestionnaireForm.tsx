import { useFormik } from 'formik';
import * as yup from 'yup';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

const HORAS_TELAS = [
  { label: 'Menos de 1h', value: 1 }, { label: '1-2h', value: 2 },
  { label: '2-4h', value: 3 }, { label: '4-8h', value: 4 }, { label: 'Mais de 8h', value: 5 },
];
const HORAS_AR_LIVRE = [
  { label: 'Menos de 30min', value: 1 }, { label: '30min - 1h', value: 2 },
  { label: '1-2h', value: 3 }, { label: 'Mais de 2h', value: 4 },
];
const SIM_NAO = [{ label: 'Não', value: '0' }, { label: 'Sim', value: '1' }];

const SINTOMAS = [
  { key: 'dificuldade_quadro',     label: 'Dificuldade para ver o quadro' },
  { key: 'dificuldade_livro',      label: 'Dificuldade para ler o livro' },
  { key: 'olho_torto_constante',   label: 'Olho torto constante' },
  { key: 'olho_torto_momentos',    label: 'Olho torto em momentos' },
  { key: 'rosto_aperta_olhos',     label: 'Aperta os olhos para ver' },
  { key: 'tremor_olhos',           label: 'Tremor nos olhos' },
  { key: 'mancha_branca_pupila',   label: 'Mancha branca na pupila' },
];

const DOENCAS = [
  { key: 'olho_preguicoso',        label: 'Olho preguiçoso (ambliopia)' },
  { key: 'olho_torto_doenca',      label: 'Olho torto (estrabismo)' },
  { key: 'catarata_infancia',      label: 'Catarata na infância' },
  { key: 'glaucoma_congenito',     label: 'Glaucoma congênito' },
  { key: 'tumor_olhos',            label: 'Tumor nos olhos' },
  { key: 'ceratocone_transplante', label: 'Ceratocone/Transplante' },
  { key: 'palpebra_caida',         label: 'Pálpebra caída (ptose)' },
];

const HISTORICO = [
  { key: 'miopia_ambos_pais',          label: 'Miopia em ambos os pais' },
  { key: 'miopia_um_pai',              label: 'Miopia em um dos pais' },
  { key: 'hipermetropia_astigmatismo', label: 'Hipermetropia/Astigmatismo' },
  { key: 'estrabismo',                 label: 'Estrabismo familiar' },
  { key: 'catarata_glaucoma',          label: 'Catarata/Glaucoma familiar' },
  { key: 'olho_preguicoso_familiar',   label: 'Olho preguiçoso familiar' },
  { key: 'tumor_olho_familiar',        label: 'Tumor ocular familiar' },
];

const CONDICOES = [
  { key: 'prematuridade',              label: 'Prematuridade' },
  { key: 'sindrome_down',              label: 'Síndrome de Down' },
  { key: 'paralisia_tumor_cerebral',   label: 'Paralisia/Tumor cerebral' },
  { key: 'outras_sindromes_geneticas', label: 'Outras síndromes genéticas' },
  { key: 'diabetes',                   label: 'Diabetes' },
  { key: 'artrite_artrose',            label: 'Artrite/Artrose' },
  { key: 'alergias_corticoides',       label: 'Alergias/Corticóides' },
];

const BOOL_KEYS = [...SINTOMAS, ...DOENCAS, ...HISTORICO, ...CONDICOES].map((f) => f.key);

const schema = yup.object({
  filho_oculos:                    yup.string().oneOf(['0', '1']).required(),
  horas_uso_aparelhos_eletronicos: yup.number().min(1).max(5).required(),
  horas_atividades_ao_ar_livre:    yup.number().min(1).max(4).required(),
  ...Object.fromEntries(BOOL_KEYS.map((k) => [k, yup.boolean().required()])),
});

interface Props {
  student: Student;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  onCancel: () => void;
}

export const QuestionnaireForm = ({ student, onSubmit, loading, onCancel }: Props) => {
  const formik = useFormik({
    initialValues: {
      filho_oculos: student.filho_oculos ?? '0',
      horas_uso_aparelhos_eletronicos: student.horas_uso_aparelhos_eletronicos ?? 1,
      horas_atividades_ao_ar_livre: student.horas_atividades_ao_ar_livre ?? 3,
      ...Object.fromEntries(BOOL_KEYS.map((k) => [k, Boolean(student[k as keyof typeof student])])),
    },
    validationSchema: schema,
    onSubmit,
  });

  const CheckGroup = ({ items }: { items: { key: string; label: string }[] }) => (
    <div className="form-checklist">
      {items.map((f) => (
        <label key={f.key} className="form-check-item">
          <input
            type="checkbox"
            checked={Boolean(formik.values[f.key as keyof typeof formik.values])}
            onChange={(e) => formik.setFieldValue(f.key, e.target.checked)}
          />
          <span>{f.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">
      <div className="detail-form__section">
        <p className="detail-form__section-title">Hábitos</p>
        <div className="detail-form__grid">
          <Select id="filho_oculos" label="O filho usa óculos?"
            value={formik.values.filho_oculos}
            onChange={(v) => formik.setFieldValue('filho_oculos', v)}
            options={SIM_NAO}
          />
          <Select id="horas_telas" label="Horas de tela por dia"
            value={formik.values.horas_uso_aparelhos_eletronicos}
            onChange={(v) => formik.setFieldValue('horas_uso_aparelhos_eletronicos', v)}
            options={HORAS_TELAS}
          />
          <Select id="horas_ar_livre" label="Horas ao ar livre por dia"
            value={formik.values.horas_atividades_ao_ar_livre}
            onChange={(v) => formik.setFieldValue('horas_atividades_ao_ar_livre', v)}
            options={HORAS_AR_LIVRE}
          />
        </div>
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Sintomas da criança</p>
        <CheckGroup items={SINTOMAS} />
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Doenças oculares</p>
        <CheckGroup items={DOENCAS} />
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Histórico familiar</p>
        <CheckGroup items={HISTORICO} />
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Condições médicas</p>
        <CheckGroup items={CONDICOES} />
      </div>

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar" type="submit" loading={loading} />
      </div>
    </form>
  );
};
