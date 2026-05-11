import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface SchoolFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const schema = yup.object({ name: yup.string().min(3, 'Mínimo 3 caracteres').required('Obrigatório') });

export const SchoolForm = ({ initialName = '', onSubmit, onCancel, loading }: SchoolFormProps) => {
  const formik = useFormik({
    initialValues: { name: initialName },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values) => onSubmit(values.name),
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Input
          id="school-name"
          label="Nome da escola"
          value={formik.values.name}
          onChange={(v) => formik.setFieldValue('name', v)}
          error={formik.touched.name ? formik.errors.name : undefined}
          placeholder="Ex: Escola Municipal João Paulo II"
          required
        />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button label="Cancelar" variant="ghost" onClick={onCancel} />
          <Button label="Salvar" type="submit" loading={loading} />
        </div>
      </div>
    </form>
  );
};
