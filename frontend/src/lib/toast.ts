import type { Toast } from 'primereact/toast';

let _ref: Toast | null = null;

export const toastService = {
  init(ref: Toast) {
    _ref = ref;
  },

  success(message: string, title = 'Sucesso') {
    _ref?.show({ severity: 'success', summary: title, detail: message, life: 3500 });
  },

  error(message: string, title = 'Erro') {
    _ref?.show({ severity: 'error', summary: title, detail: message, life: 5000 });
  },

  warn(message: string, title = 'Atenção') {
    _ref?.show({ severity: 'warn', summary: title, detail: message, life: 4000 });
  },
};
