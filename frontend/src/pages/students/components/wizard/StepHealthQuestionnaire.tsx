import { useFormik } from 'formik';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';

const HORAS_TELAS = [
  { label: 'Menos de 1h', value: 1 }, { label: '1-2h', value: 2 },
  { label: '2-4h', value: 3 }, { label: '4-8h', value: 4 }, { label: 'Mais de 8h', value: 5 },
];

const HORAS_AR_LIVRE = [
  { label: 'Menos de 30min', value: 1 }, { label: '30min - 1h', value: 2 },
  { label: '1-2h', value: 3 }, { label: 'Mais de 2h', value: 4 },
];

const SIM_NAO = [{ label: 'Sim', value: '1' }, { label: 'Não', value: '0' }];

const BOOL_FIELDS: { key: string; label: string }[] = [
  { key: 'dificuldade_quadro', label: 'Dificuldade para ver o quadro' },
  { key: 'dificuldade_livro', label: 'Dificuldade para ler o livro' },
  { key: 'olho_torto_constante', label: 'Olho torto constante' },
  { key: 'olho_torto_momentos', label: 'Olho torto em momentos' },
  { key: 'rosto_aperta_olhos', label: 'Aperta os olhos para ver' },
  { key: 'tremor_olhos', label: 'Tremor nos olhos' },
  { key: 'mancha_branca_pupila', label: 'Mancha branca na pupila' },
];

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  initial: Record<string, unknown>;
}

export const StepHealthQuestionnaire = ({ onNext, initial }: Props) => {
  const formik = useFormik({
    initialValues: {
      filho_oculos: (initial.filho_oculos as string) ?? '0',
      horas_uso_aparelhos_eletronicos: (initial.horas_uso_aparelhos_eletronicos as number) ?? 1,
      horas_atividades_ao_ar_livre: (initial.horas_atividades_ao_ar_livre as number) ?? 3,
      ...Object.fromEntries(BOOL_FIELDS.map((f) => [f.key, (initial[f.key] as boolean) ?? false])),
    },
    onSubmit: (values) => onNext(values as unknown as Record<string, unknown>),
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="wizard-step">
      <h2 className="wizard-step__title">Questionário de Saúde</h2>

      <div className="wizard-step__section">
        <p className="wizard-step__section-title">Hábitos</p>
        <div className="wizard-step__grid">
          <Select
            id="filho_oculos"
            label="O filho usa óculos?"
            value={formik.values.filho_oculos}
            onChange={(v) => formik.setFieldValue('filho_oculos', v)}
            options={SIM_NAO}
          />
          <Select
            id="horas_telas"
            label="Horas de uso de telas/dia"
            value={formik.values.horas_uso_aparelhos_eletronicos}
            onChange={(v) => formik.setFieldValue('horas_uso_aparelhos_eletronicos', v)}
            options={HORAS_TELAS}
          />
          <Select
            id="horas_ar_livre"
            label="Horas de atividade ao ar livre/dia"
            value={formik.values.horas_atividades_ao_ar_livre}
            onChange={(v) => formik.setFieldValue('horas_atividades_ao_ar_livre', v)}
            options={HORAS_AR_LIVRE}
          />
        </div>
      </div>

      <div className="wizard-step__section">
        <p className="wizard-step__section-title">Sintomas</p>
        <div className="wizard-step__checklist">
          {BOOL_FIELDS.map((f) => (
            <label key={f.key} className="wizard-step__check-item">
              <input
                type="checkbox"
                checked={Boolean(formik.values[f.key as keyof typeof formik.values])}
                onChange={(e) => formik.setFieldValue(f.key, e.target.checked)}
              />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="wizard-step__footer">
        <Button label="Continuar" type="submit" fullWidth size="lg" />
      </div>
    </form>
  );
};
