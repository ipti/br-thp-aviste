import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

const CPF_RE   = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const PHONE_RE = /^\(\d{2}\) \d{4,5}-\d{4}$/;

const makeSchema = (isMinor: boolean) =>
  yup.object({
    telephone: isMinor
      ? yup.string().test('phone', 'Use (11) 99999-9999', (v) => !v || PHONE_RE.test(v))
      : yup.string().required('Obrigatório').matches(PHONE_RE, 'Use (11) 99999-9999'),

    responsable_name: isMinor
      ? yup.string().required('Obrigatório').min(2, 'Nome muito curto')
      : yup.string().optional(),

    responsable_cpf: isMinor
      ? yup.string().required('Obrigatório').matches(CPF_RE, 'CPF inválido')
      : yup.string().test('cpf', 'CPF inválido', (v) => !v || CPF_RE.test(v)),

    responsable_telephone: isMinor
      ? yup.string().required('Obrigatório').matches(PHONE_RE, 'Use (11) 99999-9999')
      : yup.string().test('phone', 'Use (11) 99999-9999', (v) => !v || PHONE_RE.test(v)),

    responsable_email: isMinor
      ? yup.string().required('Obrigatório').email('E-mail inválido')
      : yup.string().email('E-mail inválido').optional(),

    is_legal_responsible:         yup.boolean(),
    image_sharing_not_authorized: yup.boolean(),
  });

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  initial: Record<string, unknown>;
  isMinor: boolean;
  loading?: boolean;
}

export const StepResponsible = ({ onNext, initial, isMinor, loading }: Props) => {
  const formik = useFormik({
    initialValues: {
      telephone:                    (initial.telephone as string)                    ?? '',
      responsable_name:             (initial.responsable_name as string)             ?? '',
      responsable_cpf:              (initial.responsable_cpf as string)              ?? '',
      responsable_telephone:        (initial.responsable_telephone as string)        ?? '',
      responsable_email:            (initial.responsable_email as string)            ?? '',
      is_legal_responsible:         (initial.is_legal_responsible as boolean)        ?? false,
      image_sharing_not_authorized: (initial.image_sharing_not_authorized as boolean) ?? false,
    },
    validationSchema: makeSchema(isMinor),
    onSubmit: (values) => onNext(values as unknown as Record<string, unknown>),
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="wizard-step">
      <h2 className="wizard-step__title">Dados do Responsável</h2>

      <div className="wizard-step__grid">
        {!isMinor && (
          <Input
            id="telephone"
            label="Telefone"
            value={formik.values.telephone}
            onChange={(v) => formik.setFieldValue('telephone', v)}
            error={formik.touched.telephone ? formik.errors.telephone : undefined}
            placeholder="(11) 99999-9999"
            mask="phone"
            required
          />
        )}

        {isMinor && (
          <>
            <Input
              id="responsable_name"
              label="Nome do responsável"
              value={formik.values.responsable_name}
              onChange={(v) => formik.setFieldValue('responsable_name', v)}
              error={formik.touched.responsable_name ? formik.errors.responsable_name : undefined}
              placeholder="Nome completo"
              required
            />
            <Input
              id="responsable_cpf"
              label="CPF do responsável"
              value={formik.values.responsable_cpf}
              onChange={(v) => formik.setFieldValue('responsable_cpf', v)}
              error={formik.touched.responsable_cpf ? formik.errors.responsable_cpf : undefined}
              placeholder="000.000.000-00"
              mask="cpf"
              required
            />
            <Input
              id="responsable_telephone"
              label="Telefone do responsável"
              value={formik.values.responsable_telephone}
              onChange={(v) => formik.setFieldValue('responsable_telephone', v)}
              error={formik.touched.responsable_telephone ? formik.errors.responsable_telephone : undefined}
              placeholder="(11) 99999-9999"
              mask="phone"
              required
            />
            <Input
              id="responsable_email"
              label="E-mail do responsável"
              value={formik.values.responsable_email}
              onChange={(v) => formik.setFieldValue('responsable_email', v)}
              error={formik.touched.responsable_email ? formik.errors.responsable_email : undefined}
              placeholder="email@exemplo.com"
              required
            />
            <Input
              id="telephone"
              label="Telefone do aluno"
              value={formik.values.telephone}
              onChange={(v) => formik.setFieldValue('telephone', v)}
              error={formik.touched.telephone ? formik.errors.telephone : undefined}
              placeholder="(11) 99999-9999"
              mask="phone"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="is_legal_responsible"
                checked={formik.values.is_legal_responsible}
                onChange={(e) => formik.setFieldValue('is_legal_responsible', e.target.checked)}
              />
              <label htmlFor="is_legal_responsible" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                É responsável legal
              </label>
            </div>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="image_sharing_not_authorized"
            checked={formik.values.image_sharing_not_authorized}
            onChange={(e) => formik.setFieldValue('image_sharing_not_authorized', e.target.checked)}
          />
          <label htmlFor="image_sharing_not_authorized" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
            Não autoriza compartilhamento de imagem
          </label>
        </div>
      </div>

      <div className="wizard-step__footer">
        <Button label="Finalizar" type="submit" fullWidth size="lg" loading={loading} />
      </div>
    </form>
  );
};
