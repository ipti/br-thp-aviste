import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import type { CreateUserData, UserRole } from '../api/usersApi';

const ROLE_OPTIONS = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Triador', value: 'TRIADOR' },
  { label: 'Médico', value: 'MEDICO' },
];

interface UserFormProps {
  initialData?: Partial<CreateUserData>;
  onSubmit: (data: CreateUserData) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const schema = (isEdit: boolean) =>
  yup.object({
    name: yup.string().min(3, 'Mínimo 3 caracteres').required('Obrigatório'),
    username: yup.string().min(3, 'Mínimo 3 caracteres').required('Obrigatório'),
    password: isEdit
      ? yup.string().optional()
      : yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
    role: yup.string().required('Obrigatório'),
  });

export const UserForm = ({ initialData, onSubmit, onCancel, loading, isEdit = false }: UserFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: initialData?.name ?? '',
      username: initialData?.username ?? '',
      password: '',
      role: (initialData?.role ?? '') as UserRole,
    },
    validationSchema: schema(isEdit),
    enableReinitialize: true,
    onSubmit: (values) => {
      const data: CreateUserData = {
        name: values.name,
        username: values.username,
        password: values.password,
        role: values.role as UserRole,
      };
      if (isEdit && !values.password) delete (data as Partial<CreateUserData>).password;
      onSubmit(data);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input id="name" label="Nome" value={formik.values.name}
          onChange={(v) => formik.setFieldValue('name', v)}
          error={formik.touched.name ? formik.errors.name : undefined} required />
        <Input id="username" label="Usuário" value={formik.values.username}
          onChange={(v) => formik.setFieldValue('username', v)}
          error={formik.touched.username ? formik.errors.username : undefined}
          disabled={isEdit} required />
        <Input id="password" label={isEdit ? 'Nova senha (deixe em branco para manter)' : 'Senha'}
          type="password" value={formik.values.password}
          onChange={(v) => formik.setFieldValue('password', v)}
          error={formik.touched.password ? formik.errors.password : undefined}
          required={!isEdit} />
        <Select id="role" label="Perfil" value={formik.values.role}
          onChange={(v) => formik.setFieldValue('role', v)}
          options={ROLE_OPTIONS}
          error={formik.touched.role ? formik.errors.role : undefined} required />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button label="Cancelar" variant="ghost" onClick={onCancel} />
          <Button label="Salvar" type="submit" loading={loading} />
        </div>
      </div>
    </form>
  );
};
