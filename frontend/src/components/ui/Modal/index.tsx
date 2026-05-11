import { Dialog } from 'primereact/dialog';
import type { ReactNode } from 'react';
import './styles.scss';

export interface ModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export const Modal = ({ visible, onHide, title, children, footer, width = '480px' }: ModalProps) => (
  <Dialog
    visible={visible}
    onHide={onHide}
    header={title}
    footer={footer}
    style={{ width }}
    className="ui-modal"
    draggable={false}
    resizable={false}
    modal
  >
    {children}
  </Dialog>
);
