import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

const schema = yup.object({
  data_entrega_oculos: yup.string().required('Obrigatório'),
  responsavel_entrega_oculos: yup.string().required('Obrigatório'),
  entrega_oculos_confirmada: yup.boolean().oneOf([true], 'Confirmação obrigatória').required(),
});

interface Props {
  student: Student;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  onCancel: () => void;
}

export const GlassesDeliveryForm = ({ student, onSubmit, loading, onCancel }: Props) => {
  const formik = useFormik({
    initialValues: {
      data_entrega_oculos: student.data_entrega_oculos ?? '',
      responsavel_entrega_oculos: student.responsavel_entrega_oculos ?? '',
      entrega_oculos_confirmada: Boolean(student.entrega_oculos_concluida),
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">
      <div className="detail-form__grid">
        <Input
          id="data_entrega_oculos"
          label="Data da entrega"
          value={formik.values.data_entrega_oculos}
          onChange={(v) => formik.setFieldValue('data_entrega_oculos', v)}
          error={formik.touched.data_entrega_oculos ? formik.errors.data_entrega_oculos : undefined}
          placeholder="DD/MM/AAAA"
          mask="date"
          required
        />
        <Input
          id="responsavel_entrega_oculos"
          label="Responsável pela entrega"
          value={formik.values.responsavel_entrega_oculos}
          onChange={(v) => formik.setFieldValue('responsavel_entrega_oculos', v)}
          error={formik.touched.responsavel_entrega_oculos ? formik.errors.responsavel_entrega_oculos : undefined}
          placeholder="Nome completo"
          required
        />
      </div>

      <label className="form-check-item" style={{ marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={formik.values.entrega_oculos_confirmada}
          onChange={(e) => formik.setFieldValue('entrega_oculos_confirmada', e.target.checked)}
        />
        <span>Confirmo que os óculos foram entregues ao aluno</span>
      </label>
      {formik.touched.entrega_oculos_confirmada && formik.errors.entrega_oculos_confirmada && (
        <small className="ui-input__error">{formik.errors.entrega_oculos_confirmada}</small>
      )}

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar Entrega" type="submit" loading={loading} />
      </div>
    </form>
  );
};
