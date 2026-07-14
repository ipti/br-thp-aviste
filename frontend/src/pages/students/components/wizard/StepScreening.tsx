import { useFormik } from 'formik';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';

const ACUIDADE = [
  { label: '20/100', value: '1' }, { label: '20/63', value: '2' }, { label: '20/50', value: '3' },
  { label: '20/40', value: '4' }, { label: '20/32', value: '5' }, { label: '20/25', value: '6' },
  { label: '20/20', value: '7' }, { label: 'Nenhum', value: 'nenhum' },
];

const PASSOU_FALHOU = [
  { label: 'Passou', value: '0' },
  { label: 'Falhou', value: '1' },
];
const SIM_NAO = [
  { label: 'Não', value: '0' },
  { label: 'Sim', value: '1' },
];

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  loading?: boolean;
  initial: Record<string, unknown>;
}

export const StepScreening = ({ onNext, loading, initial }: Props) => {
  const formik = useFormik({
    initialValues: {
      acuidade_triagem_direito: (initial.acuidade_triagem_direito as string) ?? '7',
      acuidade_triagem_esquerdo: (initial.acuidade_triagem_esquerdo as string) ?? '7',
      test_cover: (initial.test_cover as string) ?? '0',
      test_movimento_ocular: (initial.test_movimento_ocular as string) ?? '0',
      test_mancha_branca: (initial.test_mancha_branca as string) ?? '0',
      atendimento_oftalmologico_previo: (initial.atendimento_oftalmologico_previo as string) ?? '0',
      observacao_triagem: (initial.observacao_triagem as string) ?? '',
    },
    onSubmit: (values) => onNext(values as unknown as Record<string, unknown>),
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="wizard-step">
      <h2 className="wizard-step__title">Triagem Visual</h2>

      <div className="wizard-step__section">
        <p className="wizard-step__section-title">Acuidade Visual</p>
        <div className="wizard-step__grid">
          <Select
            id="acuidade_direito"
            label="Olho direito"
            value={formik.values.acuidade_triagem_direito}
            onChange={(v) => formik.setFieldValue('acuidade_triagem_direito', v)}
            options={ACUIDADE}
          />
          <Select
            id="acuidade_esquerdo"
            label="Olho esquerdo"
            value={formik.values.acuidade_triagem_esquerdo}
            onChange={(v) => formik.setFieldValue('acuidade_triagem_esquerdo', v)}
            options={ACUIDADE}
          />
        </div>
      </div>

      <div className="wizard-step__section">
        <p className="wizard-step__section-title">Histórico</p>
        <div className="wizard-step__grid">
          <Select
            id="atendimento_oftalmologico_previo"
            label="Já teve algum atendimento oftalmológico antes?"
            value={formik.values.atendimento_oftalmologico_previo}
            onChange={(v) => formik.setFieldValue('atendimento_oftalmologico_previo', v)}
            options={SIM_NAO}
          />
        </div>
      </div>

      <div className="wizard-step__section">
        <p className="wizard-step__section-title">Testes</p>
        <div className="wizard-step__grid">
          <Select
            id="test_cover"
            label="Teste cover"
            value={formik.values.test_cover}
            onChange={(v) => formik.setFieldValue('test_cover', v)}
            options={PASSOU_FALHOU}
          />
          <Select
            id="test_movimento"
            label="Movimento ocular"
            value={formik.values.test_movimento_ocular}
            onChange={(v) => formik.setFieldValue('test_movimento_ocular', v)}
            options={PASSOU_FALHOU}
          />
          <Select
            id="test_mancha"
            label="Mancha branca"
            value={formik.values.test_mancha_branca}
            onChange={(v) => formik.setFieldValue('test_mancha_branca', v)}
            options={PASSOU_FALHOU}
          />
        </div>
      </div>

      <div className="wizard-step__section">
        <p className="wizard-step__section-title">Observações</p>
        <div className="wizard-step__grid wizard-step__grid--full">
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

      <div className="wizard-step__footer">
        <Button label="Finalizar Matrícula" type="submit" loading={loading} fullWidth size="lg" />
      </div>
    </form>
  );
};
