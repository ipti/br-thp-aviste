import './styles.scss';

export interface FABProps {
  onClick: () => void;
  title?: string;
}

export const FAB = ({ onClick, title = 'Adicionar' }: FABProps) => (
  <button
    type="button"
    className="ui-fab"
    onClick={onClick}
    title={title}
    aria-label={title}
  >
    <i className="pi pi-plus" />
  </button>
);
