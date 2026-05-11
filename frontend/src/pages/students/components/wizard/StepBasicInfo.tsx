import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';

const SEX_OPTIONS = [{ label: 'Masculino', value: 0 }, { label: 'Feminino', value: 1 }];
const COLOR_OPTIONS = [
  { label: 'Branca', value: 0 }, { label: 'Preta', value: 1 }, { label: 'Amarela', value: 2 },
  { label: 'Parda', value: 3 }, { label: 'Indígena', value: 4 }, { label: 'Não declarado', value: 5 },
];
const ZONE_OPTIONS = [{ label: 'Urbana', value: 0 }, { label: 'Rural', value: 1 }];
const TURNO_OPTIONS = [
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
  onNext: (data: Record<string, unknown>) => void;
  initial: Record<string, unknown>;
  loading?: boolean;
}

export const StepBasicInfo = ({ onNext, initial, loading }: Props) => {
  const formik = useFormik({
    initialValues: {
      name:       (initial.name as string)    ?? '',
      birthday:   (initial.birthday as string) ?? '',
      cpf:        (initial.cpf as string)     ?? '',
      sex:        (initial.sex as number)     ?? null,
      color_race: (initial.color_race as number) ?? null,
      zone:       (initial.zone as number)    ?? null,
      deficiency: (initial.deficiency as boolean) ?? false,
      turno:      (initial.turno as string)   ?? null,
    },
    validationSchema: schema,
    onSubmit: (values) => onNext(values as unknown as Record<string, unknown>),
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="wizard-step">
      <h2 className="wizard-step__title">Dados Básicos</h2>

      <div className="wizard-step__grid">
        <Input
          id="name"
          label="Nome completo"
          value={formik.values.name}
          onChange={(v) => formik.setFieldValue('name', v)}
          error={formik.touched.name ? formik.errors.name : undefined}
          placeholder="Nome completo"
          required
        />
        <Input
          id="birthday"
          label="Data de nascimento"
          value={formik.values.birthday}
          onChange={(v) => formik.setFieldValue('birthday', v)}
          error={formik.touched.birthday ? formik.errors.birthday : undefined}
          placeholder="DD/MM/AAAA"
          mask="date"
          required
        />
        <Input
          id="cpf"
          label="CPF"
          value={formik.values.cpf}
          onChange={(v) => formik.setFieldValue('cpf', v)}
          error={formik.touched.cpf ? formik.errors.cpf : undefined}
          placeholder="000.000.000-00"
          mask="cpf"
        />
        <Select
          id="sex"
          label="Sexo"
          value={formik.values.sex}
          onChange={(v) => formik.setFieldValue('sex', v)}
          options={SEX_OPTIONS}
          error={formik.touched.sex ? formik.errors.sex : undefined}
          required
        />
        <Select
          id="color_race"
          label="Cor/Raça"
          value={formik.values.color_race}
          onChange={(v) => formik.setFieldValue('color_race', v)}
          options={COLOR_OPTIONS}
          error={formik.touched.color_race ? formik.errors.color_race : undefined}
          required
        />
        <Select
          id="zone"
          label="Zona"
          value={formik.values.zone}
          onChange={(v) => formik.setFieldValue('zone', v)}
          options={ZONE_OPTIONS}
          error={formik.touched.zone ? formik.errors.zone : undefined}
          required
        />
        <Select
          id="turno"
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
            id="deficiency"
            checked={formik.values.deficiency}
            onChange={(e) => formik.setFieldValue('deficiency', e.target.checked)}
          />
          <label htmlFor="deficiency" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
            Possui deficiência
          </label>
        </div>
      </div>

      <div className="wizard-step__footer">
        <Button label="Continuar" type="submit" fullWidth size="lg" loading={loading} />
      </div>
    </form>
  );
};
