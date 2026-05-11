import { useState } from 'react';
import './styles.scss';

export interface TableColumn<T = Record<string, unknown>> {
  field: string;
  header: string;
  body?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T extends object> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  rows?: number;
  onRowClick?: (row: T) => void;
}

const SKELETON_ROWS = 5;

export const Table = <T extends object>({
  data,
  columns,
  loading,
  emptyMessage = 'Nenhum registro encontrado',
  rows = 10,
  onRowClick,
}: TableProps<T>) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / rows);
  const paged = data.slice(page * rows, page * rows + rows);

  return (
    <div className="ui-table">
      <div className="ui-table__wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  style={{ width: col.width, textAlign: col.align ?? 'left' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, ri) => (
                <tr key={ri} className="ui-table__skeleton-row">
                  {columns.map((col) => (
                    <td key={col.field}>
                      <span className="ui-table__skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ui-table__empty">
                  <i className="pi pi-inbox" />
                  <span>{emptyMessage}</span>
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => (
                <tr
                  key={ri}
                  className={onRowClick ? 'ui-table__row--clickable' : ''}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.field} style={{ textAlign: col.align ?? 'left' }}>
                      {col.body
                        ? col.body(row)
                        : String((row as Record<string, unknown>)[col.field] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="ui-table__pagination">
          <span className="ui-table__pagination-info">
            {page * rows + 1}–{Math.min((page + 1) * rows, data.length)} de {data.length}
          </span>
          <div className="ui-table__pagination-controls">
            <button
              className="ui-table__page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Página anterior"
            >
              <i className="pi pi-chevron-left" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={['ui-table__page-btn', i === page ? 'ui-table__page-btn--active' : ''].filter(Boolean).join(' ')}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="ui-table__page-btn"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Próxima página"
            >
              <i className="pi pi-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
