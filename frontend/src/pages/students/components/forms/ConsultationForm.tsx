import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

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
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">
      <div className="detail-form__grid">
        <Input
          id="data_consulta"
          label="Data da consulta"
          value={formik.values.data_consulta}
          onChange={(v) => formik.setFieldValue('data_consulta', v)}
          error={formik.touched.data_consulta ? formik.errors.data_consulta : undefined}
          placeholder="DD/MM/AAAA"
          mask="date"
          required
        />
        <Input
          id="nome_medico"
          label="Nome do médico"
          value={formik.values.nome_medico}
          onChange={(v) => formik.setFieldValue('nome_medico', v)}
          error={formik.touched.nome_medico ? formik.errors.nome_medico : undefined}
          placeholder="Dr. Carlos Souza"
          required
        />
        <Input
          id="crm_medico"
          label="CRM"
          value={formik.values.crm_medico}
          onChange={(v) => formik.setFieldValue('crm_medico', v)}
          error={formik.touched.crm_medico ? formik.errors.crm_medico : undefined}
          placeholder="12345-SP"
          mask="crm"
          required
        />
      </div>

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar" type="submit" loading={loading} />
      </div>
    </form>
  );
};
