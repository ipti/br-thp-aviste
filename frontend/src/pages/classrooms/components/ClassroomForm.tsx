import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { CreateClassroomData } from '../api/classroomsApi';

interface ClassroomFormProps {
  schoolId: number;
  initialData?: Partial<CreateClassroomData>;
  onSubmit: (data: CreateClassroomData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const schema = yup.object({
  name: yup.string().min(1, 'Obrigatório').required('Obrigatório'),
  year: yup.string().optional(),
});

export const ClassroomForm = ({
  schoolId,
  initialData,
  onSubmit,
  onCancel,
  loading,
}: ClassroomFormProps) => {
  const formik = useFormik({
    initialValues: { name: initialData?.name ?? '', year: initialData?.year ?? '' },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values) =>
      onSubmit({ name: values.name, school_fk: schoolId, year: values.year || undefined }),
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          id="classroom-name"
          label="Nome da turma"
          value={formik.values.name}
          onChange={(v) => formik.setFieldValue('name', v)}
          error={formik.touched.name ? formik.errors.name : undefined}
          placeholder="Ex: 5º Ano A"
          required
        />
        <Input
          id="classroom-year"
          label="Ano letivo"
          value={formik.values.year}
          onChange={(v) => formik.setFieldValue('year', v)}
          placeholder="Ex: 2026"
        />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button label="Cancelar" variant="ghost" onClick={onCancel} />
          <Button label="Salvar" type="submit" loading={loading} />
        </div>
      </div>
    </form>
  );
};
