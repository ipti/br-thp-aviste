import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

const SEX_OPTIONS     = [{ label: 'Masculino', value: 0 }, { label: 'Feminino', value: 1 }];
const COLOR_OPTIONS   = [
  { label: 'Branca', value: 0 }, { label: 'Preta', value: 1 }, { label: 'Amarela', value: 2 },
  { label: 'Parda', value: 3 }, { label: 'Indígena', value: 4 }, { label: 'Não declarado', value: 5 },
];
const ZONE_OPTIONS    = [{ label: 'Urbana', value: 0 }, { label: 'Rural', value: 1 }];
const TURNO_OPTIONS   = [
  { label: 'Manhã', value: 'Manhã' }, { label: 'Tarde', value: 'Tarde' },
  { label: 'Noite', value: 'Noite' }, { label: 'Integral', value: 'Integral' },
];

const DATE_RE = /^\d{2}\/\d{2}\/\d{4}$/;
const CPF_RE  = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const schema = yup.object({
  name:       yup.string().required('Obrigatório'),
  birthday:   yup.string().matches(DATE_RE, 'Use DD/MM/AAAA').required('Obrigatório'),
  cpf:        yup.string().optional().test('cpf', 'CPF inválido', (v) => !v || CPF_RE.test(v)),
  sex:        yup.number().min(0).required('Obrigatório'),
  color_race: yup.number().min(0).required('Obrigatório'),
  zone:       yup.number().min(0).required('Obrigatório'),
  turno:      yup.string().nullable().optional(),
});

interface Props {
  student: Student;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  onCancel: () => void;
}

export const BasicInfoForm = ({ student, onSubmit, loading, onCancel }: Props) => {
  const formik = useFormik({
    initialValues: {
      name:       student.name,
      birthday:   student.birthday,
      cpf:        student.cpf ?? '',
      sex:        student.sex,
      color_race: student.color_race,
      zone:       student.zone,
      deficiency: student.deficiency,
      turno:      student.turno ?? null,
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">
      <div className="detail-form__grid">
        <Input
          id="bi-name"
          label="Nome completo"
          value={formik.values.name}
          onChange={(v) => formik.setFieldValue('name', v)}
          error={formik.touched.name ? formik.errors.name : undefined}
          required
        />
        <Input
          id="bi-birthday"
          label="Data de nascimento"
          value={formik.values.birthday}
          onChange={(v) => formik.setFieldValue('birthday', v)}
          error={formik.touched.birthday ? formik.errors.birthday : undefined}
          placeholder="DD/MM/AAAA"
          mask="date"
          required
        />
        <Input
          id="bi-cpf"
          label="CPF"
          value={formik.values.cpf}
          onChange={(v) => formik.setFieldValue('cpf', v)}
          error={formik.touched.cpf ? formik.errors.cpf : undefined}
          placeholder="000.000.000-00"
          mask="cpf"
        />
        <Select
          id="bi-sex"
          label="Sexo"
          value={formik.values.sex}
          onChange={(v) => formik.setFieldValue('sex', v)}
          options={SEX_OPTIONS}
          error={formik.touched.sex ? formik.errors.sex : undefined}
          required
        />
        <Select
          id="bi-color_race"
          label="Cor/Raça"
          value={formik.values.color_race}
          onChange={(v) => formik.setFieldValue('color_race', v)}
          options={COLOR_OPTIONS}
          error={formik.touched.color_race ? formik.errors.color_race : undefined}
          required
        />
        <Select
          id="bi-zone"
          label="Zona"
          value={formik.values.zone}
          onChange={(v) => formik.setFieldValue('zone', v)}
          options={ZONE_OPTIONS}
          error={formik.touched.zone ? formik.errors.zone : undefined}
          required
        />
        <Select
          id="bi-turno"
          label="Turno"
          value={formik.values.turno}
          onChange={(v) => formik.setFieldValue('turno', v)}
          options={TURNO_OPTIONS}
          error={formik.touched.turno ? formik.errors.turno : undefined}
          required
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
          <input
            type="checkbox"
            id="bi-deficiency"
            checked={formik.values.deficiency}
            onChange={(e) => formik.setFieldValue('deficiency', e.target.checked)}
          />
          <label htmlFor="bi-deficiency" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
            Possui deficiência
          </label>
        </div>
      </div>

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar" type="submit" loading={loading} />
      </div>
    </form>
  );
};
