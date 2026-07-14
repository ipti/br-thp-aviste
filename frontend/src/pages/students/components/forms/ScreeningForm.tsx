import { useFormik } from 'formik';
import * as yup from 'yup';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import type { Student } from '../../api/studentsApi';

const ACUIDADE_VALUES = ['1', '2', '3', '4', '5', '6', '7', 'nenhum'] as const;
const TESTE_VALUES    = ['0', '1'] as const;

const ACUIDADE_LABELS: Record<string, string> = {
  '1': '20/100', '2': '20/63', '3': '20/50', '4': '20/40',
  '5': '20/32',  '6': '20/25', '7': '20/20',
  'nenhum': 'Nenhum',
};
const ACUIDADE = ACUIDADE_VALUES.map((v) => ({ label: ACUIDADE_LABELS[v], value: v }));
const PASSOU_FALHOU = [
  { label: 'Passou', value: '0' },
  { label: 'Falhou', value: '1' },
];
const SIM_NAO = [
  { label: 'Não', value: '0' },
  { label: 'Sim', value: '1' },
];

const schema = yup.object({
  acuidade_triagem_direito:  yup.string().oneOf([...ACUIDADE_VALUES]).required('Obrigatório'),
  acuidade_triagem_esquerdo: yup.string().oneOf([...ACUIDADE_VALUES]).required('Obrigatório'),
  test_cover:                yup.string().oneOf([...TESTE_VALUES]).required('Obrigatório'),
  test_movimento_ocular:     yup.string().oneOf([...TESTE_VALUES]).required('Obrigatório'),
  test_mancha_branca:        yup.string().oneOf([...TESTE_VALUES]).required('Obrigatório'),
  atendimento_oftalmologico_previo: yup.string().oneOf([...TESTE_VALUES]).required('Obrigatório'),
  observacao_triagem: yup.string().max(2000).optional(),
});

interface Props {
  student: Student;
  onSubmit: (data: Record<string, unknown>) => void;
  loading?: boolean;
  onCancel: () => void;
}

export const ScreeningForm = ({ student, onSubmit, loading, onCancel }: Props) => {
  const formik = useFormik({
    initialValues: {
      acuidade_triagem_direito:  student.acuidade_triagem_direito  ?? '7',
      acuidade_triagem_esquerdo: student.acuidade_triagem_esquerdo ?? '7',
      test_cover:                student.test_cover                ?? '0',
      test_movimento_ocular:     student.test_movimento_ocular     ?? '0',
      test_mancha_branca:        student.test_mancha_branca        ?? '0',
      atendimento_oftalmologico_previo: student.atendimento_oftalmologico_previo ?? '0',
      observacao_triagem: student.observacao_triagem ?? '',
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="detail-form">
      <div className="detail-form__section">
        <p className="detail-form__section-title">Acuidade Visual</p>
        <div className="detail-form__grid">
          <Select
            id="acuidade_direito"
            label="Olho direito"
            value={formik.values.acuidade_triagem_direito}
            onChange={(v) => formik.setFieldValue('acuidade_triagem_direito', v)}
            options={ACUIDADE}
            error={formik.touched.acuidade_triagem_direito ? formik.errors.acuidade_triagem_direito : undefined}
            required
          />
          <Select
            id="acuidade_esquerdo"
            label="Olho esquerdo"
            value={formik.values.acuidade_triagem_esquerdo}
            onChange={(v) => formik.setFieldValue('acuidade_triagem_esquerdo', v)}
            options={ACUIDADE}
            error={formik.touched.acuidade_triagem_esquerdo ? formik.errors.acuidade_triagem_esquerdo : undefined}
            required
          />
        </div>
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Histórico</p>
        <div className="detail-form__grid">
          <Select
            id="atendimento_oftalmologico_previo"
            label="Já teve algum atendimento oftalmológico antes?"
            value={formik.values.atendimento_oftalmologico_previo}
            onChange={(v) => formik.setFieldValue('atendimento_oftalmologico_previo', v)}
            options={SIM_NAO}
            error={formik.touched.atendimento_oftalmologico_previo ? formik.errors.atendimento_oftalmologico_previo : undefined}
            required
          />
        </div>
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Testes</p>
        <div className="detail-form__grid">
          <Select
            id="test_cover"
            label="Teste cover"
            value={formik.values.test_cover}
            onChange={(v) => formik.setFieldValue('test_cover', v)}
            options={PASSOU_FALHOU}
            error={formik.touched.test_cover ? formik.errors.test_cover : undefined}
            required
          />
          <Select
            id="test_movimento"
            label="Movimento ocular"
            value={formik.values.test_movimento_ocular}
            onChange={(v) => formik.setFieldValue('test_movimento_ocular', v)}
            options={PASSOU_FALHOU}
            error={formik.touched.test_movimento_ocular ? formik.errors.test_movimento_ocular : undefined}
            required
          />
          <Select
            id="test_mancha"
            label="Mancha branca"
            value={formik.values.test_mancha_branca}
            onChange={(v) => formik.setFieldValue('test_mancha_branca', v)}
            options={PASSOU_FALHOU}
            error={formik.touched.test_mancha_branca ? formik.errors.test_mancha_branca : undefined}
            required
          />
        </div>
      </div>

      <div className="detail-form__section">
        <p className="detail-form__section-title">Observações</p>
        <div className="detail-form__grid detail-form__grid--full">
          <div className="ui-input">
            <label htmlFor="observacao_triagem" className="ui-input__label">Observações da triagem</label>
            <textarea
              id="observacao_triagem"
              className="ui-input__textarea"
              rows={4}
              maxLength={2000}
              value={formik.values.observacao_triagem}
              onChange={(e) => formik.setFieldValue('observacao_triagem', e.target.value)}
              placeholder="Anotações adicionais sobre a triagem visual..."
            />
          </div>
        </div>
      </div>

      <div className="detail-form__actions">
        <Button label="Cancelar" variant="ghost" onClick={onCancel} type="button" />
        <Button label="Salvar" type="submit" loading={loading} />
      </div>
    </form>
  );
};
