import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface Props { onNext: (data: Record<string, unknown>) => void; }

export const StepConsent = ({ onNext }: Props) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Consentimento</h2>
      <p className="wizard-step__desc">
        Para realizar a triagem ocular, o responsável pelo aluno deve autorizar a coleta
        e uso dos dados para fins de saúde ocular escolar.
      </p>

      <label className="wizard-step__checkbox">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span>Confirmo que o responsável autorizou a triagem do aluno.</span>
      </label>

      <div className="wizard-step__footer">
        <Button
          label="Continuar"
          onClick={() => onNext({ permission: accepted })}
          disabled={!accepted}
          fullWidth
          size="lg"
        />
      </div>
    </div>
  );
};
