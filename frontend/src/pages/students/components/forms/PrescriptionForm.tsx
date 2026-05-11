import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

// Ex: +1.50 | -2.75 | 0.00
const DIOPTER_RE = /^[+-]?\d{1,2}(\.\d{1,2})?$/;
// Eixo: inteiro 0–180
const AXIS_RE = /^\d{1,3}$/;

const optDiopter = yup.string().optional()
  .test('diopter', 'Formato inválido (ex: -1.50)', (v) => !v || DIOPTER_RE.test(v));
const optAxis = yup.string().optional()
  .test('axis', 'Valor inválido (0–180)', (v) => !v || (AXIS_RE.test(v) && Number(v) <= 180));

const schema = yup.object({
  receita_esferico_od:   optDiopter,
  receita_cilindrico_od: optDiopter,
  receita_eixo_od:       optAxis,
  receita_esferico_oe:   optDiopter,
  receita_cilindrico_oe: optDiopter,
  receita_eixo_oe:       optAxis,
  receita_adicao:        optDiopter,
  receita_dp:            yup.string().optional()
    .test('dp', 'Formato inválido (ex: 62.5)', (v) => !v || /^\d{1,3}(\.\d)?$/.test(v)),
});

interface Props {
  student: Student;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  onCancel: () => void;
}

export const PrescriptionForm = ({ student, onSubmit, loading, onCancel }: Props) => {
  const formik = useFormik({
    initialValues: {
      receita_esferico_od:   student.receita_esferico_od   ?? '',
      receita_cilindrico_od: student.receita_cilindrico_od ?? '',
      receita_eixo_od:       student.receita_eixo_od       ?? '',
      receita_esferico_oe:   student.receita_esferico_oe   ?? '',
      receita_cilindrico_oe: student.receita_cilindrico_oe ?? '',
      receita_eixo_oe:       student.receita_eixo_oe       ?? '',
      receita_adicao:        student.receita_adicao         ?? '',
      receita_dp:            student.receita_dp             ?? '',
    },
    validationSchema: schema,
    onSubmit,
  });

  const diopter = (id: keyof typeof formik.values, label: string) => (
    <Input
      id={id}
      label={label}
      value={formik.values[id]}
      onChange={(v) => formik.setFieldValue(id, v)}
      placeholder="-1.50"
      error={formik.touched[id] ? formik.errors[id] : undefined}
    />
  );

  const axis = (id: keyof typeof formik.values, label: string) => (
    <Input
      id={id}
      label={label}
      value={formik.values[id]}
      onChange={(v) => formik.setFieldValue(id, v)}
      placeholder="0–180"
      error={formik.touched[id] ? formik.errors[id] : undefined}
    />
  );

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">
      <div className="detail-form__section">
        <p className="detail-form__section-title">Olho Direito (OD)</p>
        <div className="detail-form__grid">
          {diopter('receita_esferico_od',   'Esférico')}
          {diopter('receita_cilindrico_od', 'Cilíndrico')}
          {axis(   'receita_eixo_od',       'Eixo')}
        </div>
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Olho Esquerdo (OE)</p>
        <div className="detail-form__grid">
          {diopter('receita_esferico_oe',   'Esférico')}
          {diopter('receita_cilindrico_oe', 'Cilíndrico')}
          {axis(   'receita_eixo_oe',       'Eixo')}
        </div>
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Outros</p>
        <div className="detail-form__grid">
          {diopter('receita_adicao', 'Adição')}
          <Input
            id="receita_dp"
            label="DP (distância pupilar)"
            value={formik.values.receita_dp}
            onChange={(v) => formik.setFieldValue('receita_dp', v)}
            placeholder="62.5"
            error={formik.touched.receita_dp ? formik.errors.receita_dp : undefined}
          />
        </div>
      </div>

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar" type="submit" loading={loading} />
      </div>
    </form>
  );
};
