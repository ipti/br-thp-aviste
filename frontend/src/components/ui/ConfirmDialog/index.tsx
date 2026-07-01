import { Dialog } from 'primereact/dialog';
import { Button } from '../Button';
import './styles.scss';

export interface ConfirmDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  visible,
  title = 'Confirmar exclusão',
  message,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog
    visible={visible}
    onHide={onCancel}
    header={null}
    footer={null}
    style={{ width: '420px' }}
    className="ui-confirm-dialog"
    draggable={false}
    resizable={false}
    closable={false}
    modal
  >
    <div className="ui-confirm-dialog__body">
      <div className="ui-confirm-dialog__icon">
        <i className="pi pi-exclamation-triangle" />
      </div>
      <h3 className="ui-confirm-dialog__title">{title}</h3>
      <p className="ui-confirm-dialog__message">{message}</p>
      <div className="ui-confirm-dialog__actions">
        <Button label={cancelLabel} variant="ghost" onClick={onCancel} type="button" />
        <Button label={confirmLabel} variant="danger" onClick={onConfirm} type="button" />
      </div>
    </div>
  </Dialog>
);
