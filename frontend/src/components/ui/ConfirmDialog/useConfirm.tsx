import { useState, useCallback } from 'react';
import { ConfirmDialog } from './index';

interface OpenConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export function useConfirm() {
  const [state, setState] = useState<(OpenConfirmOptions & { visible: boolean }) | null>(null);

  const openConfirm = useCallback((options: OpenConfirmOptions) => {
    setState({ ...options, visible: true });
  }, []);

  const handleConfirm = () => {
    state?.onConfirm();
    setState(null);
  };

  const handleCancel = () => setState(null);

  const confirmNode = state ? (
    <ConfirmDialog
      visible={state.visible}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirmNode, openConfirm };
}
